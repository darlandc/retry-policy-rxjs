import { InMemoryDbService } from 'angular-in-memory-web-api';

export class TestData implements InMemoryDbService {
  createDb() {
    let productDetails = [
      { id: 101, name: 'Product A', category: 'Management' },
      { id: 102, name: 'Product B', category: 'Software' },
      { id: 103, name: 'Product C', category: 'Engineering' }
    ];
    return { products: productDetails };
  }
}
