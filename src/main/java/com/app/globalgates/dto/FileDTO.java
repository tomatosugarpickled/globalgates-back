package com.app.globalgates.dto;

import com.app.globalgates.common.enumeration.FileContentType;
import lombok.*;

@Getter
@Setter
@ToString
@EqualsAndHashCode(of="id")
@NoArgsConstructor
public class FileDTO {
    private Long id;
    private String originalName;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private FileContentType contentType;
    private String createdDatetime;
}
