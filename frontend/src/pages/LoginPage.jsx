import { useState } from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/api'
import { useStore } from '../contexts/StoreContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { setAuth } = useStore()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    if (!form.email || !form.password) {
      setError('Informe e-mail e senha.')
      return
    }
    const data = await apiClient.auth.login(form)
    setAuth(data)
    navigate('/perfil')
  }

  return (
    <Box component="form" onSubmit={submit} sx={{ maxWidth: 420 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Entrar</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="E-mail" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <TextField label="Senha" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
        <Button type="submit" variant="contained">
          Login
        </Button>
        <Button component={RouterLink} to="/registro">
          Criar conta
        </Button>
      </Stack>
    </Box>
  )
}
