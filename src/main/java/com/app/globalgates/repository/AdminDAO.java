package com.app.globalgates.repository;

import com.app.globalgates.common.pagination.Criteria;
import com.app.globalgates.dto.AdminMemberListDTO;
import com.app.globalgates.dto.AdminPostListDTO;
import com.app.globalgates.dto.AdminReportListDTO;
import com.app.globalgates.mapper.AdminMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminDAO {
    private final AdminMapper adminMapper;

    public int findAdminMemberTotal(String keyword, String memberRole, String memberStatus) {
        return adminMapper.selectAdminMemberTotal(keyword, memberRole, memberStatus);
    }

    public List<AdminMemberListDTO> findAdminMembers(Criteria criteria, String keyword, String memberRole, String memberStatus) {
        return adminMapper.selectAdminMembers(criteria, keyword, memberRole, memberStatus);
    }

    public int findAdminPostTotal(String keyword, String postType, String categoryName, String postStatus) {
        return adminMapper.selectAdminPostTotal(keyword, postType, categoryName, postStatus);
    }

    public List<AdminPostListDTO> findAdminPosts(Criteria criteria, String keyword, String postType, String categoryName, String postStatus) {
        return adminMapper.selectAdminPosts(criteria, keyword, postType, categoryName, postStatus);
    }

    public int findAdminReportTotal(String keyword, String targetType, String reportStatus) {
        return adminMapper.selectAdminReportTotal(keyword, targetType, reportStatus);
    }

    public List<AdminReportListDTO> findAdminReports(Criteria criteria, String keyword, String targetType, String reportStatus) {
        return adminMapper.selectAdminReports(criteria, keyword, targetType, reportStatus);
    }

    public void updateMemberStatus(Long memberId, String memberStatus) {
        adminMapper.updateMemberStatus(memberId, memberStatus);
    }

    public void updatePostStatus(List<Long> postIds, String postStatus) {
        adminMapper.updatePostStatus(postIds, postStatus);
    }

    public void updatePostContent(Long postId, String postContent) {
        adminMapper.updatePostContent(postId, postContent);
    }

    public void updatePostCategory(Long postId, Long categoryId) {
        adminMapper.updatePostCategory(postId, categoryId);
    }

    public void updateReportStatus(List<Long> reportIds, String reportStatus) {
        adminMapper.updateReportStatus(reportIds, reportStatus);
    }

    public void deleteReports(List<Long> reportIds) {
        adminMapper.deleteReports(reportIds);
    }
}
