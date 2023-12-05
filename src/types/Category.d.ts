type CategoryType = {
  id: string;
  name: string;
  children: CategoryType[];
  products: ProductType[];
  parent?: string | null;
};
