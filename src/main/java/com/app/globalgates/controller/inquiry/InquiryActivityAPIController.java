package com.app.globalgates.controller.inquiry;

import com.app.globalgates.auth.CustomUserDetails;
import com.app.globalgates.service.InquiryActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/inquiry/activity/**")
@RequiredArgsConstructor
@Slf4j
public class InquiryActivityAPIController {
    private final InquiryActivityService inquiryActivityService;

    @GetMapping("list/{page}")
    public ResponseEntity<?> getInquiryActivityList(@PathVariable int page,
                                                    @RequestParam(required = false) String startDate,
                                                    @RequestParam(required = false) String endDate,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(inquiryActivityService.getList(page, userDetails.getId(), startDate, endDate));
    }
}
