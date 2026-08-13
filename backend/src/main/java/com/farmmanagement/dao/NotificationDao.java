package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Notification;
import java.util.List;

public interface NotificationDao {
    List<Notification> findByUser(UUID userId);
    void markRead(UUID id, boolean read);
    void markAllRead(UUID userId);
    boolean delete(UUID id);
}
