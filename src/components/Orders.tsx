import { Button, Table, Tabs, TextInput, Text, Flex } from '@mantine/core';
import { useOrderStore } from '../stores/order';
import { FC, useRef, useState } from 'react';
import { modals } from '@mantine/modals';

type OrdersProps = {
  onOrderSubmit(): void;
};

const Orders: FC<OrdersProps> = ({ onOrderSubmit }) => {
  const orderStore = useOrderStore();
  const [tabValue, setTabValue] = useState<string | null>(`order-${orderStore.activeOrder}`);
  const selectedProductId = useRef<string | null | undefined>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpdateProductQuantity = () => {
    if (quantityInputRef.current && selectedProductId.current) {
      orderStore.setProductQuantity(selectedProductId.current, +quantityInputRef.current.value);
      quantityInputRef.current.value = '1';
    }
  };

  const openQuantityModal = () =>
    modals.open({
      title: 'Product quantity',
      children: (
        <>
          <TextInput
            ref={quantityInputRef}
            type="number"
            label="Value"
            data-autofocus
            defaultValue={
              orderStore.getActiveOrder()?.products.find(({ id }) => id === selectedProductId.current)?.quantity || 1
            }
          />
          <Button
            fullWidth
            onClick={() => {
              handleUpdateProductQuantity();
              modals.closeAll();
            }}
            mt="md"
          >
            Submit
          </Button>
        </>
      ),
    });

  const openConfirmDropOrderModal = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Are you sure you want to drop this order?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (orderStore.activeOrder) {
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
                      openQuantityModal();
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
          </Tabs.Panel>
        ))}
      </Tabs>
      {orderStore.activeOrder !== null && (
        <Flex gap="xs" mt="xs" justify="end">
          <Button onClick={openConfirmDropOrderModal} color="red">
            Drop order
          </Button>
          <Button onClick={onOrderSubmit} disabled={!orderStore.getActiveOrder()?.products.length}>
            Pay
          </Button>
        </Flex>
      )}
    </>
  );
};

export default Orders;
