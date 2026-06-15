/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { apiClient } from '../services/api'

const StoreContext = createContext(null)

const load = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const initialState = {
  cart: load('twocc_cart', []),
  wishlist: load('twocc_wishlist', []),
  user: load('twocc_user', null),
  token: load('twocc_token', null),
  orders: load('twocc_orders', []),
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find((item) => item.id === action.payload.id)
      const cart = existing
        ? state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
          )
        : [...state.cart, action.payload]
      return { ...state, cart }
    }
    case 'UPDATE_QTY':
      return {
        ...state,
        cart: state.cart
          .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
          .filter((item) => item.quantity > 0),
      }
    case 'REMOVE_CART':
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) }
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.includes(action.payload)
      return {
        ...state,
        wishlist: exists ? state.wishlist.filter((id) => id !== action.payload) : [...state.wishlist, action.payload],
      }
    }
    case 'SET_AUTH':
      return { ...state, user: action.payload.user, token: action.payload.token }
    case 'LOGOUT':
      return { ...state, user: null, token: null }
    case 'SET_ORDERS':
      return { ...state, orders: action.payload }
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders], cart: [] }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [notification, setNotification] = useState('')

  useEffect(() => localStorage.setItem('twocc_cart', JSON.stringify(state.cart)), [state.cart])
  useEffect(() => localStorage.setItem('twocc_wishlist', JSON.stringify(state.wishlist)), [state.wishlist])
  useEffect(() => localStorage.setItem('twocc_user', JSON.stringify(state.user)), [state.user])
  useEffect(() => localStorage.setItem('twocc_token', JSON.stringify(state.token)), [state.token])
  useEffect(() => localStorage.setItem('twocc_orders', JSON.stringify(state.orders)), [state.orders])

  useEffect(() => {
    apiClient.orders.list().then((orders) => {
      if (orders.length) {
        dispatch({ type: 'SET_ORDERS', payload: orders })
      }
    })
  }, [])

  const actions = useMemo(
    () => ({
      addToCart(product, quantity = 1) {
        dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } })
        setNotification(`${product.name} adicionado ao carrinho`)
      },
      updateQuantity(id, quantity) {
        dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } })
      },
      removeFromCart(id) {
        dispatch({ type: 'REMOVE_CART', payload: id })
      },
      toggleWishlist(id) {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: id })
      },
      setAuth(data) {
        dispatch({ type: 'SET_AUTH', payload: data })
      },
      logout() {
        dispatch({ type: 'LOGOUT' })
      },
      async createOrder(orderPayload) {
        const order = await apiClient.orders.create(orderPayload)
        dispatch({ type: 'ADD_ORDER', payload: order })
        setNotification('Pedido realizado com sucesso!')
      },
      clearNotification() {
        setNotification('')
      },
    }),
    [],
  )

  const value = useMemo(() => ({ ...state, notification, ...actions }), [state, notification, actions])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return context
}
