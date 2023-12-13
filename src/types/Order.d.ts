type NewOrderProduct = {
  id?: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  remainder?: ProductRemainderType;
  station?: string;
};

type NewOrder = {
  products: NewOrderProduct[];
};

type OrderType = {
  id?: string;
  cash_desk: string;
  products: string[] | ProductType[];
  user: string | UserType;
};

type OrderStatus = 'created' | 'paid' | 'canceled';
