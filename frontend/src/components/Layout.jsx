import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import { AppBar, Badge, Box, Button, IconButton, Snackbar, Stack, Toolbar } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { useStore } from '../contexts/StoreContext'

const links = [
  { label: 'Início', to: '/' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Pedidos', to: '/pedidos' },
]

export default function Layout() {
  const { cart, wishlist, notification, clearNotification } = useStore()

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <BrandLogo />
          </RouterLink>
          <Stack direction="row" spacing={1}>
            {links.map((item) => (
              <Button key={item.to} component={RouterLink} to={item.to} color="inherit">
                {item.label}
              </Button>
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton component={RouterLink} to="/favoritos" aria-label="favoritos">
              <Badge badgeContent={wishlist.length} color="primary">
                <FavoriteBorderOutlinedIcon />
              </Badge>
            </IconButton>
            <IconButton component={RouterLink} to="/carrinho" aria-label="carrinho">
              <Badge badgeContent={cart.reduce((acc, item) => acc + item.quantity, 0)} color="primary">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>
            <IconButton component={RouterLink} to="/perfil" aria-label="perfil">
              <PersonOutlineOutlinedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Outlet />
      </Box>
      <Snackbar open={Boolean(notification)} autoHideDuration={2500} onClose={clearNotification} message={notification} />
    </>
  )
}
