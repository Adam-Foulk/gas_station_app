type NewOrderProduct = {
  id?: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  remainder?: ProductRemainderType;
};

type NewOrder = {
  products: NewOrderProduct[];
};

type OrderType = {
  id?: string;
  cash_desk: string;
  products: string[] | OrderType[];
  user: string;
};

type OrderStatus = 'created' | 'paid' | 'canceled';
