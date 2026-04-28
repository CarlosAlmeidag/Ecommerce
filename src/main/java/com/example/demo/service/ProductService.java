package com.example.demo.service;

import com.example.demo.dto.ProductRequestDTO;
import com.example.demo.dto.ProductResponseDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Lista todos os produtos ativos com paginação
     */
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable)
                .map(this::toResponseDTO);
    }

    /**
     * Busca um produto por ID
     */
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));
        return toResponseDTO(product);
    }

    /**
     * Busca produtos por categoria
     */
    public Page<ProductResponseDTO> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategoryAndActiveTrue(category, pageable)
                .map(this::toResponseDTO);
    }

    /**
     * Cria um novo produto (ADMIN)
     */
    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(request.getCategory())
                .active(true)
                .build();

        Product savedProduct = productRepository.save(product);
        return toResponseDTO(savedProduct);
    }

    /**
     * Atualiza um produto (ADMIN)
     */
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());

        Product updatedProduct = productRepository.save(product);
        return toResponseDTO(updatedProduct);
    }

    /**
     * Desativa um produto (ADMIN)
     */
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    /**
     * Converte Product para ProductResponseDTO
     */
    private ProductResponseDTO toResponseDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCategory()
        );
    }
}