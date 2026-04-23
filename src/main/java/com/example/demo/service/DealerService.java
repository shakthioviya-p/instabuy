package com.example.demo.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Dealer;
import com.example.demo.repository.DealerRepository;
import com.example.demo.security.JwtUtil;

@Service
public class DealerService {

    @Autowired
    private DealerRepository repo;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(DealerService.class);

    public Dealer signup(Dealer d) {
        d.setPassword(passwordEncoder.encode(d.getPassword())); // BCrypt encode
        logger.info("New dealer signed up: {}", d.getEmail());
       
        return repo.save(d);
    }
    public Dealer findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public String login(String email, String password) {
        Dealer dealer = repo.findByEmail(email);

        if (dealer == null) {
            throw new RuntimeException("Invalid login");
        }

        if (!passwordEncoder.matches(password, dealer.getPassword())) {
            throw new RuntimeException("Invalid login");
        }

        String token = jwtUtil.generateToken(dealer.getEmail(), dealer.getDealerId());
        logger.info("Dealer logged in: {}", email);
        return token;
    }
    public Dealer updateOnboardingStep(Long dealerId, Map<String, Object> data) {

        Dealer dealer = repo.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        // ✅ SAFE STEP
        Object stepObj = data.get("step");
        if (stepObj == null) {
            throw new RuntimeException("Step is missing in request");
        }

        int step;

        if (stepObj instanceof Number) {
            step = ((Number) stepObj).intValue();
        } else {
            step = Integer.parseInt(stepObj.toString());   // ✅ handles string also
        }
        System.out.println("STEP RECEIVED: " + step);
        System.out.println("DATA: " + data);
        switch (step) {

        case 1:

            if (data.get("pan") != null)
                dealer.setGstNumber(data.get("pan").toString().trim());

            if (data.get("name") != null)
                dealer.setName(data.get("name").toString().trim());

            if (data.get("phone") != null)
                dealer.setPhone(data.get("phone").toString().trim());

            // generate EID once
            if (dealer.getEid() == null) {
                dealer.setEid("EID" + System.currentTimeMillis());
            }

            break;

        case 2:

            if (data.get("room") != null && data.get("street") != null) {
                dealer.setAddress(
                    data.get("room") + ", " + data.get("street")
                );
            }

            if (data.get("city") != null)
                dealer.setCity(String.valueOf(data.get("city")));

            if (data.get("state") != null)
                dealer.setState(String.valueOf(data.get("state")));

            if (data.get("pincode") != null)
                dealer.setPincode(String.valueOf(data.get("pincode")));

            break;

            case 3:
                if (data.get("accountNumber") != null)
                    dealer.setAccountNumber(String.valueOf(data.get("accountNumber")));

                if (data.get("ifscCode") != null)
                    dealer.setIfscCode(String.valueOf(data.get("ifscCode")));
                break;

            case 4:
                if (data.get("storeName") != null)
                    dealer.setStoreName(String.valueOf(data.get("storeName")));

                if (data.get("fullName") != null)
                    dealer.setFullName(String.valueOf(data.get("fullName")));
                break;

            default:
                throw new RuntimeException("Invalid step value");
        }

        dealer.setOnboardingStep(step + 1);

        return repo.save(dealer);
    }
    public Dealer getDealerById(Long dealerId) {
        return repo.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
    }
}
