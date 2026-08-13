package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.AttendanceDao;
import com.farmmanagement.model.Attendance;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcAttendanceDao implements AttendanceDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcAttendanceDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Attendance> findAll() {
        return jdbcTemplate.query("SELECT * FROM attendance", BeanPropertyRowMapper.newInstance(Attendance.class));
    }

    public Optional<Attendance> findById(UUID id) {
        List<Attendance> result = jdbcTemplate.query("SELECT * FROM attendance WHERE attendance_id = ?", BeanPropertyRowMapper.newInstance(Attendance.class), id);
        return result.stream().findFirst();
    }

    public Attendance save(Attendance item) {
        jdbcTemplate.update("INSERT INTO attendance (attendance_id, employment_id, attendance_date, check_in, check_out, attendance_status) VALUES (?, ?, ?, ?, ?, ?)", item.getAttendanceId(), item.getEmploymentId(), item.getAttendanceDate(), item.getCheckIn(), item.getCheckOut(), item.getAttendanceStatus());
        return item;
    }

    public boolean update(UUID id, Attendance item) {
        return jdbcTemplate.update("UPDATE attendance SET employment_id = ?, attendance_date = ?, check_in = ?, check_out = ?, attendance_status = ? WHERE attendance_id = ?", item.getEmploymentId(), item.getAttendanceDate(), item.getCheckIn(), item.getCheckOut(), item.getAttendanceStatus(), id) > 0;
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM attendance WHERE attendance_id = ?", id) > 0;
    }
}
