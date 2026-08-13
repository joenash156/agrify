package com.farmmanagement.dto;

public class ChangePasswordDto {
    private String currentPassword;
    private String newPassword;
    public ChangePasswordDto() {}
    public String getCurrentPassword(){return currentPassword;} public void setCurrentPassword(String v){currentPassword=v;}
    public String getNewPassword(){return newPassword;} public void setNewPassword(String v){newPassword=v;}
}
