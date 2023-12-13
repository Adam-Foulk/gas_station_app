import { usePocketbase } from '../../contexts/PocketbaseContext';

export const useCheck = () => {
  const { pb } = usePocketbase();

  const createCheck = async (newCheck: CheckType): Promise<CheckType> => {
    return pb.collection('check').create(newCheck);
  };

  const getChecks = async (): Promise<CheckType[]> => {
    const checks = await pb.collection<Expanded<CheckType>>('check').getFullList({
      expand: 'order,order.user,order.products,payment_method',
    });

    return checks.map((check) => ({
      ...check,
      order: {
        ...(check.expand.order as OrderType),
        user: (check.expand.order as Expanded<OrderType>).expand?.user,
        products: (check.expand.order as Expanded<OrderType>).expand?.products,
      },
    }));
  };

  return { createCheck, getChecks };
};
