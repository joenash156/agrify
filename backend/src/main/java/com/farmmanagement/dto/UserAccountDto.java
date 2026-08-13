package com.farmmanagement.dto;

public class UserAccountDto {
    private String username;
    private String accountStatus;
    private String role;
    public UserAccountDto() {}
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
