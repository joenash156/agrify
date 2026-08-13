package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.AttendanceDao;
import com.farmmanagement.dto.AttendanceDto;
import com.farmmanagement.model.Attendance;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AttendanceService {
    private final AttendanceDao dao;
    public AttendanceService(AttendanceDao dao) { this.dao = dao; }
    public List<Attendance> findAll() { return dao.findAll(); }
    public Attendance findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Attendance not found")); }
    public Attendance create(AttendanceDto dto) {
        Attendance item = new Attendance();
        item.setAttendanceId(java.util.UUID.randomUUID());
        item.setEmploymentId(dto.getEmploymentId());
        item.setAttendanceDate(dto.getAttendanceDate());
        item.setCheckIn(dto.getCheckIn());
        item.setCheckOut(dto.getCheckOut());
        item.setAttendanceStatus(dto.getAttendanceStatus());
        return dao.save(item);
    }
    public Attendance update(UUID id, AttendanceDto dto) {
        Attendance item = new Attendance();
        item.setAttendanceId(id);
        item.setEmploymentId(dto.getEmploymentId());
        item.setAttendanceDate(dto.getAttendanceDate());
        item.setCheckIn(dto.getCheckIn());
        item.setCheckOut(dto.getCheckOut());
        item.setAttendanceStatus(dto.getAttendanceStatus());
        if (!dao.update(id, item)) throw new RuntimeException("Attendance not found");
        return findById(id);
    }
    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Attendance not found"); }
}
