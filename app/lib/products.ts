import catalog from '../data/storefront.json';
export const products = catalog.products;
export type Product = typeof products[number];
export const productPath = (p: Product) => `/shop/${p.slug}`;
export const recipePath = (p: Product) => `/recipes/${p.recipeSlug}`;
export const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
