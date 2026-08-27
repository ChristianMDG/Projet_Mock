import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, DeliveryVoyage } from '@/models/Shop';

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
  deliveryVoyage: DeliveryVoyage | null;

  addItem: (product: Product, quantity?: number) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => boolean;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  setDeliveryVoyage: (delivery: DeliveryVoyage | null) => void;

  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      deliveryVoyage: null,

      addItem: (product, quantity = 1) => {
        const isValidQuantity = quantity > 0;

        if (isValidQuantity) {
          set(state => {
            const existingItem = state.items.find(item => item.product.id === product.id);
            if (existingItem) {
              return {
                items: state.items.map(item =>
                  item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
                ),
              };
            }
            return { items: [...state.items, { product, quantity }] };
          });
          return true;
        }
        return false;
      },

      removeItem: productId => {
        set(state => ({ items: state.items.filter(item => item.product.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        const hasPositiveQuantity = quantity > 0;

        if (hasPositiveQuantity) {
          const item = get().items.find(item => item.product.id === productId);
          if (item) {
            set(state => ({
              items: state.items.map(item => (item.product.id === productId ? { ...item, quantity } : item)),
            }));
            return true;
          }
          return false;
        }

        get().removeItem(productId);
        return true;
      },

      clearCart: () => set({ items: [], deliveryVoyage: null }),

      setDrawerOpen: open => set({ drawerOpen: open }),

      setDeliveryVoyage: delivery => set({ deliveryVoyage: delivery }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      getDeliveryFee: () => get().deliveryVoyage?.deliveryFee ?? 0,

      getTotal: () => get().getSubtotal() + get().getDeliveryFee(),
    }),
    { name: 'txbr-cart-storage', skipHydration: true },
  ),
);
