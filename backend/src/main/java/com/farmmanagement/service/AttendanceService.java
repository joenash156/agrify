package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.AppUserDao;
import com.farmmanagement.dao.AttendanceDao;
import com.farmmanagement.dao.EmploymentDao;
import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.dto.AttendanceDto;
import com.farmmanagement.dto.ClockInResponseDto;
import com.farmmanagement.model.AppUser;
import com.farmmanagement.model.Attendance;
import com.farmmanagement.model.Employment;
import com.farmmanagement.model.UserAccount;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceService {
    private final AttendanceDao dao;
    private final UserAccountDao userAccountDao;
    private final EmploymentDao employmentDao;
    private final AppUserDao appUserDao;

    public AttendanceService(AttendanceDao dao, UserAccountDao userAccountDao, EmploymentDao employmentDao, AppUserDao appUserDao) {
        this.dao = dao;
        this.userAccountDao = userAccountDao;
        this.employmentDao = employmentDao;
        this.appUserDao = appUserDao;
    }

    public List<Attendance> findAll() { return dao.findAll(); }

    /** ADMIN/FARM_MANAGER see every record; everyone else sees only their own. */
    public List<Attendance> findAllForUser(String username) {
        UserAccount account = userAccountDao.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if ("ADMIN".equals(account.getRole()) || "FARM_MANAGER".equals(account.getRole())) {
            return dao.findAll();
        }
        Employment employment = employmentDao.findActiveByUserId(account.getUserId()).orElse(null);
        if (employment == null) return List.of();
        return dao.findAll().stream()
                .filter(a -> a.getEmploymentId().equals(employment.getEmploymentId()))
                .toList();
    }

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

    /** Self-service clock-in: the typed username must match the authenticated caller's own —
     * this is a re-type-to-confirm step, not a way to record attendance for someone else. */
    public ClockInResponseDto clockIn(String username, String callerUsername) {
        if (username == null || !username.trim().equalsIgnoreCase(callerUsername)) {
            throw new RuntimeException("That username doesn't match your account. Please type your own username.");
        }
        UserAccount account = userAccountDao.findByUsername(username.trim())
                .orElseThrow(() -> new RuntimeException("No account found for that username"));
        AppUser user = appUserDao.findById(account.getUserId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        Employment employment = employmentDao.findActiveByUserId(account.getUserId())
                .orElseThrow(() -> new RuntimeException("This user has no active employment record"));

        LocalDateTime now = LocalDateTime.now();
        Attendance item = new Attendance();
        item.setAttendanceId(UUID.randomUUID());
        item.setEmploymentId(employment.getEmploymentId());
        item.setAttendanceDate(now.toLocalDate());
        item.setCheckIn(now.toLocalTime().withNano(0));
        item.setAttendanceStatus("PRESENT");
        dao.save(item);

        return new ClockInResponseDto(user.getFirstName() + " " + user.getLastName(), item.getAttendanceDate(), item.getCheckIn());
    }

    /** Self-service check-out: the caller may only close out their own attendance record. */
    public Attendance checkOut(UUID attendanceId, String callerUsername) {
        UserAccount account = userAccountDao.findByUsername(callerUsername)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        Attendance attendance = findById(attendanceId);
        Employment employment = employmentDao.findActiveByUserId(account.getUserId())
                .orElseThrow(() -> new RuntimeException("This user has no active employment record"));

        if (!attendance.getEmploymentId().equals(employment.getEmploymentId())) {
            throw new AccessDeniedException("You can only check out your own attendance record");
        }
        if (attendance.getCheckOut() != null) {
            throw new RuntimeException("This attendance record has already been checked out");
        }

        attendance.setCheckOut(LocalTime.now().withNano(0));
        dao.update(attendanceId, attendance);
        return attendance;
    }
}
