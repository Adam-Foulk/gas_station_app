import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useCategory = () => {
  const { pb } = usePocketbase();

  const getRootCategories = async (): Promise<CategoryType[]> => {
    return await pb.collection('category').getFullList({
      filter: 'parent = ""',
      expand: 'children,products',
    });
  };

  const getCategory = async (id: string): Promise<CategoryType> => {
    const category = await pb.collection('category').getOne<Expanded<CategoryType>>(id, {
      expand: 'children,products',
    });

    const remainders = await pb.collection('product_remainder').getFullList<Expanded<ProductRemainderType>>({
      expand: 'unit',
    });

    return {
      ...category,
      children: category.expand?.children || [],
      products:
        category.expand?.products?.map((product) => ({
          ...product,
          remainder: remainders.find((remainder) => remainder.product === product.id),
        })) || [],
    };
  };

  return { getRootCategories, getCategory };
};
