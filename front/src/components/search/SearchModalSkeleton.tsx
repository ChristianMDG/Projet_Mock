import React, { memo } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Stack,
  Skeleton,
} from '@mui/material';
import { GlobalSearchTabEnum, type GlobalSearchTab, SearchTabEnum } from '@/models/enums';

export { GlobalSearchTabEnum, SearchTabEnum, type GlobalSearchTab };

export interface SearchModalSkeletonProps {
  tab?: GlobalSearchTabEnum;
}

const ProductHitSkeleton: React.FC = () => (
  <ListItem disablePadding secondaryAction={<Skeleton variant="circular" width={18} height={18} animation="wave" />}>
    <ListItemButton sx={{ py: 1, px: 2 }} disabled>
      <ListItemAvatar sx={{ minWidth: 56 }}>
        <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2 }} animation="wave" />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', pr: 4 }}>
            <Skeleton variant="text" sx={{ width: { xs: '60%', sm: '45%', md: '35%' }, height: 20 }} animation="wave" />
            <Skeleton variant="text" sx={{ width: { xs: 55, sm: 70 }, height: 18 }} animation="wave" />
          </Stack>
        }
        secondary={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
            <Skeleton variant="text" sx={{ width: { xs: '45%', sm: '30%', md: '25%' }, height: 16 }} animation="wave" />
            <Skeleton variant="rounded" sx={{ width: 50, height: 18, borderRadius: '16px' }} animation="wave" />
          </Stack>
        }
      />
    </ListItemButton>
  </ListItem>
);

const CategoryHitSkeleton: React.FC = () => (
  <ListItem disablePadding secondaryAction={<Skeleton variant="circular" width={18} height={18} animation="wave" />}>
    <ListItemButton sx={{ py: 1, px: 2 }} disabled>
      <ListItemAvatar>
        <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: 1 }} animation="wave" />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Skeleton variant="text" sx={{ width: { xs: '50%', sm: '35%', md: '25%' }, height: 20 }} animation="wave" />
        }
        secondary={
          <Skeleton
            variant="text"
            sx={{ width: { xs: '35%', sm: '20%', md: '15%' }, height: 16, mt: 0.25 }}
            animation="wave"
          />
        }
      />
    </ListItemButton>
  </ListItem>
);

const VoyageHitSkeleton: React.FC = () => (
  <ListItem disablePadding secondaryAction={<Skeleton variant="circular" width={18} height={18} animation="wave" />}>
    <ListItemButton sx={{ py: 1, px: 2 }} disabled>
      <ListItemAvatar>
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Skeleton variant="text" sx={{ width: { xs: '70%', sm: '50%', md: '40%' }, height: 22 }} animation="wave" />
        }
        secondary={
          <Stack spacing={0.5} sx={{ mt: 0.25 }}>
            <Skeleton variant="text" sx={{ width: { xs: '55%', sm: '35%', md: '28%' }, height: 16 }} animation="wave" />
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5, mt: 0.25 }}>
              <Skeleton variant="rounded" sx={{ width: 58, height: 20, borderRadius: '16px' }} animation="wave" />
              <Skeleton variant="rounded" sx={{ width: 68, height: 20, borderRadius: '16px' }} animation="wave" />
              <Skeleton variant="text" sx={{ width: { xs: 50, sm: 65 }, height: 16 }} animation="wave" />
              <Skeleton variant="text" sx={{ width: { xs: 60, sm: 75 }, height: 16 }} animation="wave" />
            </Stack>
          </Stack>
        }
      />
    </ListItemButton>
  </ListItem>
);

const SectionHeaderSkeleton: React.FC = () => (
  <ListSubheader
    sx={{
      bgcolor: 'background.paper',
      lineHeight: 2.2,
      px: 2,
      py: 0.5,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Skeleton variant="circular" width={18} height={18} animation="wave" />
        <Skeleton variant="text" sx={{ width: { xs: 70, sm: 100 }, height: 18 }} animation="wave" />
      </Stack>
      <Skeleton variant="rounded" sx={{ width: 24, height: 18, borderRadius: '9px' }} animation="wave" />
    </Stack>
  </ListSubheader>
);

export const SearchModalSkeleton: React.FC<SearchModalSkeletonProps> = ({ tab = GlobalSearchTabEnum.ALL }) => {
  const isAll = tab === GlobalSearchTabEnum.ALL;
  const showVoyages = isAll || tab === GlobalSearchTabEnum.VOYAGES;
  const showProducts = isAll || tab === GlobalSearchTabEnum.PRODUCTS;
  const showCategories = isAll || tab === GlobalSearchTabEnum.CATEGORIES;

  return (
    <List disablePadding>
      {showVoyages && (
        <>
          {isAll && <SectionHeaderSkeleton />}
          <VoyageHitSkeleton />
          <VoyageHitSkeleton />
          {tab === GlobalSearchTabEnum.VOYAGES && (
            <>
              <VoyageHitSkeleton />
              <VoyageHitSkeleton />
            </>
          )}
        </>
      )}

      {showProducts && (
        <>
          {isAll && <SectionHeaderSkeleton />}
          <ProductHitSkeleton />
          <ProductHitSkeleton />
          {tab === GlobalSearchTabEnum.PRODUCTS && (
            <>
              <ProductHitSkeleton />
              <ProductHitSkeleton />
            </>
          )}
        </>
      )}

      {showCategories && (
        <>
          {isAll && <SectionHeaderSkeleton />}
          <CategoryHitSkeleton />
          <CategoryHitSkeleton />
          {tab === GlobalSearchTabEnum.CATEGORIES && (
            <>
              <CategoryHitSkeleton />
              <CategoryHitSkeleton />
            </>
          )}
        </>
      )}
    </List>
  );
};

export default memo(SearchModalSkeleton);
