import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useProduct = () => {
  const { pb } = usePocketbase();

  const getProduct = async (id: string): Promise<ProductType> => {
    const product = await pb.collection('product').getOne<Expanded<ProductType>>(id, {
      expand: 'type',
    });

    const remainder = await pb
      .collection('product_remainder')
      .getFirstListItem<Expanded<ProductRemainderType>>(`product="${id}"`);

    return {
      ...product,
      remainder,
      type: product.expand?.type || '',
    };
  };

  const getProducts = async (filter: string) => {
    const products = await pb.collection('product').getFullList<Expanded<ProductType>>({
      expand: 'type',
      filter,
    });

    const remainders = (
      await pb.collection('product_remainder').getFullList<Expanded<ProductRemainderType>>({
        expand: 'unit',
      })
    ).map((reminder) => ({ ...reminder, unit: reminder.expand.unit }));

    return (
      products?.map((product) => ({
        ...product,
        remainder: remainders.find((remainder) => remainder.product === product.id),
      })) || []
    );
  };

  return { getProduct, getProducts };
};
