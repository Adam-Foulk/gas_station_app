import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useOrder = () => {
  const { pb } = usePocketbase();

  const createOrderProduct = async (newProduct: NewOrderProduct): Promise<ProductType> => {
    return pb.collection('order_product').create(newProduct);
  };

  const createOrder = async (newProduct: OrderType): Promise<OrderType> => {
    return pb.collection('order').create(newProduct);
  };

  return { createOrderProduct, createOrder };
};
