package com.farmmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChangePasswordDto {
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters")
    private String newPassword;

    public ChangePasswordDto() {}
    public String getCurrentPassword(){return currentPassword;} public void setCurrentPassword(String v){currentPassword=v;}
    public String getNewPassword(){return newPassword;} public void setNewPassword(String v){newPassword=v;}
}
