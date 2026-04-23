package com.example.demo.controller;

import com.example.demo.dto.InventoryRequest;

import com.example.demo.service.InventoryService;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Inventory;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @PostMapping("/check")
    public String checkStock(@RequestBody InventoryRequest req) {
        return service.checkStock(req.getProductId(), req.getQuantity());
    }

    @PostMapping("/reserve")
    public String reserve(@RequestBody InventoryRequest req) {
        return service.reserveStock(req.getProductId(), req.getQuantity());
    }

    @PostMapping("/confirm")
    public String confirm(@RequestBody InventoryRequest req) {
        return service.confirmOrder(req.getProductId(), req.getQuantity());
    }

    @PostMapping("/release")
    public String release(@RequestBody InventoryRequest req) {
        return service.releaseStock(req.getProductId(), req.getQuantity());
    }
    @PostMapping("/addProduct")
    public String addProduct(@RequestBody InventoryRequest req) {
        return service.addProduct(
                req.getProductId(),
                req.getProductName(),
                req.getQuantity(),
                
                req.getPrice()
        );
    }
    // ✅ CHECK STOCK (for Order Service)
    @GetMapping("/api/inventory/check")
    public boolean checkStockForOrder(@RequestParam Long productId,
                                     @RequestParam int quantity) {

        return service.checkStock(productId, quantity)
                .equals("IN STOCK");
    }

    // ✅ RESERVE STOCK
    @PostMapping("/api/inventory/reserve")
    public String reserveStockForOrder(@RequestParam Long productId,
                                      @RequestParam int quantity) {

        return service.reserveStock(productId, quantity);
    }

    // ✅ CONFIRM ORDER (after payment success)
    @PostMapping("/api/inventory/confirm")
    public String confirmOrderForOrder(@RequestParam Long productId,
                                      @RequestParam int quantity) {

        return service.confirmOrder(productId, quantity);
    }

    // ✅ RELEASE STOCK (if payment fails)
    @PostMapping("/api/inventory/release")
    public String releaseStockForOrder(@RequestParam Long productId,
                                      @RequestParam int quantity) {

        return service.releaseStock(productId, quantity);
    }

    // ✅ GET PRICE (IMPORTANT - used by Order Service)
    @GetMapping("/api/inventory/price/{productId}")
    public double getPrice(@PathVariable Long productId) {

        Inventory inv = service.getByProductId(productId);
        return inv.getPrice();
    }
    
    
}