package com.app.globalgates.controller;

import com.app.globalgates.auth.CustomUserDetails;
import com.app.globalgates.dto.EstimationDTO;
import com.app.globalgates.dto.EstimationExpertDTO;
import com.app.globalgates.dto.EstimationWithPagingDTO;
import com.app.globalgates.dto.PostProductDTO;
import com.app.globalgates.service.EstimationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/estimations/**")
public class EstimationAPIController {
    private final EstimationService estimationService;

    @PostMapping("write")
    public void write(@RequestBody EstimationDTO estimationDTO,
                      @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails != null) {
            estimationDTO.setRequesterId(userDetails.getId());
        }
        estimationService.write(estimationDTO);
    }

    @GetMapping("list/{page}")
    public EstimationWithPagingDTO getList(@PathVariable int page,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        return estimationService.getList(page, userDetails != null ? userDetails.getId() : null);
    }

    @GetMapping("{id}")
    public EstimationDTO getDetail(@PathVariable Long id) {
        return estimationService.getDetail(id).orElse(null);
    }

    @GetMapping("experts")
    public List<EstimationExpertDTO> getExperts(@RequestParam(required = false) String keyword,
                                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        return estimationService.getExpertsForRequest(userDetails != null ? userDetails.getId() : null, keyword);
    }

    @GetMapping("products")
    public List<PostProductDTO> getProducts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return estimationService.getProductsForRequest(userDetails != null ? userDetails.getId() : null);
    }
}
