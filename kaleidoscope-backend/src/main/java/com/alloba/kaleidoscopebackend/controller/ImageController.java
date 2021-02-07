package com.alloba.kaleidoscopebackend.controller;

import com.alloba.kaleidoscopebackend.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/")
public class ImageController {

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("randomImage")
    public ResponseEntity<String> randomImage() {
        return ResponseEntity.ok(imageService.getRandomImageName());
    }

    @GetMapping("image")
    public ResponseEntity<FileSystemResource> getImage(@RequestParam("imageFile") String imageFile) throws FileNotFoundException {
        String filePath = imageService.getImagePath(imageFile);

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType("video/webm"))
                .body(new FileSystemResource(new File(filePath)));
    }

    @GetMapping("imageList")
    public ResponseEntity<List<String>> getImageList() {
        return ResponseEntity.ok(imageService.getImageList());
    }
    //TODO: put these in a meta info controller
//    allTags
//    /fileinfo/:filename
//    reloadinfo
//    saveinfo
//    /updateFileInfo/:filename
}
