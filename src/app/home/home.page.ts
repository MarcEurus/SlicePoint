import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, createOutline, moonOutline, pizzaOutline, searchOutline, sunnyOutline, trashOutline } from 'ionicons/icons';
import { ProductCategory } from '../products/product.model';
import { ProductService } from '../products/product.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ReactiveFormsModule, IonHeader, IonToolbar, IonContent, IonIcon, IonModal],
})
export class HomePage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  readonly products = this.productService.products;
  readonly searchTerm = signal('');
  readonly selectedCategory = signal<'All' | ProductCategory>('All');
  readonly formOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly feedback = signal('');
  readonly isDarkMode = signal(localStorage.getItem('slicepoint-theme') === 'dark');
  readonly formCategory = signal<ProductCategory>('Pizza');
  readonly categories: Array<'All' | ProductCategory> = ['All', 'Pizza', 'Sides', 'Drinks'];
  readonly categoryOrder: ProductCategory[] = ['Pizza', 'Sides', 'Drinks'];
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    category: ['Pizza' as ProductCategory, Validators.required],
    description: ['', [Validators.required, Validators.maxLength(180)]],
    price: [0, [Validators.required, Validators.min(1)]],
    mediumPrice: [0, [Validators.min(1)]],
    largePrice: [0, [Validators.min(1)]],
  });
  readonly filteredProducts = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    return this.products().filter((product) =>
      (category === 'All' || product.category === category) &&
      (!query || `${product.name} ${product.description}`.toLowerCase().includes(query)),
    );
  });

  constructor() {
    addIcons({ add, createOutline, moonOutline, pizzaOutline, searchOutline, sunnyOutline, trashOutline });
    this.applyTheme();
  }

  productsFor(category: ProductCategory) { return this.filteredProducts().filter((product) => product.category === category); }
  toggleTheme(): void {
    this.isDarkMode.update((enabled) => !enabled);
    localStorage.setItem('slicepoint-theme', this.isDarkMode() ? 'dark' : 'light');
    this.applyTheme();
  }
  openCreate(): void { this.editingId.set(null); this.formCategory.set('Pizza'); this.form.reset({ name: '', category: 'Pizza', description: '', price: 0, mediumPrice: 0, largePrice: 0 }); this.formOpen.set(true); }
  openEdit(productId: string): void {
    const product = this.products().find((item) => item.id === productId);
    if (!product) return;
    this.editingId.set(product.id); this.formCategory.set(product.category);
    this.form.reset({ name: product.name, category: product.category, description: product.description, price: product.price, mediumPrice: product.mediumPrice ?? 0, largePrice: product.largePrice ?? 0 });
    this.formOpen.set(true);
  }
  closeForm(): void { this.formOpen.set(false); }
  onCategoryChange(): void { this.formCategory.set(this.form.controls.category.value); }
  saveProduct(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const draft = { name: value.name.trim(), category: value.category, description: value.description.trim(), price: value.category === 'Pizza' ? value.mediumPrice : value.price, ...(value.category === 'Pizza' ? { mediumPrice: value.mediumPrice, largePrice: value.largePrice } : {}) };
    if (this.editingId()) { this.productService.updateProduct(this.editingId()!, draft); this.showFeedback('Product updated'); }
    else { this.productService.addProduct(draft); this.showFeedback('Product added'); }
    this.closeForm();
  }
  deleteProduct(productId: string): void {
    const product = this.products().find((item) => item.id === productId);
    if (!product || !window.confirm(`Remove ${product.name} from the menu?`)) return;
    this.productService.deleteProduct(productId); this.showFeedback('Product removed');
  }
  private showFeedback(message: string): void { this.feedback.set(message); window.setTimeout(() => this.feedback.set(''), 2800); }
  private applyTheme(): void { document.documentElement.classList.toggle('dark', this.isDarkMode()); }
}
