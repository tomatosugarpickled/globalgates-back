package com.app.globalgates.controller.news;

import com.app.globalgates.dto.NewsDTO;
import com.app.globalgates.service.NewsService;
import com.app.globalgates.util.DateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/news")
@Slf4j
public class NewsController {

    private final NewsService newsService;

    //    뉴스 상세 페이지
    @GetMapping("/detail/{id}")
    public String goToNewsDetailPage(@PathVariable Long id, Model model) {
        Optional<NewsDTO> result = newsService.getNews(id);
        if (result.isEmpty()) {
            return "redirect:/explore?tab=news";
        }

        NewsDTO news = result.get();
        String baseTime = news.getPublishedAt() != null && !news.getPublishedAt().isEmpty()
                ? news.getPublishedAt()
                : news.getCreatedDatetime();

        model.addAttribute("news", news);
        model.addAttribute("createdRelative", DateUtils.toRelativeTime(baseTime));
        return "news/news";
    }
}
