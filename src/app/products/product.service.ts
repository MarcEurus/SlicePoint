import { Injectable, signal } from '@angular/core';
import { initialProducts } from './product.data';
import { Product, ProductDraft } from './product.model';

const STORAGE_KEY = 'slicepoint-products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsState = signal<Product[]>(this.loadProducts());
  readonly products = this.productsState.asReadonly();

  addProduct(draft: ProductDraft): void {
    this.productsState.update((products) => [
      { ...draft, id: this.createId(draft.name) },
      ...products,
    ]);
    this.persist();
  }

  updateProduct(id: string, draft: ProductDraft): void {
    this.productsState.update((products) =>
      products.map((product) => (product.id === id ? { ...draft, id } : product)),
    );
    this.persist();
  }

  deleteProduct(id: string): void {
    this.productsState.update((products) => products.filter((product) => product.id !== id));
    this.persist();
  }

  private loadProducts(): Product[] {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEY);
      return savedProducts ? JSON.parse(savedProducts) as Product[] : initialProducts;
    } catch {
      return initialProducts;
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.productsState()));
  }

  private createId(name: string): string {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${slug || 'product'}-${Date.now()}`;
  }
}
