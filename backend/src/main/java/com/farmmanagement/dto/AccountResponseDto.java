package com.farmmanagement.dto;

import java.util.UUID;

public class AccountResponseDto {
    private UUID accountId;
    private UUID userId;
    private String username;
    private String accountStatus;
    private String role;
    public AccountResponseDto() {}
    public AccountResponseDto(UUID accountId,UUID userId,String username,String accountStatus,String role){this.accountId=accountId;this.userId=userId;this.username=username;this.accountStatus=accountStatus;this.role=role;}
    public UUID getAccountId(){return accountId;} public void setAccountId(UUID v){accountId=v;}
    public UUID getUserId(){return userId;} public void setUserId(UUID v){userId=v;}
    public String getUsername(){return username;} public void setUsername(String v){username=v;}
    public String getAccountStatus(){return accountStatus;} public void setAccountStatus(String v){accountStatus=v;}
    public String getRole(){return role;} public void setRole(String v){role=v;}
}
