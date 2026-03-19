package com.app.globalgates.dto;

import com.app.globalgates.domain.BookmarkVO;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
public class BookmarkDTO {
    private Long id;
    private Long memberId;
    private Long postId;
    private Long folderId;
    private String postTitle;
    private String postContent;
    private String createdDatetime;
    private String updatedDatetime;

    public BookmarkVO toBookmarkVO() {
        return BookmarkVO.builder()
                .id(id)
                .memberId(memberId)
                .postId(postId)
                .folderId(folderId)
                .createdDatetime(createdDatetime)
                .updatedDatetime(updatedDatetime)
                .build();
    }
}
