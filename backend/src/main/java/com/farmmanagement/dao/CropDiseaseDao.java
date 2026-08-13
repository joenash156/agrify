package com.farmmanagement.dao;

import java.util.UUID;

import com.farmmanagement.model.CropDisease;
import java.util.List;

public interface CropDiseaseDao {
    List<CropDisease> findAll();
    List<CropDisease> findByCrop(UUID cropId);
    void save(CropDisease item);
    boolean delete(UUID cropDiseaseId);
}
