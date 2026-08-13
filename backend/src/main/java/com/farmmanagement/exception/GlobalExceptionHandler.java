package com.farmmanagement.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String,String> handleAccessDenied(AccessDeniedException ex){return Map.of("error","You do not have permission to perform this action");}

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> handleValidation(MethodArgumentNotValidException ex){
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getDefaultMessage())
                .orElse("Please check your input and try again");
        return Map.of("error", message);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String,String> handleDataIntegrity(DataIntegrityViolationException ex){
        String cause = ex.getMostSpecificCause().getMessage();
        String message = "One of the provided values is not valid. Please check your input and try again.";
        if (cause != null) {
            String lower = cause.toLowerCase();
            if (lower.contains("uq_app_user_email") || lower.contains("app_user.email")) {
                message = "An account with this email already exists.";
            } else if (lower.contains("uq_user_account_username") || lower.contains("user_account.username")) {
                message = "This username is already taken.";
            } else if (lower.contains("uq_customer_email") || lower.contains("customer.email")) {
                message = "A customer with this email already exists.";
            } else if (lower.contains("uq_fertilizer_name") || lower.contains("fertilizer.fertilizer_name")) {
                message = "A fertilizer with this name already exists.";
            } else if (lower.contains("uq_disease_name") || lower.contains("disease_catalog.disease_name")) {
                message = "A disease with this name already exists.";
            } else if (lower.contains("duplicate entry") || lower.contains("unique")) {
                message = "This record already exists.";
            } else if (lower.contains("chk_")) {
                message = "One of the provided values is not valid. Please check your input and try again.";
            } else if (lower.contains("foreign key")) {
                message = "This action references a record that no longer exists.";
            }
        }
        return Map.of("error", message);
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String,String> handleRuntime(RuntimeException ex){return Map.of("error",ex.getMessage());}
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> handleException(Exception ex){return Map.of("error","Something went wrong. Please try again.");}
}
