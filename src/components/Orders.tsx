import { Button, Table, Tabs, TextInput } from '@mantine/core';
import { useOrderStore } from '../stores/order';
import { useRef, useState } from 'react';
import { modals } from '@mantine/modals';

const Orders = () => {
  const orderStore = useOrderStore();
  const [tabValue, setTabValue] = useState<string | null>(`order-${orderStore.activeOrder}`);
  const selectedProductId = useRef<string | null | undefined>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const handleAddOrder = () => {
    orderStore.add();
    console.log(orderStore.orders.length);
    orderStore.activate(orderStore.orders.length);
    setTabValue(`order-${orderStore.orders.length}`);
  };

  const handleRemoveOrder = (idx: number) => {
    orderStore.remove(idx);
  };

  const handleActivateOrder = (idx: number) => {
    orderStore.activate(idx);
  };

  const handleRemoveProduct = (productId: string) => {
    orderStore.removeProduct(productId);
  };

  const handleUpdateProductQuantity = () => {
    if (quantityInputRef.current && selectedProductId.current) {
      console.log(+quantityInputRef.current.value);
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

  return (
    <Tabs value={tabValue} onChange={setTabValue}>
      <Tabs.List>
        {orderStore.orders.map((_, idx) => (
          <Tabs.Tab
            key={idx}
            value={`order-${idx}`}
            onClick={() => handleActivateOrder(idx)}
            onDoubleClick={() => handleRemoveOrder(idx)}
          >
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
                <Table.Td colSpan={1}>0 UAH</Table.Td>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default Orders;
