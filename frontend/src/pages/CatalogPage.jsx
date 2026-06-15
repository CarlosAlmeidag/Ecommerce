import { useEffect, useMemo, useState } from 'react'
import { Box, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Slider, Stack, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ProductCard from '../components/ProductCard'
import { apiClient } from '../services/api'

const emptyFilters = { category: '', size: '', color: '', maxPrice: 500 }

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [search, setSearch] = useState('')

  useEffect(() => {
    apiClient.products.list().then(setProducts)
  }, [])

  const categories = [...new Set(products.map((product) => product.category))]
  const sizes = [...new Set(products.map((product) => product.size))]
  const colors = [...new Set(products.map((product) => product.color))]

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchSearch = product.name.toLowerCase().includes(search.toLowerCase())
        const matchCategory = !filters.category || product.category === filters.category
        const matchSize = !filters.size || product.size === filters.size
        const matchColor = !filters.color || product.color === filters.color
        const matchPrice = product.price <= filters.maxPrice
        return matchSearch && matchCategory && matchSize && matchColor && matchPrice
      }),
    [products, filters, search],
  )

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Catálogo</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <OutlinedInput
            fullWidth
            placeholder="Buscar produto"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Grid>
        {[['category', categories, 'Categoria'], ['size', sizes, 'Tamanho'], ['color', colors, 'Cor']].map(([name, values, label]) => (
          <Grid key={name} size={{ xs: 4, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>{label}</InputLabel>
              <Select
                label={label}
                value={filters[name]}
                onChange={(event) => setFilters((current) => ({ ...current, [name]: event.target.value }))}
              >
                <MenuItem value="">Todos</MenuItem>
                {values.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 2 }}>
          <Typography gutterBottom>Até R$ {filters.maxPrice}</Typography>
          <Slider
            min={50}
            max={500}
            step={10}
            value={filters.maxPrice}
            onChange={(_, value) => setFilters((current) => ({ ...current, maxPrice: value }))}
          />
        </Grid>
      </Grid>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filtered.length} produto(s) encontrado(s)
        </Typography>
        <Grid container spacing={2}>
          {filtered.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  )
}
