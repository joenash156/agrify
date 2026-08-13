package com.farmmanagement.model;

import java.util.UUID;

import java.time.LocalDateTime;

public class Notification {
    private UUID notificationId;
    private UUID userId;
    private String category;
    private String title;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;

    public Notification() {}

    public UUID getNotificationId() { return notificationId; }
    public void setNotificationId(UUID notificationId) { this.notificationId = notificationId; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    // Named getIsRead/setIsRead (not isRead/setRead) so BeanPropertyRowMapper's
    // underscore-stripped column matching lines up with the `is_read` column.
    public boolean getIsRead() { return isRead; }
    public void setIsRead(boolean isRead) { this.isRead = isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
