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

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
public class ImageController {

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("image")
    public ResponseEntity<FileSystemResource> getImage(@RequestParam("imageFile") String imageFile) {
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType("video/webm"))
                .body(new FileSystemResource(imageService.getImageFile(imageFile)));
    }

    @GetMapping("image-list")
    public ResponseEntity<List<String>> getImageList(@RequestParam("subDir") Optional<String> subDir) {
        List<String> imageList;

        if(subDir.isEmpty())
            imageList = imageService.getImageList();
        else
            imageList = imageService.getImageList(subDir.get());

        return ResponseEntity.ok(imageService.urlEncodeFileList(imageList));
    }

    @GetMapping("available-directories")
    public ResponseEntity<List<String>> getAvailableImageDirectories(){
        return ResponseEntity
                .ok()
                .body(imageService.getAvailableImageDirectories());
    }

    @GetMapping("refresh")
    public ResponseEntity<String> refreshImageList() {
        imageService.reloadBag();
        return ResponseEntity.ok("reloaded");
    }
}
