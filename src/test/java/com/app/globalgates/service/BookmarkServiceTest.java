package com.app.globalgates.service;

import com.app.globalgates.dto.BookmarkDTO;
import com.app.globalgates.dto.BookmarkFolderDTO;
import com.app.globalgates.repository.BookmarkDAO;
import com.app.globalgates.repository.BookmarkFolderDAO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class BookmarkServiceTest {

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private BookmarkFolderDAO bookmarkFolderDAO;

    @Autowired
    private BookmarkDAO bookmarkDAO;

    private Long memberId;
    private Long postId;

    @BeforeEach
    void setUp() {
        memberId = 1L;
        postId = 1L;
    }

    @Test
    @DisplayName("폴더를 생성하고 조회할 수 있다")
    void createFolderAndGetFolders() {
        BookmarkFolderDTO folderDTO = new BookmarkFolderDTO();
        folderDTO.setMemberId(memberId);
        folderDTO.setFolderName("서비스 폴더");

        bookmarkService.createFolder(folderDTO);

        List<BookmarkFolderDTO> result = bookmarkService.getFolders(memberId);
        assertThat(result).extracting(BookmarkFolderDTO::getFolderName).contains("서비스 폴더");
    }

    @Test
    @DisplayName("북마크를 추가하고 회원 기준으로 조회할 수 있다")
    void addBookmarkAndGetBookmarks() {
        BookmarkDTO bookmarkDTO = new BookmarkDTO();
        bookmarkDTO.setMemberId(memberId);
        bookmarkDTO.setPostId(postId);

        bookmarkService.addBookmark(bookmarkDTO);

        List<BookmarkDTO> result = bookmarkService.getBookmarks(memberId);
        assertThat(result).isNotEmpty();
    }

    @Test
    @DisplayName("폴더 삭제 시 연결된 북마크의 folderId를 비운다")
    void deleteFolder() {
        BookmarkFolderDTO folderDTO = new BookmarkFolderDTO();
        folderDTO.setMemberId(memberId);
        folderDTO.setFolderName("삭제 폴더");
        bookmarkFolderDAO.save(folderDTO);

        BookmarkDTO bookmarkDTO = new BookmarkDTO();
        bookmarkDTO.setMemberId(memberId);
        bookmarkDTO.setPostId(postId);
        bookmarkDTO.setFolderId(folderDTO.getId());
        bookmarkDAO.save(bookmarkDTO);

        bookmarkService.deleteFolder(folderDTO.getId());

        assertThat(bookmarkDAO.findById(bookmarkDTO.getId())).isPresent();
        assertThat(bookmarkDAO.findById(bookmarkDTO.getId()).get().getFolderId()).isNull();
    }
}
