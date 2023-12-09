import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useCheck = () => {
  const { pb } = usePocketbase();

  const createCheck = async (newCheck: CheckType): Promise<CheckType> => {
    return pb.collection('check').create(newCheck);
  };

  return { createCheck };
};
