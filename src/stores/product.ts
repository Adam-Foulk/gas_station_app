import { create } from 'zustand';

type ProductStore = {
  products: ProductType[];
  setProducts(products: ProductType[]): void;
};

export const useProductStore = create<ProductStore>()((set) => ({
  products: [],
  setProducts: (products) => set(() => ({ products })),
}));
