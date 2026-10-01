import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting,HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../model/product';
import { environment } from '../../environments/environment';


describe('ProductService', () => {
  let service: ProductService;
  
  let httpMock: HttpTestingController;
  const mockProducts: Product[] = [
    { _id: 'abc', id: 1, name: 'VisionX Ultra HD 50', type: 'Television', description: '4K smart TV', price: 649, units: 4 }
  ];
  const mockProduct: Product = mockProducts[0];


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    
  });

  afterEach(() => {
    httpMock.verify(); // ensure no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products via GET', () => {
    service.loadProducts().subscribe((data) => {
      expect(data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiServer}/api/getProdlist`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add a product via POST', () => {
    const response = { error: false, id: 'abc123', product: mockProduct };

    service.addProd(mockProduct).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiServer}/api/prod`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(response);
  });

  it('should update a product via PUT', () => {
    const response = { ok: mockProduct._id! };
    service.updateProd(mockProduct).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiServer}/api/prod`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(response);
  });

  it('should delete a product via DELETE with body', () => {
    const response = { deleted: true, _id: mockProduct._id! };
    service.deleteProd(mockProduct).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiServer}/api/prod`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(response);
  });
});