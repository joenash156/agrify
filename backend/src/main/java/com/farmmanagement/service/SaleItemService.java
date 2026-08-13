package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.SaleItemDao;
import com.farmmanagement.dto.SaleItemDto;
import com.farmmanagement.model.SaleItem;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SaleItemService {
    private final SaleItemDao dao;
    public SaleItemService(SaleItemDao dao){this.dao=dao;}
    public List<SaleItem> findAll(){return dao.findAll();}
    public List<SaleItem> findBySale(UUID saleId){return dao.findBySale(saleId);}
    public void create(SaleItemDto dto){dao.recordSaleItem(dto.getSaleId(),dto.getInventoryId(),dto.getQuantity(),dto.getUnitPrice());}
    public void delete(UUID id){dao.delete(id);}
}
