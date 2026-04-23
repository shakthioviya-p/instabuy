package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByDealerId(Long dealerId);
    Product findByProductNameAndDealerId(String productName, Long dealerId);
    List<Product> findByProductNameContainingIgnoreCaseAndDealerId(
    	    String name, Long dealerId
    	);
	
}