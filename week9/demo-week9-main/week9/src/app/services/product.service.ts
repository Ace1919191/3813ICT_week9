import { Injectable, inject, signal } from '@angular/core';
import { Product } from '../model/product';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 private readonly http = inject(HttpClient);
 products = signal<Product[]>([]);

 loadProducts(): Observable<Product[]> {
   return this.http.get<Product[]>(`${environment.apiServer}/api/getProdlist`);
 }

 updateProd(product: Product) {
   return this.http.put<{ ok: string }>(`${environment.apiServer}/api/prod`, product);
 }

 addProd(product: Product) {
   return this.http.post<{ error: boolean; id: string; product: Product }>(
     `${environment.apiServer}/api/prod`,
     product
   );
 }

 deleteProd(product: Product) {
   return this.http.delete<{ deleted: boolean; _id: string }>(
     `${environment.apiServer}/api/prod`,
     { body: product }
   );
 }
}
