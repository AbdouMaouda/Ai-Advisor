package com.springai.aibuisnessadvisor.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ConnectionTestController {

    @GetMapping("/test")
    public String test() {
        return "connected";
    }
}