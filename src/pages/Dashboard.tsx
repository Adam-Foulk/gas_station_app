import { SimpleGrid } from '@mantine/core';
import Catalog from '../components/Catalog';
import { useCategory } from '../hooks/catalog/useCategory';
import { useEffect, useState } from 'react';
import { useCategoryStore } from '../stores/category';

export const Dashboard = () => {
  const { getRootCategories, getCategory } = useCategory();
  const categoryStore = useCategoryStore();
  const [isCatalogRoot, setIsCatalogRoot] = useState(true);

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
      <h2>Protected</h2>
      <SimpleGrid cols={2}>
        <div>1</div>
        <div>
          <Catalog
            children={categoryStore.children}
            products={categoryStore.products}
            onSelectChild={handleSelectChild}
            onSelectProduct={console.log}
            onBackClick={handleSelectChild}
            parentId={categoryStore.parentId}
            isCatalogRoot={isCatalogRoot}
          />
        </div>
        <div>3</div>
        <div>4</div>
      </SimpleGrid>
    </section>
  );
};
