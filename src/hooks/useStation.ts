import { usePocketbase } from '../contexts/PocketbaseContext';

export const useStation = () => {
  const { pb } = usePocketbase();

  const getStations = async (): Promise<StationType[]> => {
    return await pb.collection('gas_station').getFullList();
  };

  return { getStations };
};
