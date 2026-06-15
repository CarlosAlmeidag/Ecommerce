import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useStore } from '../contexts/StoreContext'

export default function OrdersPage() {
  const { orders } = useStore()

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Histórico de pedidos</Typography>
      {!orders.length && <Typography color="text.secondary">Nenhum pedido realizado ainda.</Typography>}
      {orders.map((order) => (
        <Card key={order.id} variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
              <Typography fontWeight={700}>Pedido #{order.id}</Typography>
              <Chip label={order.status || 'processando'} color="primary" size="small" />
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : 'Data indisponível'}
            </Typography>
            <Typography sx={{ mt: 1 }}>Total: R$ {Number(order.total || 0).toFixed(2)}</Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
