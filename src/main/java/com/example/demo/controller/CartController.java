package com.example.demo.controller;

import com.example.demo.dto.CartItemRequestDTO;
import com.example.demo.dto.CartResponseDTO;
import com.example.demo.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class CartController {

    private final CartService cartService;


    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(Authentication authentication) {
        String userEmail = authentication.getName();
        CartResponseDTO response = cartService.getCart(userEmail);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addItem(
            @Valid @RequestBody CartItemRequestDTO request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        CartResponseDTO response = cartService.addItem(userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponseDTO> updateItemQuantity(
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        CartResponseDTO response = cartService.updateItemQuantity(userEmail, productId, quantity);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponseDTO> removeItem(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        CartResponseDTO response = cartService.removeItem(userEmail, productId);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        String userEmail = authentication.getName();
        cartService.clearCart(userEmail);
        return ResponseEntity.noContent().build();
    }
}