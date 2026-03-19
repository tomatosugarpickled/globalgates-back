package com.app.globalgates.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/post/**")
@RequiredArgsConstructor
public class PostController {
    @GetMapping("list/{page}")
    public String list(@PathVariable int page) {
        return "post/list";
    }
}
