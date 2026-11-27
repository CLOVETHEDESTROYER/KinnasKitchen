import catalog from '../data/storefront.json';
export type Product = typeof catalog.products[number] & {pricesByHeat?:Record<string,number>};
export const products:Product[] = catalog.products;
export const productPath = (p: Product) => `/shop/${p.slug}`;
export const recipePath = (p: Product) => `/recipes/${p.recipeSlug}`;
export const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
