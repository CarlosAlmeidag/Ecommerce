import { useEffect, useMemo, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import ProductCard from '../components/ProductCard'
import { useStore } from '../contexts/StoreContext'
import { apiClient } from '../services/api'

export default function WishlistPage() {
  const [products, setProducts] = useState([])
  const { wishlist } = useStore()

  useEffect(() => {
    apiClient.products.list().then(setProducts)
  }, [])

  const favorites = useMemo(() => products.filter((product) => wishlist.includes(product.id)), [products, wishlist])

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Favoritos</Typography>
      {!favorites.length && <Typography color="text.secondary">Você ainda não adicionou produtos na wishlist.</Typography>}
      <Grid container spacing={2}>
        {favorites.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
