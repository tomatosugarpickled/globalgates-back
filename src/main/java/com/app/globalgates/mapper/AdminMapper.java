package com.app.globalgates.mapper;

import com.app.globalgates.common.pagination.Criteria;
import com.app.globalgates.dto.AdminMemberListDTO;
import com.app.globalgates.dto.AdminPostListDTO;
import com.app.globalgates.dto.AdminReportListDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminMapper {
    int selectAdminMemberTotal(@Param("keyword") String keyword,
                               @Param("memberRole") String memberRole,
                               @Param("memberStatus") String memberStatus);

    List<AdminMemberListDTO> selectAdminMembers(@Param("criteria") Criteria criteria,
                                                @Param("keyword") String keyword,
                                                @Param("memberRole") String memberRole,
                                                @Param("memberStatus") String memberStatus);

    int selectAdminPostTotal(@Param("keyword") String keyword,
                             @Param("postType") String postType,
                             @Param("categoryName") String categoryName,
                             @Param("postStatus") String postStatus);

    List<AdminPostListDTO> selectAdminPosts(@Param("criteria") Criteria criteria,
                                            @Param("keyword") String keyword,
                                            @Param("postType") String postType,
                                            @Param("categoryName") String categoryName,
                                            @Param("postStatus") String postStatus);

    int selectAdminReportTotal(@Param("keyword") String keyword,
                               @Param("targetType") String targetType,
                               @Param("reportStatus") String reportStatus);

    List<AdminReportListDTO> selectAdminReports(@Param("criteria") Criteria criteria,
                                                @Param("keyword") String keyword,
                                                @Param("targetType") String targetType,
                                                @Param("reportStatus") String reportStatus);

    int updateMemberStatus(@Param("memberId") Long memberId,
                           @Param("memberStatus") String memberStatus);

    int updatePostStatus(@Param("postIds") List<Long> postIds,
                         @Param("postStatus") String postStatus);

    int updatePostContent(@Param("postId") Long postId,
                          @Param("postContent") String postContent);

    int updatePostCategory(@Param("postId") Long postId,
                           @Param("categoryId") Long categoryId);

    int updateReportStatus(@Param("reportIds") List<Long> reportIds,
                           @Param("reportStatus") String reportStatus);

    int deleteReports(@Param("reportIds") List<Long> reportIds);
}
