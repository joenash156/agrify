package com.farmmanagement.controller;

import java.util.UUID;

import com.farmmanagement.dto.AccountResponseDto;
import com.farmmanagement.dto.UserAccountDto;
import com.farmmanagement.model.UserAccount;
import com.farmmanagement.service.UserAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
public class UserAccountController {
    private final UserAccountService service;
    public UserAccountController(UserAccountService service){this.service=service;}
    private AccountResponseDto response(UserAccount a){return new AccountResponseDto(a.getAccountId(),a.getUserId(),a.getUsername(),a.getAccountStatus(),a.getRole());}
    @GetMapping public List<AccountResponseDto> findAll(){return service.findAll().stream().map(this::response).collect(Collectors.toList());}
    @GetMapping("/{id}") public AccountResponseDto findById(@PathVariable UUID id){return response(service.findById(id));}
    @PutMapping("/{id}") public String update(@PathVariable UUID id,@RequestBody UserAccountDto dto){service.update(id,dto);return "Account updated";}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id){service.delete(id);}
}
