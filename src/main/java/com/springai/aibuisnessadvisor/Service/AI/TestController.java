//package com.springai.aibuisnessadvisor.Service.AI;
//
//import org.springframework.ai.chat.model.ChatModel;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class TestController {
//
//    private final ChatModel chatModel;
//
//    public TestController(ChatModel chatModel) {
//        this.chatModel = chatModel;
//    }
//
//    @GetMapping("/")
//    public String prompt(@RequestParam String message) {
//return chatModel.call(message);    }
//}
