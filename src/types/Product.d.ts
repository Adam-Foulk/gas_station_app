type ProductType = {
  id: string;
  name: string;
  price: number;
  type: ProductTypeType;
  remainder?: ProductRemainderType;
};

type ProductTypeType = {
  id: string;
  name: string;
};

type ProductRemainderType = {
  id?: string;
  count: number;
  product: string;
  unit: ProductRemainderUnitType;
};

type ProductRemainderUnitType = {
  id?: string;
  name: string;
  slug: string;
};
