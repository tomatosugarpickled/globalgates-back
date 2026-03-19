package com.app.globalgates.repository;

import com.app.globalgates.dto.AdvertisementDTO;
import com.app.globalgates.mapper.AdvertisementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdvertisementDAO {
    private final AdvertisementMapper advertisementMapper;

    // 광고 등록
    public void save(AdvertisementDTO advertisementDTO) {
        advertisementMapper.insert(advertisementDTO);
    }

    // 광고 전체 조회
    public List<AdvertisementDTO> findAll() {
        return advertisementMapper.selectAll();
    }

    // 광고 검색 조회

    // 광고 상세 조회
}
