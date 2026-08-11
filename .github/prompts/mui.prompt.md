---
agent: agent
---

# Material UI v9 - Taxibrousse
**Note:** All references to deprecated MUI APIs (e.g., legacy Grid, makeStyles, withStyles, system shorthand props as direct component props) are obsolete. Use only MUI v9 patterns (Grid v2, `sx` prop, theme tokens). Remove any usage of deprecated imports in new code.

## Agent Instructions

- Keep components minimal; use only MUI v9 APIs (Grid v2, `sx` prop, theme tokens)
- Remove any legacy/deprecated MUI code (makeStyles, withStyles, old Grid)
- **System props (`fontWeight`, `textAlign`, `alignItems`, `display`, `gap`, `flexWrap`, `color` as CSS, etc.) are NOT accepted as direct props on MUI components in v9 — always put them in `sx`**
- `Box` is exempt: it accepts system props directly as well as via `sx`
- MUI-specific behavioral props (`variant`, `size`, `color` on Button/Chip, `gutterBottom`, `noWrap`, `spacing`, `direction`, `elevation`, `fullWidth`, `disabled`, `component`) remain as direct props
- Reuse shared components from `@/components/shared/`; avoid duplicating variants
- Use positive conditions for responsive logic
- **ALWAYS format files after any change**: `cd front && npm run format` or `cd dashboard && npm run format`
- Import from `@/` for clean module paths

## Quick Patterns

### Responsive Grid (MUI v7 only)
```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card>...</Card>
  </Grid>
</Grid>
```

### sx Prop (Preferred)
```tsx
<Box sx={{ 
  py: 4, 
  px: 2, 
  bgcolor: 'background.paper',
  borderRadius: 2 
}}>
  <Typography variant="h4" sx={{ mb: 2 }}>Title</Typography>
</Box>
```

### Responsive Values
// ...existing code...
```tsx
<Container maxWidth="lg" sx={{ 
  py: { xs: 2, md: 4 },
  px: { xs: 1, sm: 2 }
}}>
```

### Form Fields
```tsx
<TextField
  fullWidth
  label={t(Labels.field_name)}
  value={value}
  onChange={handleChange}
  error={!!error}
  helperText={error}
  sx={{ mb: 2 }}
/>
```

### Buttons
```tsx
<Button 
  variant="contained" 
  color="primary"
  startIcon={<AddIcon />}
  onClick={handleClick}
>
  {t(Labels.button_add)}
</Button>
```

### Cards
```tsx
<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <CardContent sx={{ flexGrow: 1 }}>
    <Typography variant="h6">{title}</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">{t(Labels.button_view)}</Button>
  </CardActions>
</Card>
```

### Dialogs
```tsx
<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
  <DialogTitle>{title}</DialogTitle>
  <DialogContent>...</DialogContent>
  <DialogActions>
    <Button onClick={onClose}>{t(Labels.button_cancel)}</Button>
    <Button variant="contained" onClick={onConfirm}>{t(Labels.button_confirm)}</Button>
  </DialogActions>
</Dialog>
```

## Theme Tokens

```tsx
// Colors
bgcolor: 'background.default'
bgcolor: 'background.paper'
color: 'text.primary'
color: 'text.secondary'
color: 'primary.main'

// Spacing (8px base)
p: 2  // 16px
m: 1  // 8px
gap: 2

// Border radius
borderRadius: 1  // 4px
borderRadius: 2  // 8px
```

## Shared Components

| Component | Location | Usage |
|-----------|----------|-------|
| `PageLoader` | `shared/PageLoader.tsx` | Full page loading |
| `InlineLoader` | `shared/InlineLoader.tsx` | Inline loading |
| `ImageMedia` | `shared/ImageMedia.tsx` | Cloudinary images |
| `PhoneInput` | `shared/PhoneInput.tsx` | Phone number input |
| `VilleAutocomplete` | `shared/VilleAutocomplete.tsx` | City selector |
| `IconMapper` | `shared/IconMapper.tsx` | MUI icon by name |

## Section Components

All in `front/src/components/section/`:
- Use `Container maxWidth="lg"` for content width
- Use `Box sx={{ py: 6 }}` for vertical spacing
- Support `backgroundColor` and `containerMaxWidth` props

## Best Practices

- Use `sx` prop instead of `styled()` for simple styles
- Use theme tokens instead of hardcoded values
- Use `size` prop for Grid v2 (not `xs`, `sm`, `md`)
- Use `variant="h4"` etc. for typography hierarchy
- Always add `fullWidth` to form fields in forms
