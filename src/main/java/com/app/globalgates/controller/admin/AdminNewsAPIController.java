package com.app.globalgates.controller.admin;

import com.app.globalgates.dto.NewsDTO;
import com.app.globalgates.service.AdminNewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/news")
@RequiredArgsConstructor
public class AdminNewsAPIController {
    private final AdminNewsService adminNewsService;

    @GetMapping
    public ResponseEntity<List<NewsDTO>> getAdminNews() {
        return ResponseEntity.ok(adminNewsService.getAdminNews());
    }

    @PostMapping
    public ResponseEntity<Void> createAdminNews(@RequestBody NewsDTO newsDTO) {
        adminNewsService.createAdminNews(newsDTO);
        return ResponseEntity.ok().build();
    }
}
