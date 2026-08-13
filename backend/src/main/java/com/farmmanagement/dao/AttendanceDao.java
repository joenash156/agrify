package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.Attendance;
import java.util.List;
import java.util.Optional;

public interface AttendanceDao {
    List<Attendance> findAll();
    Optional<Attendance> findById(UUID id);
    Attendance save(Attendance item);
    boolean update(UUID id, Attendance item);
    boolean delete(UUID id);
}
