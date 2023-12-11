import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useProductRemainder = () => {
  const { pb } = usePocketbase();

  const updateProductRemainder = async (productId: string, count: number) => {
    await pb.collection('product_remainder').update(productId, { count });
  };

  return { updateProductRemainder };
};
