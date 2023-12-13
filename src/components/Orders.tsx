import { Button, Table, Tabs, Text, Flex, NumberInput, Modal } from '@mantine/core';
import { useOrderStore } from '../stores/order';
import { FC, useRef, useState } from 'react';
import { modals } from '@mantine/modals';
import { useProduct } from '../hooks/catalog/useProduct';
import { useForm } from '@mantine/form';

type OrdersProps = {
  onOrderSubmit(): void;
};

const Orders: FC<OrdersProps> = ({ onOrderSubmit }) => {
  const orderStore = useOrderStore();
  const { getProduct } = useProduct();
  const [tabValue, setTabValue] = useState<string | null>(`order-${orderStore.activeOrder}`);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const selectedProductId = useRef<string | null | undefined>(null);
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);

  const form = useForm<{ quantity: number }>({
    initialValues: {
      quantity: 1,
    },
  });

  const handleSelectProduct = async () => {
    if (selectedProductId.current) {
      const product = await getProduct(selectedProductId.current);

      if (product) {
        setCurrentProduct(product);
        form.setValues({
          quantity:
            orderStore.getActiveOrder()?.products.find(({ id }) => id === selectedProductId.current)?.quantity || 1,
        });
        setQuantityModalOpen(true);
      }
    }
  };

  const handleAddOrder = () => {
    orderStore.add();
    orderStore.activate(orderStore.orders.length);
    setTabValue(`order-${orderStore.orders.length}`);
  };

  const handleActivateOrder = (idx: number) => {
    orderStore.activate(idx);
  };

  const handleRemoveProduct = (productId: string) => {
    orderStore.removeProduct(productId);
  };

  const handleUpdateProductQuantity = (data: { quantity: number }) => {
    if (form.getTransformedValues().quantity <= (currentProduct?.remainder?.count || 1) && selectedProductId.current) {
      orderStore.setProductQuantity(selectedProductId.current, data.quantity);
      setQuantityModalOpen(false);
    }
  };

  const openConfirmDropOrderModal = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to drop this order?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (orderStore.activeOrder || orderStore.activeOrder === 0) {
          orderStore.remove(orderStore.activeOrder);

          if (orderStore.activeOrder > 0) {
            orderStore.activate(orderStore.orders.length - 2);
            setTabValue(`order-${orderStore.orders.length - 2}`);
          }
        }
      },
    });

  return (
    <>
      <Tabs value={tabValue} onChange={setTabValue}>
        <Tabs.List>
          {orderStore.orders.map((_, idx) => (
            <Tabs.Tab key={idx} value={`order-${idx}`} onClick={() => handleActivateOrder(idx)}>
              Order {idx + 1}
            </Tabs.Tab>
          ))}
          <Tabs.Tab value="add" onClick={handleAddOrder}>
            +
          </Tabs.Tab>
        </Tabs.List>

        {orderStore.orders.map((order, idx) => (
          <Tabs.Panel key={idx} value={`order-${idx}`}>
            Content of order {idx + 1}
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {order.products.map((product) => (
                  <Table.Tr
                    key={product.name}
                    onClick={() => {
                      selectedProductId.current = product.id;
                      handleSelectProduct();
                    }}
                  >
                    <Table.Td>{product.name}</Table.Td>
                    <Table.Td>{product.quantity}</Table.Td>
                    <Table.Td>{product.price}</Table.Td>
                    <Table.Td>{product.price * product.quantity}</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      <Button
                        color="red"
                        variant="transparent"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleRemoveProduct(product.id!);
                        }}
                      >
                        &times;
                      </Button>
                    </Table.Td>
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
            1
          </Tabs.Panel>
        ))}
      </Tabs>
      {orderStore.activeOrder !== null && (
        <Flex gap="xs" mt="xs" justify="end">
          <Button onClick={openConfirmDropOrderModal} color="red" disabled={!orderStore.orders.length}>
            Drop order
          </Button>
          <Button onClick={onOrderSubmit} disabled={!orderStore.getActiveOrder()?.products.length}>
            Pay
          </Button>
        </Flex>
      )}

      <Modal opened={quantityModalOpen} onClose={() => setQuantityModalOpen(false)} title="Order" size="xl">
        <form onSubmit={form.onSubmit(handleUpdateProductQuantity)}>
          <NumberInput
            {...form.getInputProps('quantity')}
            min={1}
            label="Value"
            error={
              form.getTransformedValues().quantity > (currentProduct?.remainder?.count || 1)
                ? `You can't input quantity greater that product remainder which is ${currentProduct?.remainder?.count}`
                : null
            }
            valueIsNumericString
          />
          <Button fullWidth type="submit" mt="sm" color="green">
            Submit
          </Button>
          <Button
            fullWidth
            onClick={() => {
              form.reset();
              setQuantityModalOpen(false);
            }}
            mt="md"
            color="red"
          >
            Cancel
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default Orders;
