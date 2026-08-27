import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { useReorderProductCategories } from '@/hooks/productCategory.hook';
import type { ProductCategory } from '@/types/shop.types';
import Labels from '@/labelKeys.json';

interface ReorderSubcategoriesDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly subcategories: ProductCategory[];
}

export default function ReorderSubcategoriesDialog({ open, onClose, subcategories }: ReorderSubcategoriesDialogProps) {
  const { t } = useTranslation();
  const reorder = useReorderProductCategories();
  const [items, setItems] = useState<ProductCategory[]>([]);

  useEffect(() => {
    if (open) {
      setItems([...subcategories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
    }
  }, [open, subcategories]);

  // Group by parent for clarity
  const grouped = useMemo(() => {
    const map = new Map<number, ProductCategory[]>();
    items.forEach((s) => {
      const pid = s.parentId ?? s.category?.id ?? 0;
      const list = map.get(pid) ?? [];
      list.push(s);
      map.set(pid, list);
    });
    return Array.from(map.entries());
  }, [items]);

  const moveWithinGroup = (parentId: number, indexInGroup: number, direction: -1 | 1) => {
    setItems((prev) => {
      const group = prev.filter((s) => (s.parentId ?? s.category?.id ?? 0) === parentId);
      const target = indexInGroup + direction;
      if (target < 0 || target >= group.length) return prev;
      const newGroup = [...group];
      const [moved] = newGroup.splice(indexInGroup, 1);
      newGroup.splice(target, 0, moved);
      // Reassemble: keep order outside of this group, replace group items in their relative positions
      const others = prev.filter((s) => (s.parentId ?? s.category?.id ?? 0) !== parentId);
      return [...others, ...newGroup];
    });
  };

  const handleSave = async () => {
    // Reassign displayOrder per-group based on current order
    const payload = grouped.flatMap(([parentId, list]) =>
      list.map((s, idx) => ({ id: s.id, parentId, displayOrder: idx + 1 }))
    );
    await reorder.mutateAsync(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t(Labels.shop_subcategory_reorder_title)}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {t(Labels.shop_category_reorder_hint)}
        </Typography>
        {grouped.map(([parentId, list]) => {
          const parentName = list[0]?.category?.name ?? `#${parentId}`;
          return (
            <Box key={parentId} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {parentName}
              </Typography>
              <List dense>
                {list.map((c, i) => (
                  <ListItem
                    key={c.id}
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => moveWithinGroup(parentId, i, -1)} disabled={i === 0}>
                          <ArrowUpward fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => moveWithinGroup(parentId, i, 1)}
                          disabled={i === list.length - 1}
                        >
                          <ArrowDownward fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                    sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemText primary={c.name} secondary={c.slug} />
                  </ListItem>
                ))}
              </List>
            </Box>
          );
        })}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={reorder.isPending}>
          {t(Labels.shop_common_cancel)}
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={reorder.isPending}>
          {t(Labels.shop_common_save)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
