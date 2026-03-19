package com.app.globalgates.mapper;

import com.app.globalgates.dto.AdvertisementDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdvertisementMapper {
    // 광고 등록
    public void insert(AdvertisementDTO advertisementDTO);

    // 광고 전체 조회
    public List<AdvertisementDTO> selectAll();

    // 광고 검색 조회


    // 광고 상세 조회
}
