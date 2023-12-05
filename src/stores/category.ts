import { create } from 'zustand';

type SetCategoryArgs = {
  children: CategoryType[];
  products: ProductType[];
  parentId?: string | null;
};

type CategoryStore = {
  children: CategoryType[];
  products: ProductType[];
  parentId: string | null;
  setCategory(args: SetCategoryArgs): void;
};

export const useCategoryStore = create<CategoryStore>()((set) => ({
  children: [],
  products: [],
  parentId: null,
  setCategory: ({ children, products, parentId = null }) => set(() => ({ children, products, parentId })),
}));
