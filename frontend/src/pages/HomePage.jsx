import { useEffect, useState } from 'react'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { apiClient } from '../services/api'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    apiClient.products.featured().then(setFeatured)
  }, [])

  return (
    <Stack spacing={4}>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: { xs: 3, md: 6 }, borderRadius: 3 }}>
        <Typography variant="overline">coleção twocc</Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Moda urbana com atitude
        </Typography>
        <Typography sx={{ mb: 3 }}>Peças exclusivas para compor looks autênticos em qualquer estação.</Typography>
        <Button component={RouterLink} to="/catalogo" variant="contained" color="secondary">
          Explorar catálogo
        </Button>
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Produtos em destaque
        </Typography>
        <Grid container spacing={2}>
          {featured.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  )
}
