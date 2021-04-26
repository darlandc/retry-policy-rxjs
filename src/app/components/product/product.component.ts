import { Component, OnInit } from '@angular/core';
import { of, throwError } from 'rxjs';
import { switchMap, debounceTime, catchError, retry, mergeMap, retryWhen } from 'rxjs/operators';

import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { genericRetryStrategy } from 'src/app/utils/rxjs.utils';

@Component({
  selector: 'app-products',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  product: Product;
  productId = new FormControl();
  productForm: FormGroup = this.formBuilder.group({
    productId: this.productId
  });

  constructor(private productService: ProductService, private formBuilder: FormBuilder) { }
  ngOnInit() {
    //Total max 3 retry, but no success and throw error
    of(1, 2, 3, 4).pipe(
      mergeMap(data => {
        if (data === 3) {
          return throwError('Error Occurred.');
        }
        return of(data);
      }),
      retry(3)
    ).subscribe(res =>
      // console.log(res),
      err => {
        // console.log("Retried for 3 times.");
        // console.error(err);
      }
    );

    //Total max 5 retry, but subscribe success in 2 retry
    let retryCount = 0;
    of('a', 'b', 'c', 'd').pipe(
      mergeMap(data => {
        if (data === 'c' && retryCount !== 3) {
          retryCount = retryCount + 1;
          return throwError('Error Occurred.');
        }
        return of(data);
      }),
      retry(5)
    ).subscribe(res =>
      // console.log(res),
      err => {
        // console.log("Number of retry: " + retryCount);
        // console.error(err);
      },
      () => {
        // console.log("Processing Complete. Number of retry: " + retryCount)
      }
    );
    //-------------------------
    this.retryAndHandleError();
    this.searchProduct();
  }

  retryAndHandleError() {
    of("A", "B").pipe(
      switchMap(el => {
        if (el === "B") {
          throw new Error("Error occurred.");
        }
        return el;
      }),
      retry(2),
      catchError(err => {
        // console.error(err.message);
        // console.log("Error is handled");
        return of("X"); //return defualt value as X
      })
    ).subscribe(el =>
      // console.log(el),
      // err => console.error(err),
      () => console.log("Processing Complete.")
    );
  }

  searchProduct() {
    this.productId.valueChanges.pipe(
      debounceTime(0),
      switchMap(id => {
        return this.productService.getProduct(id);
      })
    ).subscribe(res => this.product = res,
      err => console.log(err));
  }

  test() {
    this.productService
      .getData(500)
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError(error => of(error))
      )
      .subscribe(console.log);

    // excluding status code, delay for logging clarity
    setTimeout(() => {
      this.productService
        .getData(500)
        .pipe(
          retryWhen(genericRetryStrategy({
            scalingDuration: 2000,
            excludedStatusCodes: [500]
          })),
          catchError(error => of(error))
        )
        .subscribe(e => console.log('Exluded code:', e.status));

    }, 8000);
  }
}

