type CheckType = {
  id?: string;
  order: string | OrderType;
  payment_method: PaymentMethod;
};

type PaymentMethod = 'cash' | 'card';
