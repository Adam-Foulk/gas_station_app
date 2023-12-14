import { Button, Group, Modal, NumberInput, Select, Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC, useEffect, useState } from 'react';
import { useStation } from '../hooks/useStation';

type FuelListProps = {
  data: ProductType[];
  onSelectFuel(id: string, data: FuelFormType): void;
};

export const FuelList: FC<FuelListProps> = ({ data, onSelectFuel }) => {
  const { getStations } = useStation();
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);
  const [stations, setStations] = useState<StationType[]>([]);

  const form = useForm<FuelFormType>({
    initialValues: {
      quantity: 1,
      sum: 1,
      station: '',
    },

    validate: {
      station: (value) => (value === '' ? 'Station must be selected' : null),
    },
  });

  const handleUpdateProductQuantity = (data: FuelFormType) => {
    if (!validateQuantity) {
      currentProduct && onSelectFuel(currentProduct.id, data);
      form.reset();
      setQuantityModalOpen(false);
    }
  };

  const validateQuantity =
    form.getTransformedValues().quantity > (currentProduct?.remainder?.count || 1)
      ? `You can't input quantity greater that product remainder which is ${currentProduct?.remainder?.count}`
      : null;

  useEffect(() => {
    getStations().then((data) => setStations(data));
  }, []);

  return (
    <div>
      <Table verticalSpacing="md" w={516}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Remainder</Table.Th>
            <Table.Th>Unit</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((product) => (
            <Table.Tr
              key={product.id}
              onClick={() => {
                setCurrentProduct(product);
                setQuantityModalOpen(true);
              }}
            >
              <Table.Td>{product.name}</Table.Td>
              <Table.Td>{product.price}</Table.Td>
              <Table.Td>{product.remainder?.count}</Table.Td>
              <Table.Td>{product.remainder?.unit.name}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={quantityModalOpen}
        onClose={() => setQuantityModalOpen(false)}
        title={`Fuel ${currentProduct?.name}`}
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleUpdateProductQuantity)}>
          <Group gap="lg" grow mb="lg">
            <NumberInput
              {...form.getInputProps('quantity')}
              onChange={(value) => {
                form.setFieldValue('sum', +value * (currentProduct?.price || 0));
                form.setFieldValue('quantity', +value);
              }}
              min={1}
              label="Quantity"
              error={validateQuantity}
              valueIsNumericString
            />
            <NumberInput
              {...form.getInputProps('sum')}
              onChange={(value) => {
                form.setFieldValue('quantity', +value / (currentProduct?.price || 0));
                form.setFieldValue('sum', +value);
              }}
              min={1}
              label="Sum"
              error={validateQuantity}
              valueIsNumericString
            />
          </Group>
          <Select
            {...form.getInputProps('station')}
            label="Station"
            placeholder="Pick value"
            data={stations.map(({ name }) => ({ label: name, value: name }))}
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
    </div>
  );
};
