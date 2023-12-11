import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useProduct = () => {
  const { pb } = usePocketbase();

  const getProduct = async (id: string): Promise<ProductType> => {
    const product = await pb.collection('product').getOne<Expanded<ProductType>>(id, {
      expand: 'type',
    });

    console.log(id);

    const remainder = await pb
      .collection('product_remainder')
      .getFirstListItem<Expanded<ProductRemainderType>>(`product="${id}"`);

    console.log(id, remainder);

    return {
      ...product,
      remainder,
      type: product.expand?.type || '',
    };
  };

  return { getProduct };
};
