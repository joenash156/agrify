package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.model.Notification;
import com.farmmanagement.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    private final NotificationService service;

    public NotificationController(NotificationService service) { this.service = service; }

    @GetMapping
    public List<Notification> findMine(Authentication authentication) { return service.findMine(authentication.getName()); }

    @PatchMapping("/{id}/read")
    public void markRead(@PathVariable UUID id) { service.markRead(id); }

    @PatchMapping("/{id}/unread")
    public void markUnread(@PathVariable UUID id) { service.markUnread(id); }

    @PatchMapping("/read-all")
    public void markAllRead(Authentication authentication) { service.markAllRead(authentication.getName()); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
