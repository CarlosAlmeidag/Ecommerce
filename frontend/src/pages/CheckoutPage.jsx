import { useState } from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../contexts/StoreContext'

const initialForm = { name: '', email: '', address: '', city: '', zip: '', cardNumber: '', cardName: '' }

export default function CheckoutPage() {
  const { cart, createOrder, user } = useStore()
  const [form, setForm] = useState({ ...initialForm, name: user?.name || '', email: user?.email || '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    const required = Object.values(form).every(Boolean)
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    const validCard = form.cardNumber.replace(/\s/g, '').length >= 12

    if (!cart.length) {
      setError('Seu carrinho está vazio.')
      return
    }
    if (!required || !validEmail || !validCard) {
      setError('Preencha todos os campos corretamente para concluir o checkout.')
      return
    }

    await createOrder({
      customer: form,
      items: cart,
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    })

    navigate('/pedidos')
  }

  return (
    <Box component="form" onSubmit={submit} sx={{ maxWidth: 680 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Checkout</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Nome completo" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <TextField label="E-mail" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <TextField label="Endereço" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField fullWidth label="Cidade" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
          <TextField fullWidth label="CEP" value={form.zip} onChange={(event) => setForm((current) => ({ ...current, zip: event.target.value }))} />
        </Stack>
        <TextField label="Número do cartão" value={form.cardNumber} onChange={(event) => setForm((current) => ({ ...current, cardNumber: event.target.value }))} />
        <TextField label="Nome no cartão" value={form.cardName} onChange={(event) => setForm((current) => ({ ...current, cardName: event.target.value }))} />
        <Button type="submit" variant="contained">
          Confirmar pedido
        </Button>
      </Stack>
    </Box>
  )
}
