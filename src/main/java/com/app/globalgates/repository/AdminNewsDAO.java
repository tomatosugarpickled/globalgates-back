package com.app.globalgates.repository;

import com.app.globalgates.dto.NewsDTO;
import com.app.globalgates.mapper.AdminNewsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminNewsDAO {
    private final AdminNewsMapper adminNewsMapper;

    public List<NewsDTO> findAll() {
        return adminNewsMapper.selectAdminNews();
    }

    public void save(NewsDTO newsDTO) {
        adminNewsMapper.insertAdminNews(newsDTO);
    }
}
