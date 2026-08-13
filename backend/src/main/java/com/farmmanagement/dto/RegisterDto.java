package com.farmmanagement.dto;

public class RegisterDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String username;
    private String password;
    public RegisterDto() {}
    public String getFirstName(){return firstName;} public void setFirstName(String v){firstName=v;}
    public String getLastName(){return lastName;} public void setLastName(String v){lastName=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getPhoneNumber(){return phoneNumber;} public void setPhoneNumber(String v){phoneNumber=v;}
    public String getUsername(){return username;} public void setUsername(String v){username=v;}
    public String getPassword(){return password;} public void setPassword(String v){password=v;}
}
