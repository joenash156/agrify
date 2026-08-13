package com.farmmanagement.service;

import java.util.UUID;

import com.farmmanagement.dao.CropDiseaseDao;
import com.farmmanagement.dto.CropDiseaseDto;
import com.farmmanagement.model.CropDisease;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CropDiseaseService {
    private final CropDiseaseDao dao;
    public CropDiseaseService(CropDiseaseDao dao){this.dao=dao;}
    public List<CropDisease> findAll(){return dao.findAll();}
    public List<CropDisease> findByCrop(UUID cropId){return dao.findByCrop(cropId);}
    public CropDisease create(CropDiseaseDto dto){
        CropDisease x=new CropDisease();
        x.setCropDiseaseId(UUID.randomUUID());
        x.setCropId(dto.getCropId());
        x.setDiseaseId(dto.getDiseaseId());
        x.setDetectedDate(dto.getDetectedDate());
        x.setSeverity(dto.getSeverity());
        x.setTreatment(dto.getTreatment());
        dao.save(x);
        return x;
    }
    public void delete(UUID cropDiseaseId){ if (!dao.delete(cropDiseaseId)) throw new RuntimeException("Crop disease record not found"); }
}
