import { useEffect, useState } from 'react'
import { Avatar, Box, Button, Card, CardContent, Grid, Rating, Stack, TextField, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { apiClient } from '../services/api'
import { useStore } from '../contexts/StoreContext'

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useStore()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ user: '', rating: 5, comment: '' })

  useEffect(() => {
    apiClient.products.byId(id).then(setProduct)
    apiClient.reviews.listByProduct(id).then(setReviews)
  }, [id])

  if (!product) return <Typography>Produto não encontrado.</Typography>

  const submitReview = async (event) => {
    event.preventDefault()
    if (!newReview.user || !newReview.comment) return
    const created = await apiClient.reviews.create(id, newReview)
    setReviews((current) => [created, ...current])
    setNewReview({ user: '', rating: 5, comment: '' })
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box component="img" src={product.image} alt={product.name} sx={{ width: '100%', borderRadius: 2 }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={2}>
          <Typography variant="h4">{product.name}</Typography>
          <Typography>{product.description}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Rating value={product.rating || 0} precision={0.1} readOnly />
            <Typography variant="body2">({product.rating})</Typography>
          </Stack>
          <Typography variant="h5">R$ {product.price.toFixed(2)}</Typography>
          <Button variant="contained" onClick={() => addToCart(product, 1)}>
            Adicionar ao carrinho
          </Button>
        </Stack>
      </Grid>

      <Grid size={12}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Avaliações e comentários
        </Typography>
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Card key={review.id} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{review.user?.charAt(0)?.toUpperCase() || 'U'}</Avatar>
                  <Box>
                    <Typography fontWeight={700}>{review.user}</Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                </Stack>
                <Typography sx={{ mt: 1 }}>{review.comment}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Box component="form" onSubmit={submitReview} sx={{ mt: 3, display: 'grid', gap: 2, maxWidth: 500 }}>
          <TextField label="Seu nome" value={newReview.user} onChange={(event) => setNewReview((current) => ({ ...current, user: event.target.value }))} />
          <TextField
            label="Comentário"
            multiline
            minRows={3}
            value={newReview.comment}
            onChange={(event) => setNewReview((current) => ({ ...current, comment: event.target.value }))}
          />
          <Button type="submit" variant="outlined">
            Enviar avaliação
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}
