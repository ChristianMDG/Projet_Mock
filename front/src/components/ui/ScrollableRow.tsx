import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { type SxProps, type Theme } from '@mui/material';

interface ScrollableRowProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  sxList?: SxProps<Theme>;
  rows?: number;
}

const ScrollContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 32,
    pointerEvents: 'none',
    zIndex: 2,
    opacity: 0,
    transition: 'opacity 220ms ease',
  },
  '&::before': {
    left: 0,
    background: `linear-gradient(to right, ${theme.palette.background.paper}, ${alpha(theme.palette.background.paper, 0)})`,
  },
  '&::after': {
    right: 0,
    background: `linear-gradient(to left, ${theme.palette.background.paper}, ${alpha(theme.palette.background.paper, 0)})`,
  },
  '&[data-can-scroll-left="true"]::before': { opacity: 1 },
  '&[data-can-scroll-right="true"]::after': { opacity: 1 },
}));

const ScrollList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  WebkitOverflowScrolling: 'touch',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  padding: theme.spacing(1, 0.5),
  width: '100%',
}));

const ScrollableRow: React.FC<ScrollableRowProps> = ({ children, sx, sxList, rows, ...props }) => {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  React.useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      const handleScroll = () => {
        setCanScrollLeft(element.scrollLeft > 2);
        setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 2);
      };

      handleScroll();
      element.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
      return () => {
        element.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [children]);

  const gridStyles: SxProps<Theme> = rows
    ? {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }
    : {};

  return (
    <ScrollContainer data-can-scroll-left={canScrollLeft} data-can-scroll-right={canScrollRight} sx={sx} {...props}>
      <ScrollList ref={scrollRef} sx={{ ...gridStyles, ...sxList }}>
        {children}
      </ScrollList>
    </ScrollContainer>
  );
};

export default ScrollableRow;
