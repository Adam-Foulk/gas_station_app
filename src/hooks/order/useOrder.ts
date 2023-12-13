import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useOrder = () => {
  const { pb } = usePocketbase();

  const createOrderProduct = async (newProduct: NewOrderProduct): Promise<ProductType> => {
    return pb.collection('order_product').create(newProduct);
  };

  const createOrder = async (newProduct: OrderType): Promise<OrderType> => {
    return pb.collection('order').create(newProduct);
  };

  const getOrders = async (): Promise<OrderType[]> => {
    const orders = await pb.collection<Expanded<OrderType>>('order').getFullList({
      expand: 'user,products',
    });

    return orders.map((order) => ({
      ...order,
      user: order.expand?.user,
      products: order.expand?.products,
    }));
  };

  return { createOrderProduct, createOrder, getOrders };
};
