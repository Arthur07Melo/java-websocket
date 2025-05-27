package com.demo.websocket.http;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/httpmessage")
public class MessageController {

    private final ArrayList<String> messages = new ArrayList<>();

    @PostMapping
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody Map<String, String> body) {
        var message = body.get("message");
        if ( message == null || message.isEmpty()) {return ResponseEntity.status(400).build();}

        messages.add(message);

        var response = new HashMap<String, String>();
        response.put("message", message);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<String>> getMessages() {
        return ResponseEntity.ok(messages);
    }
}
