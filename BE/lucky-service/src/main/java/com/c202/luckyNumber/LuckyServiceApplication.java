package com.c202.luckyNumber;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class LuckyServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LuckyServiceApplication.class, args);
	}

}
