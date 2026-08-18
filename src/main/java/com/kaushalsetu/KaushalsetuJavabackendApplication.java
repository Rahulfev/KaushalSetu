package com.kaushalsetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KaushalsetuJavabackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(KaushalsetuJavabackendApplication.class, args);
	}

}
