import { Button, Flex, SimpleGrid } from '@mantine/core';
import catalogStyles from '../styles/Catalog.module.scss';
import { FC } from 'react';

type CatalogProps = {
  children: CategoryType[];
  products: ProductType[];
  onSelectChild(id: string): void;
  onSelectProduct(id: string): void;
  onBackClick?(id?: string | null): void;
  parentId?: string | null;
  isCatalogRoot?: boolean;
};

const Catalog: FC<CatalogProps> = ({
  children,
  products,
  parentId,
  onSelectChild,
  onSelectProduct,
  onBackClick,
  isCatalogRoot = false,
}) => {
  const handleBackClick = (parentId?: string | null) => {
    onBackClick?.(parentId);
  };
  return (
    <Flex p={2} direction="column" gap="md">
      {children.length > 0 && (
        <SimpleGrid cols={4}>
          {children.map(({ id, name }) => (
            <Button key={id} onClick={() => onSelectChild(id)} className={catalogStyles.Pane}>
              {name}
            </Button>
          ))}
        </SimpleGrid>
      )}
      {products.length > 0 && (
        <SimpleGrid cols={4}>
          {products.map(({ id, name, remainder }) => (
            <Button
              key={id}
              onClick={() => onSelectProduct(id)}
              color="cyan"
              className={catalogStyles.Pane}
              disabled={remainder ? +remainder.count === 0 : true}
            >
              {name}
            </Button>
          ))}
        </SimpleGrid>
      )}

      <SimpleGrid cols={4}>
        {!isCatalogRoot && (
          <Button variant="outline" className={catalogStyles.Pane} onClick={() => handleBackClick(parentId)}>
            Back
          </Button>
        )}
        {!isCatalogRoot && (
          <Button variant="outline" className={catalogStyles.Pane} onClick={() => handleBackClick()}>
            To root
          </Button>
        )}
      </SimpleGrid>
    </Flex>
  );
};

export default Catalog;
