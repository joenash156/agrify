package com.farmmanagement.dto;

import java.util.UUID;

public class AuthResponseDto {
    private String accessToken;
    private String tokenType;
    private long expiresIn;
    private UUID userId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String accountStatus;

    public AuthResponseDto() {}

    public AuthResponseDto(String accessToken, String tokenType, long expiresIn, UUID userId, String username,
                            String firstName, String lastName, String email, String role, String accountStatus) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.accountStatus = accountStatus;
    }

    public String getAccessToken(){return accessToken;} public void setAccessToken(String v){accessToken=v;}
    public String getTokenType(){return tokenType;} public void setTokenType(String v){tokenType=v;}
    public long getExpiresIn(){return expiresIn;} public void setExpiresIn(long v){expiresIn=v;}
    public UUID getUserId(){return userId;} public void setUserId(UUID v){userId=v;}
    public String getUsername(){return username;} public void setUsername(String v){username=v;}
    public String getFirstName(){return firstName;} public void setFirstName(String v){firstName=v;}
    public String getLastName(){return lastName;} public void setLastName(String v){lastName=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getRole(){return role;} public void setRole(String v){role=v;}
    public String getAccountStatus(){return accountStatus;} public void setAccountStatus(String v){accountStatus=v;}
}
