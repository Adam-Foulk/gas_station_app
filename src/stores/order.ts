import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type OrderStore = {
  checks: CheckType[];
  selectedCheck: CheckType | null;
  activeOrder: number | null;
  orders: NewOrder[];
  add(): void;
  remove(idx: number): void;
  addProduct(newProduct: NewOrderProduct): void;
  removeProduct(productId: string): void;
  setProductQuantity(productId: string, quantity: number): void;
  activate(activeOrder: number | null): void;
  getActiveOrder(): NewOrder | null;
  setChecks(checks: CheckType[]): void;
  setSelectedCheck(selectedCheck: CheckType): void;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      checks: [],
      selectedCheck: null,
      orders: [],
      activeOrder: null,
      add: () => set({ orders: [...get().orders, { products: [] }] }),
      remove: (idx) => set({ orders: get().orders.filter((_, i) => i !== idx) }),
      addProduct: (newProduct) =>
        set({
          orders: get().orders.map((order, i) =>
            i === get().activeOrder
              ? {
                  products: [...get().orders[get().activeOrder!].products, newProduct],
                }
              : order,
          ),
        }),
      removeProduct: (productId) =>
        set({
          orders: get().orders.map((order, i) =>
            i === get().activeOrder
              ? {
                  ...order,
                  products: order.products.filter(({ id }) => id !== productId),
                }
              : order,
          ),
        }),
      setProductQuantity: (productId, quantity) =>
        set({
          orders: get().orders.map((order, i) =>
            i === get().activeOrder
              ? {
                  ...order,
                  products: order.products.map((product) =>
                    product.id === productId ? { ...product, quantity } : product,
                  ),
                }
              : order,
          ),
        }),
      activate: (activeOrder) => set({ activeOrder }),
      getActiveOrder: () => (get().activeOrder || get().activeOrder === 0 ? get().orders[get().activeOrder!] : null),
      setChecks: (checks) => set({ checks }),
      setSelectedCheck: (selectedCheck) => set({ selectedCheck }),
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
