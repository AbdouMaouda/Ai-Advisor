package com.springai.aibuisnessadvisor.Service.AI;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

@Service
public class AIService {
    private final ChatClient chatClient;

    public AIService(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }


    public String generateCompletion(String prompt){
        return chatClient.
                prompt(prompt)
                .call()
                .content();

    }
}
