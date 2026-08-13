package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.NotificationDao;
import com.farmmanagement.model.Notification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class JdbcNotificationDao implements NotificationDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcNotificationDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Notification> findByUser(UUID userId) {
        return jdbcTemplate.query("SELECT * FROM notification WHERE user_id = ? ORDER BY created_at DESC",
                BeanPropertyRowMapper.newInstance(Notification.class), userId);
    }

    public void markRead(UUID id, boolean read) {
        jdbcTemplate.update("UPDATE notification SET is_read = ? WHERE notification_id = ?", read, id);
    }

    public void markAllRead(UUID userId) {
        jdbcTemplate.update("UPDATE notification SET is_read = 1 WHERE user_id = ?", userId);
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM notification WHERE notification_id = ?", id) > 0;
    }
}
