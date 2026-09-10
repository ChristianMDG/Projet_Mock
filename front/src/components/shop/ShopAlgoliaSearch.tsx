import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { Box, Paper, List, Typography, ClickAwayListener } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Category, Product } from '@/models/Shop';
import {
  SearchInput,
  SearchCategoryHit,
  SearchProductHit,
  SearchSectionHeader,
  SearchFooter,
} from '@/components/search';
import type { GlobalSearchHit } from '@/api/global-search.api';
import Labels from '@/labelKeys.json';

export interface ShopAlgoliaSearchProps {
  value: string;
  onChange: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  categories?: Category[];
  products?: Product[];
  onCategorySelect?: (category: Category) => void;
  onProductSelect?: (product: Product) => void;
  isSearching?: boolean;
}

export const ShopAlgoliaSearch: React.FC<ShopAlgoliaSearchProps> = ({
  value,
  onChange,
  onSearchSubmit,
  categories = [],
  products = [],
  onCategorySelect,
  onProductSelect,
  isSearching = false,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const trimmedQuery = value.trim().toLowerCase();
  const hasQuery = Boolean(trimmedQuery);

  const matchingCategories = useMemo(() => {
    if (hasQuery) {
      return categories
        .filter(c => {
          const matchCat = c.name.toLowerCase().includes(trimmedQuery);
          const matchSub = (c.subcategories ?? []).some(s => s.name.toLowerCase().includes(trimmedQuery));
          return matchCat || matchSub;
        })
        .slice(0, 3);
    }
    return [];
  }, [categories, hasQuery, trimmedQuery]);

  const matchingProducts = useMemo(() => {
    if (hasQuery) {
      return products
        .filter(p => {
          const matchName = p.name.toLowerCase().includes(trimmedQuery);
          const matchDesc = p.description.toLowerCase().includes(trimmedQuery);
          const matchCat = (p.category?.name ?? '').toLowerCase().includes(trimmedQuery);
          return matchName || matchDesc || matchCat;
        })
        .slice(0, 5);
    }
    return [];
  }, [products, hasQuery, trimmedQuery]);

  const totalMatchCount = matchingProducts.length;
  const hasDropdownResults = matchingCategories.length > 0 || matchingProducts.length > 0;
  const showDropdown = isOpen && hasQuery;

  const handleOpenDropdown = () => {
    if (hasQuery) {
      setIsOpen(true);
    }
  };

  const handleCloseDropdown = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === 'Enter') {
      setIsOpen(false);
      onSearchSubmit?.(value);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <ClickAwayListener onClickAway={handleCloseDropdown}>
      <Box sx={{ position: 'relative', width: 1, zIndex: 10 }}>
        <SearchInput
          ref={inputRef}
          value={value}
          onChange={val => {
            onChange(val);
            if (Boolean(val.trim())) {
              setIsOpen(true);
            }
          }}
          onClear={handleClear}
          onFocus={handleOpenDropdown}
          onKeyDown={handleKeyDown}
          placeholder={t(Labels.shop_search_placeholder)}
          isSearching={isSearching}
          showShortcut
        />

        {showDropdown && (
          <Paper
            elevation={6}
            sx={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            {hasDropdownResults ? (
              <List disablePadding sx={{ maxHeight: 380, overflowY: 'auto' }}>
                {/* Categories Section */}
                {matchingCategories.length > 0 && (
                  <>
                    <SearchSectionHeader
                      title={t(Labels.shop_search_matching_categories)}
                      count={matchingCategories.length}
                    />
                    {matchingCategories.map(cat => {
                      const hit: GlobalSearchHit = {
                        id: String(cat.slug),
                        type: 'CATEGORY',
                        title: cat.name,
                        subtitle: cat.subcategories?.length
                          ? `${cat.subcategories.length} ${t(Labels.shop_items, { count: cat.subcategories.length })}`
                          : undefined,
                        imageUrl: cat.image?.url,
                      };
                      return (
                        <SearchCategoryHit
                          key={cat.slug}
                          hit={hit}
                          query={value}
                          onSelect={() => {
                            onCategorySelect?.(cat);
                            setIsOpen(false);
                          }}
                        />
                      );
                    })}
                  </>
                )}

                {/* Products Section */}
                {matchingProducts.length > 0 && (
                  <>
                    <SearchSectionHeader
                      title={t(Labels.shop_search_matching_products)}
                      count={matchingProducts.length}
                    />
                    {matchingProducts.map(product => {
                      const hit: GlobalSearchHit = {
                        id: String(product.id),
                        type: 'PRODUCT',
                        title: product.name,
                        subtitle: product.category?.name,
                        price: product.price,
                        imageUrl: product.images?.[0]?.url,
                      };
                      return (
                        <SearchProductHit
                          key={product.id}
                          hit={hit}
                          query={value}
                          onSelect={() => {
                            onProductSelect?.(product);
                            setIsOpen(false);
                          }}
                        />
                      );
                    })}
                  </>
                )}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 3, textAlign: 'center', fontSize: '0.85rem' }}
              >
                {t(Labels.shop_search_no_results_for, { query: value })}
              </Typography>
            )}

            <SearchFooter
              totalCount={totalMatchCount}
              onViewAll={() => {
                setIsOpen(false);
                onSearchSubmit?.(value);
              }}
            />
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default memo(ShopAlgoliaSearch);
