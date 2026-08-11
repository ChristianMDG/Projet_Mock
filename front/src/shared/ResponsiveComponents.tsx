import React from 'react';
import { Box, Slide, useScrollTrigger } from '@mui/material';

interface ComponentProps {
  children: React.ReactElement;
  mobile?: boolean;
}

export function HideOnScroll({ children, mobile }: ComponentProps) {
  const trigger = useScrollTrigger();

  return mobile ? (
    children
  ) : (
    <Slide appear={false} direction="down" in={!trigger}>
      <Box style={{ display: trigger ? 'none' : 'block' }}>{children}</Box>
    </Slide>
  );
}

export function HideOnMobile({ children, mobile }: ComponentProps) {
  return mobile ? <></> : children;
}
