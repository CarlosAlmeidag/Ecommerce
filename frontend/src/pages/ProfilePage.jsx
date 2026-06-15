import { useState } from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useStore } from '../contexts/StoreContext'

export default function ProfilePage() {
  const { user, setAuth, token, logout } = useStore()
  const [name, setName] = useState(user?.name || '')

  if (!user) {
    return (
      <Stack spacing={2}>
        <Typography variant="h4">Perfil</Typography>
        <Alert severity="info">Você precisa entrar para acessar seu perfil.</Alert>
        <Button component={RouterLink} to="/login" variant="contained" sx={{ width: 'fit-content' }}>
          Fazer login
        </Button>
      </Stack>
    )
  }

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Meu perfil</Typography>
        <TextField label="Nome" value={name} onChange={(event) => setName(event.target.value)} />
        <TextField label="E-mail" value={user.email} disabled />
        <Button variant="contained" onClick={() => setAuth({ user: { ...user, name }, token })}>
          Salvar
        </Button>
        <Button component={RouterLink} to="/pedidos" variant="outlined">
          Ver histórico de pedidos
        </Button>
        <Button color="error" onClick={logout}>
          Sair
        </Button>
      </Stack>
    </Box>
  )
}
