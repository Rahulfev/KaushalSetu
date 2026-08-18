package com.kaushalsetu.modules.auth.controller;

import com.kaushalsetu.common.util.CountryCodeData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meta")
@CrossOrigin(origins = "http://localhost:5173")
public class CountryCodeController {

    @GetMapping("/country-codes")
    public ResponseEntity<List<CountryCodeData.CountryCode>> getCountryCodes() {
        return ResponseEntity.ok(CountryCodeData.ALL);
    }
}
