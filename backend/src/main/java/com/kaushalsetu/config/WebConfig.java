package com.kaushalsetu.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:src/main/resources/static/images/");

        // Serves KYC documents, profile photos, selfies, and skill certificates.
        // ⚠️ These are uploaded identity documents — in production this folder should sit
        // behind authenticated/signed URLs rather than being world-readable static content.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
