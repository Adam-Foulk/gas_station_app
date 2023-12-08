import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useProduct = () => {
  const { pb } = usePocketbase();

  const getProduct = async (id: string): Promise<ProductType> => {
    const data = await pb.collection('product').getOne<Expanded<ProductType>>(id, {
      expand: 'type',
    });

    return {
      ...data,
      type: data.expand?.type || '',
    };
  };

  return { getProduct };
};
