package com.app.globalgates.service;

import com.app.globalgates.dto.AdvertisementDTO;
import com.app.globalgates.repository.AdvertisementDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdvertisementService {
    private final AdvertisementDAO advertisementDAO;

    // 광고 등록
    public void save(AdvertisementDTO advertisementDTO) {
        advertisementDAO.save(advertisementDTO);
    }

    // 광고 전체 조회
    public List<AdvertisementDTO> getAllAds() {
        return advertisementDAO.findAll();
    }

    // 광고 검색 조회

    // 광고 상세 조회
}
