import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card mx-auto mt-4" style="max-width: 700px;">
      <div class="card-header fw-bold">Add Product</div>
      <div class="card-body">
        @if (message()) {
          <div class="alert" [class.alert-success]="!error()" [class.alert-danger]="error()" role="alert">
            {{ message() }}
          </div>
        }

        <form (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="form-label">Product ID</label>
            <input type="number" class="form-control" [(ngModel)]="product.id" name="id" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" [(ngModel)]="product.name" name="name" required />
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
              <input type="number" step="0.01" class="form-control" [(ngModel)]="product.price" name="price" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Units</label>
              <input type="number" class="form-control" [(ngModel)]="product.units" name="units" required />
            </div>
          </div>

          <button type="submit" class="btn btn-primary mt-4">Add Product</button>
        </form>
      </div>
    </div>
  `
})
export class Addproduct {
  private readonly productService = inject(ProductService);
  product = new Product('', 0, '', 0, 1);
  message = signal('');
  error = signal(false);

  submit() {
    this.productService.addProd(this.product).subscribe({
      next: (response) => {
        if (response?.error) {
          this.error.set(true);
          this.message.set('Duplicate product ID already exists.');
          return;
        }

        this.error.set(false);
        this.message.set('Product added successfully.');
        this.product = new Product('', 0, '', 0, this.product.id + 1);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(true);
        this.message.set(error.status === 409
          ? 'Duplicate product ID already exists.'
          : error.status === 400
            ? 'Check the product details and try again.'
            : 'Unable to add product.');
      }
    });
  }
}
