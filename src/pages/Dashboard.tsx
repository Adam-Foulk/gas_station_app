import { Button, Flex, SimpleGrid, Text } from '@mantine/core';
import Catalog from '../components/Catalog';
import { useCategory } from '../hooks/catalog/useCategory';
import { useEffect, useState } from 'react';
import { useCategoryStore } from '../stores/category';
import Orders from '../components/Orders';
import { useProduct } from '../hooks/catalog/useProduct';
import { useOrderStore } from '../stores/order';
import { usePocketbase } from '../contexts/PocketbaseContext';
import { useOrder } from '../hooks/order/useOrder';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

export const Dashboard = () => {
  const { user } = usePocketbase();
  const { getRootCategories, getCategory } = useCategory();
  const { createOrderProduct, createOrder } = useOrder();
  const { getProduct } = useProduct();
  const categoryStore = useCategoryStore();
  const orderStore = useOrderStore();
  const [isCatalogRoot, setIsCatalogRoot] = useState(true);

  const openConfirmDropOrderModal = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to drop this order?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed'),
    });

  const handleSelectChild = async (id: string) => {
    if (id) {
      setIsCatalogRoot(false);
      const category = await getCategory(id);

      if (category) {
        categoryStore.setCategory({
          children: category.children,
          products: category.products,
          parentId: category.parent,
        });
      }
    } else {
      setIsCatalogRoot(true);
      const children = await getRootCategories();
      categoryStore.setCategory({
        children,
        products: [],
      });
    }
  };

  const handleProductSelect = async (id: string) => {
    const product = await getProduct(id);

    if (product) {
      orderStore.addProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        type: product.type.name,
      });
    }
  };

  const handlePay = async () => {
    const order = orderStore.getActiveOrder();

    try {
      if (order && order.products.length) {
        const orderProductIds = [];
        for (const product of order.products) {
          const result = await createOrderProduct({
            name: product.name,
            type: product.type,
            quantity: product.quantity,
            price: product.price,
          });
          orderProductIds.push(result.id);
        }

        await createOrder({
          cash_desk: import.meta.env.VITE_CASH_DESK_NUMBER,
          user: user!.id,
          products: orderProductIds,
        });
      }

      notifications.show({
        title: 'Order creating',
        message: 'Order successfully created',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Order creating',
        message: 'Error occurred while creating order',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    getRootCategories().then((children) => {
      categoryStore.setCategory({
        children,
        products: [],
      });
    });
  }, []);

  return (
    <section>
      <h2>Dashboard</h2>
      <SimpleGrid cols={2}>
        <div>1</div>
        <div>
          <Catalog
            children={categoryStore.children}
            products={categoryStore.products}
            onSelectChild={handleSelectChild}
            onSelectProduct={handleProductSelect}
            onBackClick={handleSelectChild}
            parentId={categoryStore.parentId}
            isCatalogRoot={isCatalogRoot}
          />
        </div>
        <div>
          <Orders />
          <Flex gap="xs" mt="xs" justify="end">
            <Button onClick={openConfirmDropOrderModal} color="red">
              Drop order
            </Button>
            <Button onClick={handlePay}>Pay</Button>
          </Flex>
        </div>
        <div>4</div>
      </SimpleGrid>
    </section>
  );
};
