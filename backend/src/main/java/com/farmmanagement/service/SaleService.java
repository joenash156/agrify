package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.EmploymentDao;
import com.farmmanagement.dao.SaleDao;
import com.farmmanagement.dao.UserAccountDao;
import com.farmmanagement.dto.SaleDto;
import com.farmmanagement.dto.SaleSummaryDto;
import com.farmmanagement.model.Employment;
import com.farmmanagement.model.Sale;
import com.farmmanagement.model.UserAccount;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {
    private final SaleDao dao;
    private final UserAccountDao userAccountDao;
    private final EmploymentDao employmentDao;

    public SaleService(SaleDao dao, UserAccountDao userAccountDao, EmploymentDao employmentDao) {
        this.dao = dao;
        this.userAccountDao = userAccountDao;
        this.employmentDao = employmentDao;
    }

    public List<Sale> findAll() { return dao.findAll(); }

    /** ADMIN/FARM_MANAGER see every sale; SALES_PERSON sees only sales made under their own employment. */
    public List<SaleSummaryDto> findAllWithDetails(String username) {
        UserAccount account = requireAccount(username);
        if ("ADMIN".equals(account.getRole()) || "FARM_MANAGER".equals(account.getRole())) {
            return dao.findAllWithDetails(null);
        }
        Employment employment = employmentDao.findActiveByUserId(account.getUserId())
                .orElseThrow(() -> new RuntimeException("No active employment found for this account"));
        return dao.findAllWithDetails(employment.getEmploymentId());
    }

    public Sale findById(UUID id) { return dao.findById(id).orElseThrow(() -> new RuntimeException("Sale not found")); }

    public Sale create(SaleDto dto) {
        Sale item = new Sale();
        item.setSaleId(java.util.UUID.randomUUID());
        item.setCustomerId(dto.getCustomerId());
        item.setEmploymentId(dto.getEmploymentId());
        item.setTotal(dto.getTotal());
        item.setSaleStatus(dto.getSaleStatus());
        return dao.save(item);
    }

    public Sale update(UUID id, SaleDto dto) {
        Sale item = new Sale();
        item.setSaleId(id);
        item.setCustomerId(dto.getCustomerId());
        item.setEmploymentId(dto.getEmploymentId());
        item.setTotal(dto.getTotal());
        item.setSaleStatus(dto.getSaleStatus());
        if (!dao.update(id, item)) throw new RuntimeException("Sale not found");
        return findById(id);
    }

    public void delete(UUID id) { if (!dao.delete(id)) throw new RuntimeException("Sale not found"); }

    /** Voids (soft-deletes) a sale — admins/managers may void any sale, a sales person only their own. */
    public void voidSale(UUID saleId, String reason, String username) {
        if (reason == null || reason.isBlank()) {
            throw new RuntimeException("A reason is required to void a sale");
        }
        UserAccount account = requireAccount(username);
        Sale sale = findById(saleId);
        if (sale.isVoided()) {
            throw new RuntimeException("This sale has already been voided");
        }
        if (!"ADMIN".equals(account.getRole()) && !"FARM_MANAGER".equals(account.getRole())) {
            Employment employment = employmentDao.findActiveByUserId(account.getUserId())
                    .orElseThrow(() -> new RuntimeException("No active employment found for this account"));
            if (!employment.getEmploymentId().equals(sale.getEmploymentId())) {
                throw new AccessDeniedException("You can only void sales you made");
            }
        }
        dao.voidSale(saleId, reason.trim(), account.getUserId(), LocalDateTime.now());
    }

    private UserAccount requireAccount(String username) {
        return userAccountDao.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }
}
