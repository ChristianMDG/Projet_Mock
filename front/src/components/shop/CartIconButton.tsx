import React, { useEffect, useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import ShoppingBasket from '@mui/icons-material/ShoppingBasket';
import { useCartStore } from '@/stores/cart.store';
import { SxProps, Theme } from '@mui/material';

interface CartIconButtonProps {
  sx?: SxProps<Theme>;
}

const CartIconButton: React.FC<CartIconButtonProps> = ({ sx }) => {
  const [isClient, setIsClient] = useState(false);
  const itemCount = useCartStore(state => state.getItemCount());
  const setDrawerOpen = useCartStore(state => state.setDrawerOpen);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not showing badge content until client-side
  const badgeContent = isClient ? itemCount : 0;

  return (
    <IconButton color="inherit" onClick={() => setDrawerOpen(true)} size="large" sx={sx}>
      <Badge badgeContent={badgeContent} color="secondary" max={99}>
        <ShoppingBasket />
      </Badge>
    </IconButton>
  );
};

export default CartIconButton;
