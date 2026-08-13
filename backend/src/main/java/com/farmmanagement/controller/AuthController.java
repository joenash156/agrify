package com.farmmanagement.controller;

import com.farmmanagement.dao.AppUserDao;
import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.dto.AuthResponseDto;
import com.farmmanagement.dto.ChangePasswordDto;
import com.farmmanagement.dto.LoginDto;
import com.farmmanagement.dto.RegisterDto;
import com.farmmanagement.model.AppUser;
import com.farmmanagement.model.UserAccount;
import com.farmmanagement.security.jwt.JwtService;
import com.farmmanagement.security.jwt.RefreshTokenUtil;
import com.farmmanagement.service.RegistrationService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String REFRESH_COOKIE_NAME = "refreshToken";
    private static final String REFRESH_COOKIE_PATH = "/api/auth";

    private final RegistrationService registrationService;
    private final AppUserDao appUserDao;
    private final UserAccountDao userAccountDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenUtil refreshTokenUtil;
    private final long refreshTokenExpirationMs;

    public AuthController(RegistrationService registrationService, AppUserDao appUserDao, UserAccountDao userAccountDao,
                           PasswordEncoder passwordEncoder, JwtService jwtService, RefreshTokenUtil refreshTokenUtil,
                           @Value("${app.jwt.refresh-token-expiration-ms}") long refreshTokenExpirationMs) {
        this.registrationService = registrationService;
        this.appUserDao = appUserDao;
        this.userAccountDao = userAccountDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenUtil = refreshTokenUtil;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(@RequestBody RegisterDto dto) {
        registrationService.register(dto);
        return "Registration successful. Sign in at /api/auth/login.";
    }

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody LoginDto dto, HttpServletResponse response) {
        UserAccount account = userAccountDao.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        if (!"ACTIVE".equals(account.getAccountStatus()) || !passwordEncoder.matches(dto.getPassword(), account.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        return issueTokens(account, response);
    }

    @PostMapping("/refresh")
    public AuthResponseDto refresh(@CookieValue(value = REFRESH_COOKIE_NAME, required = false) String refreshToken,
                                    HttpServletResponse response) {
        if (refreshToken == null) throw new RuntimeException("Missing refresh token");
        UserAccount account = userAccountDao.findByRefreshTokenHash(refreshTokenUtil.hash(refreshToken))
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        if (account.getRefreshTokenExpiresAt() == null || account.getRefreshTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired, please sign in again");
        }
        return issueTokens(account, response);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@CookieValue(value = REFRESH_COOKIE_NAME, required = false) String refreshToken,
                        HttpServletResponse response) {
        if (refreshToken != null) {
            userAccountDao.findByRefreshTokenHash(refreshTokenUtil.hash(refreshToken))
                    .ifPresent(account -> userAccountDao.clearRefreshToken(account.getAccountId()));
        }
        response.addHeader(HttpHeaders.SET_COOKIE, buildRefreshCookie("", 0).toString());
    }

    @PutMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@RequestBody ChangePasswordDto dto, Authentication authentication) {
        UserAccount account = userAccountDao.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!passwordEncoder.matches(dto.getCurrentPassword(), account.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }
        userAccountDao.updatePasswordHash(account.getAccountId(), passwordEncoder.encode(dto.getNewPassword()));
    }

    private AuthResponseDto issueTokens(UserAccount account, HttpServletResponse response) {
        AppUser user = appUserDao.findById(account.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateAccessToken(account.getAccountId(), account.getUsername(), account.getRole());

        String refreshToken = refreshTokenUtil.generateToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(refreshTokenExpirationMs / 1000);
        userAccountDao.updateRefreshToken(account.getAccountId(), refreshTokenUtil.hash(refreshToken), expiresAt);
        response.addHeader(HttpHeaders.SET_COOKIE, buildRefreshCookie(refreshToken, refreshTokenExpirationMs / 1000).toString());

        return new AuthResponseDto(
                accessToken, "Bearer", jwtService.getAccessTokenExpirationSeconds(),
                user.getUserId(), account.getUsername(), user.getFirstName(), user.getLastName(), user.getEmail(), account.getRole()
        );
    }

    private ResponseCookie buildRefreshCookie(String value, long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, value)
                .httpOnly(true)
                .secure(false) // dev over plain HTTP; set true once served over HTTPS
                .sameSite("Lax")
                .path(REFRESH_COOKIE_PATH)
                .maxAge(maxAgeSeconds)
                .build();
    }
}
