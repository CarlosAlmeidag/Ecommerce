# twocc Frontend

Frontend React para o e-commerce **twocc**, integrado ao backend Java por API REST.

## Stack
- React + Vite
- React Router DOM
- Context API (estado global)
- Axios
- Material-UI

## Funcionalidades
- Home com produtos em destaque
- Catálogo com filtros (categoria, tamanho, cor e preço) + busca
- Página de produto com avaliações/comentários
- Carrinho persistente em localStorage
- Checkout com validação de dados
- Login e cadastro
- Perfil do usuário
- Histórico de pedidos
- Wishlist/Favoritos
- Notificações de carrinho
- Layout responsivo (mobile-first)

## Configuração
```bash
npm install
cp .env.example .env
npm run dev
```

A base da API pode ser configurada via `VITE_API_BASE_URL`.
