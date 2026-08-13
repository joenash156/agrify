package com.farmmanagement.dao.impl;

import java.util.UUID;

import com.farmmanagement.dao.SaleItemDao;
import com.farmmanagement.model.SaleItem;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public class JdbcSaleItemDao implements SaleItemDao {
    private final JdbcTemplate jdbcTemplate;
    public JdbcSaleItemDao(JdbcTemplate jdbcTemplate){this.jdbcTemplate=jdbcTemplate;}
    public List<SaleItem> findAll(){return jdbcTemplate.query("SELECT * FROM sale_item",BeanPropertyRowMapper.newInstance(SaleItem.class));}
    public List<SaleItem> findBySale(UUID saleId){return jdbcTemplate.query("SELECT * FROM sale_item WHERE sale_id=?",BeanPropertyRowMapper.newInstance(SaleItem.class),saleId);}
    public void recordSaleItem(UUID saleId,UUID inventoryId,BigDecimal quantity,BigDecimal unitPrice){
        jdbcTemplate.update("CALL sp_record_sale_item(?,?,?,?)",saleId,inventoryId,quantity,unitPrice);
    }
    public void delete(UUID id){jdbcTemplate.update("DELETE FROM sale_item WHERE sale_item_id=?",id);}
}
