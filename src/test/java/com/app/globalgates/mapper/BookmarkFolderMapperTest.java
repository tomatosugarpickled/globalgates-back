package com.app.globalgates.mapper;

import com.app.globalgates.dto.BookmarkFolderDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BookmarkFolderMapperTest {

    @Autowired
    private BookmarkFolderMapper bookmarkFolderMapper;

    private Long memberId;

    @BeforeEach
    void setUp() {
        memberId = 1L;
    }

    @Test
    @DisplayName("폴더 생성 후 id가 자동 생성된다")
    void insert() {
        BookmarkFolderDTO folderDTO = new BookmarkFolderDTO();
        folderDTO.setMemberId(memberId);
        folderDTO.setFolderName("관심 상품");

        bookmarkFolderMapper.insert(folderDTO);

        assertThat(folderDTO.getId()).isNotNull();
    }

    @Test
    @DisplayName("폴더명을 수정할 수 있다")
    void update() {
        BookmarkFolderDTO folderDTO = new BookmarkFolderDTO();
        folderDTO.setMemberId(memberId);
        folderDTO.setFolderName("원래 폴더명");
        bookmarkFolderMapper.insert(folderDTO);

        folderDTO.setFolderName("수정된 폴더명");
        bookmarkFolderMapper.update(folderDTO);

        Optional<BookmarkFolderDTO> result = bookmarkFolderMapper.selectById(folderDTO.getId());
        assertThat(result).isPresent();
        assertThat(result.get().getFolderName()).isEqualTo("수정된 폴더명");
    }

    @Test
    @DisplayName("폴더를 삭제할 수 있다")
    void delete() {
        BookmarkFolderDTO folderDTO = new BookmarkFolderDTO();
        folderDTO.setMemberId(memberId);
        folderDTO.setFolderName("삭제할 폴더");
        bookmarkFolderMapper.insert(folderDTO);

        bookmarkFolderMapper.delete(folderDTO.getId());

        Optional<BookmarkFolderDTO> result = bookmarkFolderMapper.selectById(folderDTO.getId());
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("id로 폴더를 조회할 수 있다")
    void selectById() {
        BookmarkFolderDTO folderDTO = new BookmarkFolderDTO();
        folderDTO.setMemberId(memberId);
        folderDTO.setFolderName("조회 테스트");
        bookmarkFolderMapper.insert(folderDTO);

        Optional<BookmarkFolderDTO> result = bookmarkFolderMapper.selectById(folderDTO.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getFolderName()).isEqualTo("조회 테스트");
        assertThat(result.get().getMemberId()).isEqualTo(memberId);
    }

    @Test
    @DisplayName("회원의 폴더 목록을 조회할 수 있다")
    void selectAllByMemberId() {
        BookmarkFolderDTO folder1 = new BookmarkFolderDTO();
        folder1.setMemberId(memberId);
        folder1.setFolderName("폴더1");
        bookmarkFolderMapper.insert(folder1);

        BookmarkFolderDTO folder2 = new BookmarkFolderDTO();
        folder2.setMemberId(memberId);
        folder2.setFolderName("폴더2");
        bookmarkFolderMapper.insert(folder2);

        List<BookmarkFolderDTO> result = bookmarkFolderMapper.selectAllByMemberId(memberId);

        assertThat(result).hasSizeGreaterThanOrEqualTo(2);
    }
}
