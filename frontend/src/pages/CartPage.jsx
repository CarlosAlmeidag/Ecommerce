import { Box, Button, Card, CardContent, Divider, IconButton, Stack, TextField, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { Link as RouterLink } from 'react-router-dom'
import { useStore } from '../contexts/StoreContext'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useStore()
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  if (!cart.length) {
    return (
      <Stack spacing={2}>
        <Typography variant="h4">Seu carrinho está vazio</Typography>
        <Button component={RouterLink} to="/catalogo" variant="contained" sx={{ width: 'fit-content' }}>
          Ir para catálogo
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Carrinho</Typography>
      {cart.map((item) => (
        <Card key={item.id} variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography fontWeight={700}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  R$ {item.price.toFixed(2)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  type="number"
                  label="Qtd"
                  size="small"
                  inputProps={{ min: 1 }}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, Number(event.target.value || 1))}
                  sx={{ width: 90 }}
                />
                <IconButton onClick={() => removeFromCart(item.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
      <Divider />
      <Typography variant="h5">Total: R$ {total.toFixed(2)}</Typography>
      <Button component={RouterLink} to="/checkout" variant="contained" sx={{ width: 'fit-content' }}>
        Finalizar compra
      </Button>
    </Stack>
  )
}
