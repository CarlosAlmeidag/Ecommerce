import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Rating, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useStore } from '../contexts/StoreContext'

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore()
  const isLiked = wishlist.includes(product.id)

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height="240" image={product.image} alt={product.name} />
        <IconButton
          onClick={() => toggleWishlist(product.id)}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)' }}
          aria-label="favoritar"
        >
          {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.category} • {product.color}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating value={product.rating || 0} precision={0.1} readOnly size="small" />
          <Typography variant="caption">{product.rating || 0}</Typography>
        </Stack>
        <Typography variant="h6" sx={{ mt: 1 }}>
          R$ {product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button component={RouterLink} to={`/produto/${product.id}`} size="small">
          Ver detalhes
        </Button>
        <Button variant="contained" size="small" onClick={() => addToCart(product, 1)}>
          Comprar
        </Button>
      </CardActions>
    </Card>
  )
}
