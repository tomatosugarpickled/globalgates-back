package com.app.globalgates.mapper;

import com.app.globalgates.dto.NewsDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminNewsMapper {
    List<NewsDTO> selectAdminNews();

    int insertAdminNews(NewsDTO newsDTO);
}
