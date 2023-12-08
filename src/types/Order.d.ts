type NewOrderProduct = {
  id?: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
};

type NewOrder = {
  products: NewOrderProduct[];
};

type OrderType = {
  cash_desk: string;
  products: string[] | OrderType[];
  user: string;
};

type OrderStatus = 'created' | 'paid' | 'canceled';
