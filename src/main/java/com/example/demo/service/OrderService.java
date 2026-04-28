package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.model.*;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

   //Cria um novo pedido
    @Transactional
    public OrderResponseDTO createOrder(String userEmail, OrderRequestDTO request) {
        // Busca usuário
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Cria o pedido
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        BigDecimal totalPrice = BigDecimal.ZERO;

        // Processa cada item do pedido
        List<OrderItem> items = request.getItems().stream()
                .map(itemDto -> {
                    Product product = productRepository.findById(itemDto.getProductId())
                            .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDto.getProductId()));

                    // Valida estoque
                    if (product.getStock() < itemDto.getQuantity()) {
                        throw new RuntimeException("Estoque insuficiente para: " + product.getName());
                    }

                    // Diminui estoque
                    product.setStock(product.getStock() - itemDto.getQuantity());
                    productRepository.save(product);

                    // Cria item do pedido
                    OrderItem orderItem = OrderItem.builder()
                            .order(order)
                            .product(product)
                            .quantity(itemDto.getQuantity())
                            .priceAtPurchase(product.getPrice())
                            .build();

                    return orderItem;
                })
                .collect(Collectors.toList());

        // Calcula total
        totalPrice = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(items);
        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(order);

        return toResponseDTO(savedOrder);
    }

   //lista pedido dos usuarios

    public Page<OrderResponseDTO> getUserOrders(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return orderRepository.findByUserId(user.getId(), pageable)
                .map(this::toResponseDTO);
    }

    //busca um pedido especifico

    public OrderResponseDTO getOrderById(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Valida se o pedido pertence ao usuário
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Acesso negado a este pedido");
        }

        return toResponseDTO(order);
    }

  //atualiza status do pedido
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        try {
            order.setStatus(OrderStatus.valueOf(newStatus.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status inválido: " + newStatus);
        }

        Order updatedOrder = orderRepository.save(order);
        return toResponseDTO(updatedOrder);
    }


    @Transactional
    public void cancelOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Valida se o pedido pertence ao usuário
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Acesso negado a este pedido");
        }

        // Verifica se pode cancelar
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Pedido não pode ser cancelado com status: " + order.getStatus());
        }

        // Devolve os produtos ao estoque
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }


     //Converte Order para OrderResponseDTO

    private OrderResponseDTO toResponseDTO(Order order) {
        List<OrderItemResponseDTO> itemsDto = order.getItems().stream()
                .map(item -> new OrderItemResponseDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new OrderResponseDTO(
                order.getId(),
                order.getUser().getEmail(),
                itemsDto,
                order.getTotalPrice(),
                order.getStatus().toString(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}