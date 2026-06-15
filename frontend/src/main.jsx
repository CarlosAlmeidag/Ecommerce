import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'
import { StoreProvider } from './contexts/StoreContext'

const theme = createTheme({
  palette: {
    primary: { main: '#1e1e2f' },
    secondary: { main: '#d3a76f' },
    background: { default: '#faf8f5' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'system-ui', 'sans-serif'].join(','),
    h3: { fontWeight: 800 },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <StoreProvider>
          <App />
        </StoreProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
