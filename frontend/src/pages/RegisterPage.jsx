import { useState } from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../services/api'
import { useStore } from '../contexts/StoreContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { setAuth } = useStore()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || form.password.length < 6) {
      setError('Preencha nome, e-mail e senha com no mínimo 6 caracteres.')
      return
    }
    const data = await apiClient.auth.register(form)
    setAuth(data)
    navigate('/perfil')
  }

  return (
    <Box component="form" onSubmit={submit} sx={{ maxWidth: 420 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Criar conta</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Nome" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <TextField label="E-mail" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <TextField label="Senha" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
        <Button type="submit" variant="contained">
          Registrar
        </Button>
      </Stack>
    </Box>
  )
}
