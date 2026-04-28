package com.example.demo.controller;

import com.example.demo.dto.OrderRequestDTO;
import com.example.demo.dto.OrderResponseDTO;
import com.example.demo.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final OrderService orderService;


    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @Valid @RequestBody OrderRequestDTO request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        OrderResponseDTO response = orderService.createOrder(userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping
    public ResponseEntity<Page<OrderResponseDTO>> getUserOrders(
            Authentication authentication,
            Pageable pageable
    ) {
        String userEmail = authentication.getName();
        Page<OrderResponseDTO> response = orderService.getUserOrders(userEmail, pageable);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        OrderResponseDTO response = orderService.getOrderById(orderId, userEmail);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        OrderResponseDTO response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        orderService.cancelOrder(orderId, userEmail);
        return ResponseEntity.noContent().build();
    }
}