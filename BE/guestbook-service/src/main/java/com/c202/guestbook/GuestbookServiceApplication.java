package com.c202.guestbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.c202"})
public class GuestbookServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(GuestbookServiceApplication.class, args);
	}

}
