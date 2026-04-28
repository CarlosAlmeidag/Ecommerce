package com.example.demo.service;

import com.example.demo.dto.CartItemRequestDTO;
import com.example.demo.dto.CartItemResponseDTO;
import com.example.demo.dto.CartResponseDTO;
import com.example.demo.exception.BusinessException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    private Cart getOrCreateCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();
                    return cartRepository.save(newCart);
                });
    }


    @Transactional
    public CartResponseDTO addItem(String userEmail, CartItemRequestDTO request) {
        Cart cart = getOrCreateCart(userEmail);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + request.getProductId()));

        // Verifica estoque
        if (product.getStock() < request.getQuantity()) {
            throw new BusinessException("Estoque insuficiente para: " + product.getName() + ". Disponível: " + product.getStock());
        }

        // Verifica se o produto já está no carrinho
        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (existingItem != null) {
            // Atualiza quantidade
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            // Cria novo item
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
        }

        return toResponseDTO(cart);
    }


    @Transactional
    public CartResponseDTO removeItem(String userEmail, Long productId) {
        Cart cart = getOrCreateCart(userEmail);

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado no carrinho"));

        cartItemRepository.delete(item);

        return toResponseDTO(cart);
    }


    @Transactional
    public CartResponseDTO updateItemQuantity(String userEmail, Long productId, Integer quantity) {
        if (quantity <= 0) {
            return removeItem(userEmail, productId);
        }

        Cart cart = getOrCreateCart(userEmail);

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado no carrinho"));

        Product product = item.getProduct();

        // Verifica estoque
        if (product.getStock() < quantity) {
            throw new BusinessException("Estoque insuficiente para: " + product.getName() + ". Disponível: " + product.getStock());
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return toResponseDTO(cart);
    }


    public CartResponseDTO getCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        return toResponseDTO(cart);
    }

    //limpa o carrinho
    @Transactional
    public void clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().clear();
        cartRepository.save(cart);
    }


    private CartResponseDTO toResponseDTO(Cart cart) {
        cart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado"));

        List<CartItemResponseDTO> itemsDto = cart.getItems().stream()
                .map(item -> new CartItemResponseDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getProduct().getPrice(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new CartResponseDTO(
                cart.getId(),
                itemsDto,
                cart.getTotal(),
                cart.getTotalItems()
        );
    }
}