package com.example.demo.service;

import com.example.demo.entity.Inventory;
import com.example.demo.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repo;

    // ✅ 1. CHECK STOCK
    public String checkStock(Long productId, int qty) {

        Inventory inv = repo.findByProductId(productId);

        if (inv == null) {
            return "PRODUCT NOT FOUND";
        }

        if (inv.getAvailableQuantity() >= qty) {
            return "IN STOCK";
        } else {
            return "OUT OF STOCK";
        }
    }

    // ✅ 2. RESERVE STOCK (BEFORE PAYMENT)
    @Transactional
    public String reserveStock(Long productId, int qty) {

        Inventory inv = repo.findByProductId(productId);

        if (inv == null) {
            throw new RuntimeException("Product not found");
        }

        if (inv.getAvailableQuantity() < qty) {
            throw new RuntimeException("Out of stock");
        }

        inv.setAvailableQuantity(inv.getAvailableQuantity() - qty);
        inv.setReservedQuantity(inv.getReservedQuantity() + qty);
        inv.setReservedAt(LocalDateTime.now());

        repo.save(inv);

        return "Stock Reserved";
    }

    // ✅ 3. PAYMENT SUCCESS → FINAL DEDUCTION
    @Transactional
    public String confirmOrder(Long productId, int qty) {

        Inventory inv = repo.findByProductId(productId);

        inv.setReservedQuantity(
        	    Math.max(0, inv.getReservedQuantity() - qty)
        	);
        inv.setTotalQuantity(inv.getTotalQuantity() - qty);

        inv.setReservedAt(null); // 🔥 IMPORTANT FIX

        repo.save(inv);

        return "Order Confirmed & Stock Deducted";
    }

    // ✅ 4. PAYMENT FAILED → RESTORE STOCK
    @Transactional
    
    public String releaseStock(Long productId, int qty) {

        Inventory inv = repo.findByProductId(productId);

        inv.setReservedQuantity(
        	    Math.max(0, inv.getReservedQuantity() - qty)
        	);
        inv.setAvailableQuantity(inv.getAvailableQuantity() + qty);

        inv.setReservedAt(null); // 🔥 IMPORTANT FIX

        repo.save(inv);

        return "Stock Released";
    }
    // ✅ 5. AUTO TIMEOUT (5 MINUTES)
    @Transactional
    public void releaseTimeoutStock() {

        List<Inventory> list = repo.findAll();

        for (Inventory inv : list) {

            // ✅ ONLY if still reserved AND time exceeded
            if (inv.getReservedQuantity() > 0 &&
                inv.getReservedAt() != null &&
                inv.getReservedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {

                // 🔥 restore deducted stock
                inv.setAvailableQuantity(
                    inv.getAvailableQuantity() + inv.getReservedQuantity()
                );

                // 🔥 clear reserved quantity
                inv.setReservedQuantity(0);

                // 🔥 clear timestamp
                inv.setReservedAt(null);

                repo.save(inv);
            }
        }
    }
    @Transactional
    public String addProduct(Long productId, String productName, int qty, double price) {

        Inventory inv = repo.findByProductId(productId);

        if (inv != null) {
            // ✅ EXISTING PRODUCT
            inv.setTotalQuantity(inv.getTotalQuantity() + qty);
            inv.setAvailableQuantity(inv.getAvailableQuantity() + qty);

            // 🔥 update price also (optional: latest price override)
            inv.setPrice(price);

        } else {
            // ✅ NEW PRODUCT
            inv = new Inventory();
            inv.setProductId(productId);
            inv.setProductName(productName);
            inv.setPrice(price);
            // 🔥 SET PRICE
            inv.setTotalQuantity(qty);
            inv.setAvailableQuantity(qty);
            inv.setReservedQuantity(0);
        }

        repo.save(inv);

        return "Product Added / Updated in Inventory";
    }
    public String deleteProductFromInventory(Long productId) {

        Inventory inv = repo.findByProductId(productId);

        if (inv != null) {
            repo.delete(inv);
            return "Deleted from inventory";
        }

        return "Product not found in inventory";
    }
    public void reduceStock(Long productId, int qty) {

        Inventory inv = repo.findByProductId(productId);

        if (inv != null) {
            inv.setAvailableQuantity(
                Math.max(0, inv.getAvailableQuantity() - qty)
            );
            inv.setTotalQuantity(
                Math.max(0, inv.getTotalQuantity() - qty)
            );

            repo.save(inv);
        }
    }
    public Inventory getByProductId(Long productId) {
        return repo.findByProductId(productId);
    }
    
    
}