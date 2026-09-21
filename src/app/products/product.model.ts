export type ProductCategory = 'Pizza' | 'Sides' | 'Drinks';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  mediumPrice?: number;
  largePrice?: number;
}

export type ProductDraft = Omit<Product, 'id'>;
