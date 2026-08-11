# Material UI v7 Quick Reference - Taxibrousse

## Grid v2 (New Syntax)

```tsx
// ✅ MUI v7 - use size prop
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card>...</Card>
  </Grid>
</Grid>

// ❌ Old syntax (deprecated)
<Grid item xs={12} sm={6} md={4}>
```

## sx Prop (Preferred)

```tsx
<Box sx={{ 
  py: 4,           // padding-y: 32px (4 * 8px)
  px: 2,           // padding-x: 16px
  bgcolor: 'background.paper',
  borderRadius: 2, // 8px
  display: 'flex',
  gap: 2,
}}>
```

## Responsive Values

```tsx
<Container sx={{ 
  py: { xs: 2, md: 4 },
  px: { xs: 1, sm: 2 },
}}>

<Typography sx={{ 
  fontSize: { xs: '1rem', md: '1.25rem' },
  display: { xs: 'none', md: 'block' },
}}>
```

## Theme Tokens

```tsx
// Colors
bgcolor: 'background.default'
bgcolor: 'background.paper'
color: 'text.primary'
color: 'text.secondary'
color: 'primary.main'
color: 'error.main'

// Spacing (8px base)
p: 1   // 8px
p: 2   // 16px
m: 3   // 24px
gap: 2 // 16px

// Border radius
borderRadius: 1  // 4px
borderRadius: 2  // 8px
borderRadius: 3  // 12px
```

## Common Patterns

### Card with Actions
```tsx
<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <CardContent sx={{ flexGrow: 1 }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body2" color="text.secondary">{description}</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">{t(Labels.button_view)}</Button>
  </CardActions>
</Card>
```

### Form Field
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

### Dialog
```tsx
<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
  <DialogTitle>{title}</DialogTitle>
  <DialogContent>{content}</DialogContent>
  <DialogActions>
    <Button onClick={onClose}>{t(Labels.button_cancel)}</Button>
    <Button variant="contained" onClick={onConfirm}>{t(Labels.button_confirm)}</Button>
  </DialogActions>
</Dialog>
```

### Section Layout
```tsx
<Box sx={{ py: 6, bgcolor: 'background.default' }}>
  <Container maxWidth="lg">
    <Typography variant="h4" gutterBottom align="center">
      {title}
    </Typography>
    {/* Content */}
  </Container>
</Box>
```

## Typography Variants

| Variant | Usage |
|---------|-------|
| `h1` - `h6` | Headings |
| `subtitle1`, `subtitle2` | Subheadings |
| `body1`, `body2` | Body text |
| `caption` | Small text |
| `button` | Button text |

## Button Variants

```tsx
<Button variant="contained" color="primary">Primary</Button>
<Button variant="outlined" color="secondary">Secondary</Button>
<Button variant="text">Text</Button>
<Button startIcon={<AddIcon />}>With Icon</Button>
```

## Imports

```tsx
// Prefer named imports
import { Box, Container, Typography, Grid, Card, Button } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
```
