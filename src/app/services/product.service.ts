import { Product } from './../interfaces/product';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    mockError500 = 'https://run.mocky.io/v3/48654a89-e0ee-42e8-95c4-55433d7ee5f6';
    // https://run.mocky.io/v3/48654a89-e0ee-42e8-95c4-55433d7ee5f6
    productsUrl = "/api/products";
    error500 = {
      status: 500,
      error: [
        {
          error: '500 mock',
          message: 'random text message'
        }
      ]
    }

    constructor(private http: HttpClient) { }

    getProduct(id: number): Observable<Product> {
      let url = this.productsUrl + "/" + id;

      return this.http.get<Product>(url).pipe(
        tap(() => console.log(url)),
        retry(3),  // retry the failed request up to 3 times
        catchError(err => {
            console.log(err);
            return of(null);
        })
      );
    }

    getMockError(): Observable<any>{
      return throwError(this.error500);
    }

    getData(status: number) {
      return throwError({status});
    }

    getError500(): Observable<any> {
      return this.http.get('https://run.mocky.io/v3/48654a89-e0ee-42e8-95c4-55433d7ee5f6', {});
    }
}
