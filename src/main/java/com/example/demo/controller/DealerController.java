package com.example.demo.controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Dealer;
import com.example.demo.service.DealerService;



@RestController
@RequestMapping("/api/dealer")
@CrossOrigin(origins = "http://localhost:3000")
public class DealerController {

    @Autowired
    private DealerService service;

    @PostMapping("/signup")
    public Dealer signup(@RequestBody Dealer dealer) {   // ✅ now works
        return service.signup(dealer);
    }

    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Dealer dealer) {
        String token = service.login(dealer.getEmail(), dealer.getPassword());
        
        // ✅ Also fetch dealer to return dealerId
        Dealer d = service.findByEmail(dealer.getEmail());
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "dealerId", d.getDealerId(),
            "message", "Login successful"
        ));
    }
    @PutMapping("/update-step/{dealerId}")
    public ResponseEntity<?> updateStep(
            @PathVariable Long dealerId,
            @RequestBody Map<String, Object> data) {

        Dealer updated =  service.updateOnboardingStep(dealerId, data); 
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/{dealerId}")
    public Dealer getDealer(@PathVariable Long dealerId) {
        return  service.getDealerById(dealerId);
    }
    
}