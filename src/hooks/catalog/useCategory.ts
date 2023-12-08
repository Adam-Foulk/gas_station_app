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
    const data = await pb.collection('category').getOne<Expanded<CategoryType>>(id, {
      expand: 'children,products',
    });

    return {
      ...data,
      children: data.expand?.children || [],
      products: data.expand?.products || [],
    };
  };

  return { getRootCategories, getCategory };
};
