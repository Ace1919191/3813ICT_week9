import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-productlist',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './productlist.html',
  styleUrl: './productlist.css'
})
export class Productlist implements OnInit {
  productService = inject(ProductService);
  pageTitle = 'Products';
  listCriteria = input.required<string>();
  products = signal<Product[]>([]);

  proderror = signal<string>('');
  editingProduct = signal<Product | null>(null);
  addingProduct = signal<Product | null>(null);
  deletingProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.productService.loadProducts().subscribe({
      next: (data: Product[]) => this.products.set(data),
      error: () => this.proderror.set('Failed to fetch products')
    });
  }

  openEdit(product: Product) {
    this.editingProduct.set({ ...product });
  }

  openAdd() {
    const temp = new Product('', 0, '', 0, this.nextId());
    this.addingProduct.set(temp);
  }

  saveAdd() {
    const added = this.addingProduct();
    if (!added) return;

    this.productService.addProd(added).subscribe({
      next: (data) => {
        const savedProduct = { ...added, _id: data.id ?? added._id };
        this.products.update((prods) => [...prods, savedProduct]);
        this.closeModal();
      },
      error: (error) => this.proderror.set(
        error.status === 409 ? 'Duplicate product ID already exists' : 'Unable to add product'
      )
    });
  }

  saveEdit() {
    const edited = this.editingProduct();
    if (!edited) return;

    this.productService.updateProd(edited).subscribe({
      next: () => {
        this.products.update((items) =>
          items.map((p) => (p._id === edited._id ? edited : p))
        );
        this.closeModal();
      },
      error: (error) => this.proderror.set(
        error.status === 409 ? 'Another product already uses this ID' : 'Unable to update product'
      )
    });
  }

  closeModal() {
    this.editingProduct.set(null);
    this.addingProduct.set(null);
    this.deletingProduct.set(null);
    this.proderror.set('');
  }

  filteredProducts = computed(() => {
    const query = this.listCriteria().toLowerCase();
    return this.products().filter((p) => p.name.toLowerCase().includes(query));
  });

  deleteProdConfirm(item: Product) {
    this.deletingProduct.set({ ...item });
  }

  deleteProd(item: Product) {
    this.productService.deleteProd(item).subscribe({
      next: () => {
        this.products.update((products) => products.filter((p) => p._id !== item._id && p.id !== item.id));
        this.closeModal();
      },
      error: () => this.proderror.set('Unable to delete product')
    });
  }

  private nextId(): number {
    return this.products().reduce((max, product) => Math.max(max, Number(product.id || 0)), 0) + 1;
  }
}
