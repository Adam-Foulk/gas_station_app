import { Button, Flex, Modal, SegmentedControl, Select, SimpleGrid, Table } from '@mantine/core';
import Catalog from '../components/Catalog';
import { useCategory } from '../hooks/catalog/useCategory';
import { useEffect, useState } from 'react';
import { useCategoryStore } from '../stores/category';
import Orders from '../components/Orders';
import { useProduct } from '../hooks/catalog/useProduct';
import { useOrderStore } from '../stores/order';
import { usePocketbase } from '../contexts/PocketbaseContext';
import { useOrder } from '../hooks/order/useOrder';
import { notifications } from '@mantine/notifications';
import { useCheck } from '../hooks/order/useCheck';
import { useForm } from '@mantine/form';
import { useProductRemainder } from '../hooks/catalog/useProductRemainder';
import { useProductStore } from '../stores/product';
import { FuelList } from '../components/FuelList';

export const Dashboard = () => {
  const { user } = usePocketbase();
  const { getRootCategories, getCategory } = useCategory();
  const { createOrderProduct, createOrder } = useOrder();
  const { createCheck } = useCheck();
  const { getProduct, getProducts } = useProduct();
  const { updateProductRemainder } = useProductRemainder();

  const categoryStore = useCategoryStore();
  const orderStore = useOrderStore();
  const productStore = useProductStore();

  const [isCatalogRoot, setIsCatalogRoot] = useState(true);
  const [catalogMode, setCatalogMode] = useState<string>('products');
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const form = useForm<{ payment_method: PaymentMethod }>({
    initialValues: { payment_method: 'cash' },
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
    if (orderStore.getActiveOrder()?.products.find((product) => id === product.id)) {
      notifications.show({
        title: 'Product adding',
        message:
          'You cannot add same product to order. You might want to change quantity. You can achieve it by clicking on product row in order table.',
        color: 'red',
      });
      return;
    }

    const product = await getProduct(id);

    if (product) {
      orderStore.addProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        type: product.type.name,
        remainder: product.remainder,
      });
    }
  };

  const handleFuelSelect = async (id: string, data: FuelFormType) => {
    if (orderStore.getActiveOrder()?.products.find((product) => id === product.id)) {
      notifications.show({
        title: 'Product adding',
        message:
          'You cannot add same product to order. You might want to change quantity. You can achieve it by clicking on product row in order table.',
        color: 'red',
      });
      return;
    }

    const product = await getProduct(id);

    if (product) {
      orderStore.addProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: data.quantity,
        type: product.type.name,
        remainder: product.remainder,
        station: data.station,
      });
    }
  };

  const handlePay = async (data: { payment_method: PaymentMethod }) => {
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
            station: product.station,
          });
          await updateProductRemainder(product.remainder?.id!, product.remainder?.count! - product.quantity);
          orderProductIds.push(result.id);
        }

        const newOrder = await createOrder({
          cash_desk: import.meta.env.VITE_CASH_DESK_NUMBER,
          user: user!.id,
          products: orderProductIds,
        });

        await createCheck({
          order: newOrder.id as string,
          payment_method: data.payment_method,
        });
      }

      notifications.show({
        title: 'Order creating',
        message: 'Order successfully created',
        color: 'green',
      });

      if (orderStore.activeOrder || orderStore.activeOrder === 0) {
        orderStore.remove(orderStore.activeOrder);

        if (orderStore.activeOrder > 0) {
          orderStore.activate(orderStore.orders.length - 2);
        }
      }

      setIsCatalogRoot(true);
      const children = await getRootCategories();
      categoryStore.setCategory({
        children,
        products: [],
      });

      setOrderModalOpen(false);
    } catch {
      notifications.show({
        title: 'Order creating',
        message: 'Error occurred while creating order',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    switch (catalogMode) {
      case 'products':
        getRootCategories().then((children) => {
          categoryStore.setCategory({
            children,
            products: [],
          });
        });
        setIsCatalogRoot(true);
        break;
      case 'fuel':
        getProducts('parent=""').then((products) => {
          productStore.setProducts(products);
        });
        break;
    }
  }, [catalogMode]);

  return (
    <section>
      <h2>Dashboard</h2>
      <SimpleGrid cols={2}>
        <div>1</div>
        <div>
          <Flex justify="center">
            <SegmentedControl
              value={catalogMode}
              onChange={setCatalogMode}
              size="lg"
              mb="lg"
              data={[
                { label: 'Products', value: 'products' },
                { label: 'Fuel', value: 'fuel' },
              ]}
            />
          </Flex>
          {catalogMode === 'products' && (
            <Catalog
              children={categoryStore.children}
              products={categoryStore.products}
              onSelectChild={handleSelectChild}
              onSelectProduct={handleProductSelect}
              onBackClick={handleSelectChild}
              parentId={categoryStore.parentId}
              isCatalogRoot={isCatalogRoot}
            />
          )}
          {catalogMode === 'fuel' && <FuelList data={productStore.products} onSelectFuel={handleFuelSelect} />}
        </div>
        <div>
          <Orders onOrderSubmit={() => setOrderModalOpen(true)} />
        </div>
        <div>4</div>
      </SimpleGrid>

      <Modal opened={orderModalOpen} onClose={() => setOrderModalOpen(false)} title="Order" size="xl">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orderStore.getActiveOrder()?.products.map((product) => (
              <Table.Tr key={product.name}>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>{product.quantity}</Table.Td>
                <Table.Td>{product.price}</Table.Td>
                <Table.Td>{product.price * product.quantity}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
          <Table.Tfoot>
            <Table.Tr>
              <Table.Td colSpan={3}>Total</Table.Td>
              <Table.Td colSpan={2}>
                {orderStore
                  .getActiveOrder()
                  ?.products.reduce((acc, product) => (acc += product.quantity * product.price), 0)}
              </Table.Td>
            </Table.Tr>
          </Table.Tfoot>
        </Table>
        <form onSubmit={form.onSubmit(handlePay)}>
          <Select
            {...form.getInputProps('payment_method')}
            label="Payment method"
            placeholder="Payment method"
            data={[
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Card' },
            ]}
            allowDeselect={false}
            checkIconPosition="right"
          />

          <Button fullWidth type="submit" mt="sm" color="green">
            Transfer
          </Button>
          <Button
            fullWidth
            onClick={() => {
              form.reset();
              setOrderModalOpen(false);
            }}
            mt="md"
            color="red"
          >
            Cancel
          </Button>
        </form>
      </Modal>
    </section>
  );
};
