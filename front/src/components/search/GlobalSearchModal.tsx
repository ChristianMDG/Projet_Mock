import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  List,
  Typography,
  Stack,
  Tabs,
  Tab,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobalSearch } from '@/hooks/global-search.hooks';
import { useVoyageSearchUrl } from '@/hooks/useVoyageSearchUrl';
import dayjs from 'dayjs';
import { ROUTES, generateRoute } from '@/constants/routes';
import { GlobalSearchTabEnum, type GlobalSearchHit } from '@/api/global-search.api';
import SearchInput from './SearchInput';
import SearchVoyageHit from './SearchVoyageHit';
import SearchProductHit from './SearchProductHit';
import SearchCategoryHit from './SearchCategoryHit';
import SearchSectionHeader from './SearchSectionHeader';
import SearchFooter from './SearchFooter';
import SearchModalSkeleton from './SearchModalSkeleton';
import RenderLabel from './RenderLabel';
import Labels from '@/labelKeys.json';

export interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

type FilterTab = GlobalSearchTabEnum;

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onClose, initialQuery = '' }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { buildUrlQuery } = useVoyageSearchUrl();

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<FilterTab>(GlobalSearchTabEnum.ALL);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isFetching } = useGlobalSearch(query, 12, { enabled: open });

  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open, initialQuery]);

  const voyages = useMemo(() => data?.voyages ?? [], [data?.voyages]);
  const products = useMemo(() => data?.products ?? [], [data?.products]);
  const categories = useMemo(() => data?.categories ?? [], [data?.categories]);

  const totalVoyages = data?.totalVoyages ?? voyages.length;
  const totalProducts = data?.totalProducts ?? products.length;
  const totalCategories = data?.totalCategories ?? categories.length;
  const totalMatches = data?.totalMatches ?? totalVoyages + totalProducts + totalCategories;

  const flatItems = useMemo(() => {
    if (activeTab === GlobalSearchTabEnum.VOYAGES) {
      return voyages;
    }
    if (activeTab === GlobalSearchTabEnum.PRODUCTS) {
      return products;
    }
    if (activeTab === GlobalSearchTabEnum.CATEGORIES) {
      return categories;
    }
    return [...voyages, ...products, ...categories];
  }, [activeTab, voyages, products, categories]);

  const hasResults = Boolean(flatItems.length);
  const isSearching = isLoading || isFetching;

  const handleSelect = useCallback(
    (hit: GlobalSearchHit) => {
      onClose();
      const searchResultsPath = ROUTES.searchResults[i18n.language as keyof typeof ROUTES.searchResults];

      if (hit.type === 'VOYAGE' && hit.departureVilleName && hit.arrivalVilleName && searchResultsPath) {
        const departureDate = hit.departureDate ? dayjs(hit.departureDate) : dayjs().add(1, 'day');

        const search = buildUrlQuery({
          fromVilleName: hit.departureVilleName,
          toVilleName: hit.arrivalVilleName,
          departureDate: departureDate.format('YYYY-MM-DD'),
          passengers: 1,
        });
        navigate(`${searchResultsPath}${search}`);
        return;
      }

      if (hit.type === 'PRODUCT' && hit.slug) {
        navigate(generateRoute.shopProduct(hit.slug, i18n.language));
        return;
      }

      if (hit.type === 'CATEGORY' && hit.slug) {
        navigate(generateRoute.shopCategory(hit.slug, i18n.language));
      }
    },
    [buildUrlQuery, i18n.language, navigate, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hasResults) {
        setSelectedIndex(prev => (prev + 1) % flatItems.length);
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hasResults) {
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = flatItems[selectedIndex];
      if (selectedItem) {
        handleSelect(selectedItem);
      }
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const isAll = activeTab === GlobalSearchTabEnum.ALL;
  const isVisible = (tab: GlobalSearchTabEnum, items: unknown[]) => (isAll || activeTab === tab) && items.length > 0;

  const showVoyages = isVisible(GlobalSearchTabEnum.VOYAGES, voyages);
  const showProducts = isVisible(GlobalSearchTabEnum.PRODUCTS, products);
  const showCategories = isVisible(GlobalSearchTabEnum.CATEGORIES, categories);
  const showSkeleton = isSearching && !hasResults;
  const showEmpty = !isSearching && !hasResults && Boolean(query.trim());

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: isMobile ? '100%' : '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        },
      }}
    >
      {/* Header bar with SearchInput and close button */}
      <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchInput
              ref={inputRef}
              value={query}
              onChange={val => {
                setQuery(val);
                setSelectedIndex(0);
              }}
              onClear={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              onKeyDown={handleKeyDown}
              placeholder={t(Labels.global_search_placeholder)}
              isSearching={isSearching}
              showShortcut={false}
              autoFocus
            />
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="Close dialog">
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* Categories / Type Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_e, val: FilterTab) => {
            setActiveTab(val);
            setSelectedIndex(0);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 36,
            mt: 1,
            '& .MuiTab-root': {
              minHeight: 36,
              py: 0.5,
              px: 1.5,
              fontSize: '0.8rem',
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <Tab
            value={GlobalSearchTabEnum.ALL}
            label={<RenderLabel label={t(Labels.shop_search_price_all)} count={totalMatches} />}
          />
          <Tab
            value={GlobalSearchTabEnum.PRODUCTS}
            label={<RenderLabel label={t(Labels.global_search_products)} count={totalProducts} />}
            icon={<ShoppingBagIcon sx={{ fontSize: '1rem !important' }} />}
            iconPosition="start"
          />
          <Tab
            value={GlobalSearchTabEnum.CATEGORIES}
            label={<RenderLabel label={t(Labels.global_search_categories)} count={totalCategories} />}
            icon={<CategoryIcon sx={{ fontSize: '1rem !important' }} />}
            iconPosition="start"
          />
          <Tab
            value={GlobalSearchTabEnum.VOYAGES}
            label={<RenderLabel label={t(Labels.global_search_voyages)} count={totalVoyages} />}
            icon={<DirectionsBusFilledIcon sx={{ fontSize: '1rem !important' }} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Results content */}
      <DialogContent sx={{ p: 0, overflowY: 'auto', flexGrow: 1 }}>
        {showSkeleton && <SearchModalSkeleton tab={activeTab} />}

        {showEmpty && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
              {t(Labels.global_search_empty_title)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 450, mx: 'auto' }}>
              {t(Labels.global_search_empty_subtitle)}
            </Typography>
          </Box>
        )}

        {hasResults && (
          <List disablePadding>
            {/* Voyages Section */}
            {showVoyages && (
              <>
                <SearchSectionHeader
                  title={t(Labels.global_search_voyages)}
                  count={totalVoyages}
                  icon={<DirectionsBusFilledIcon fontSize="small" color="primary" />}
                />
                {voyages.map(item => {
                  const itemIndex = flatItems.indexOf(item);
                  return (
                    <SearchVoyageHit
                      key={`voyage-${item.id}`}
                      hit={item}
                      query={query}
                      isSelected={itemIndex === selectedIndex}
                      onSelect={handleSelect}
                    />
                  );
                })}
              </>
            )}

            {/* Products Section */}
            {showProducts && (
              <>
                <SearchSectionHeader
                  title={t(Labels.global_search_products)}
                  count={totalProducts}
                  icon={<ShoppingBagIcon fontSize="small" color="primary" />}
                />
                {products.map(item => {
                  const itemIndex = flatItems.indexOf(item);
                  return (
                    <SearchProductHit
                      key={`product-${item.id}`}
                      hit={item}
                      query={query}
                      isSelected={itemIndex === selectedIndex}
                      onSelect={handleSelect}
                    />
                  );
                })}
              </>
            )}

            {/* Categories Section */}
            {showCategories && (
              <>
                <SearchSectionHeader
                  title={t(Labels.global_search_categories)}
                  count={totalCategories}
                  icon={<CategoryIcon fontSize="small" color="primary" />}
                />
                {categories.map(item => {
                  const itemIndex = flatItems.indexOf(item);
                  return (
                    <SearchCategoryHit
                      key={`category-${item.id}`}
                      hit={item}
                      query={query}
                      isSelected={itemIndex === selectedIndex}
                      onSelect={handleSelect}
                    />
                  );
                })}
              </>
            )}
          </List>
        )}
      </DialogContent>

      {/* Footer */}
      <SearchFooter
        totalCount={totalMatches}
        tookMs={data?.tookMs}
        onViewAll={() => {
          onClose();
          if (query.trim()) {
            navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
          }
        }}
      />
    </Dialog>
  );
};

export default GlobalSearchModal;
