import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';

@Component({
  selector: 'app-updateproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card mx-auto mt-4" style="max-width: 700px;">
      <div class="card-header fw-bold">Update Product</div>
      <div class="card-body">
        @if (message()) {
          <div class="alert" [class.alert-success]="!error()" [class.alert-danger]="error()" role="alert">
            {{ message() }}
          </div>
        }

        <div class="mb-3">
          <label class="form-label">Find Product by ID</label>
          <input type="number" class="form-control" [(ngModel)]="searchId" name="searchId" />
          <button type="button" class="btn btn-outline-primary mt-2" (click)="loadProduct()">Load Product</button>
        </div>

        @if (product._id || product.id) {
          <form (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label">Product ID</label>
              <input type="number" class="form-control" [(ngModel)]="product.id" name="id" />
            </div>

            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" [(ngModel)]="product.name" name="name" />
            </div>

            <div class="mb-3">
              <label class="form-label">Type</label>
              <input type="text" class="form-control" [(ngModel)]="product.type" name="type" maxlength="50" />
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" rows="3" [(ngModel)]="product.description" name="description"></textarea>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Price</label>
                <input type="number" step="0.01" class="form-control" [(ngModel)]="product.price" name="price" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Units</label>
                <input type="number" class="form-control" [(ngModel)]="product.units" name="units" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary mt-4">Update Product</button>
          </form>
        }
      </div>
    </div>
  `
})
export class Updateproduct {
  private readonly productService = inject(ProductService);
  searchId = 0;
  product = new Product('', 0, '', 0, 0);
  message = signal('');
  error = signal(false);

  loadProduct() {
    this.productService.loadProducts().subscribe({
      next: (products) => {
        const match = products.find((item) => Number(item.id) === Number(this.searchId));
        if (!match) {
          this.error.set(true);
          this.message.set('Product not found.');
          this.product = new Product('', 0, '', 0, 0);
          return;
        }

        this.product = { ...match };
        this.error.set(false);
        this.message.set('');
      },
      error: () => {
        this.error.set(true);
        this.message.set('Unable to load products.');
      }
    });
  }

  submit() {
    this.productService.updateProd(this.product).subscribe({
      next: () => {
        this.error.set(false);
        this.message.set('Product updated successfully.');
      },
      error: () => {
        this.error.set(true);
        this.message.set('Unable to update product.');
      }
    });
  }
}
