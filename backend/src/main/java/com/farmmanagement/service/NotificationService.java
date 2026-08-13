package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.NotificationDao;
import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.model.Notification;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationDao dao;
    private final UserAccountDao userAccountDao;

    public NotificationService(NotificationDao dao, UserAccountDao userAccountDao) {
        this.dao = dao;
        this.userAccountDao = userAccountDao;
    }

    private UUID resolveUserId(String username) {
        return userAccountDao.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"))
                .getUserId();
    }

    public List<Notification> findMine(String username) { return dao.findByUser(resolveUserId(username)); }
    public void markRead(UUID id) { dao.markRead(id, true); }
    public void markUnread(UUID id) { dao.markRead(id, false); }
    public void markAllRead(String username) { dao.markAllRead(resolveUserId(username)); }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Notification not found"); }
}
