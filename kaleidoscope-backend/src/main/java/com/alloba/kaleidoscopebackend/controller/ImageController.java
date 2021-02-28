package com.alloba.kaleidoscopebackend.controller;

import com.alloba.kaleidoscopebackend.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
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
    public ResponseEntity<FileSystemResource> getImage(@RequestParam("imageFile") String imageFile) {
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

    @GetMapping("available-directories")
    public ResponseEntity<List<String>> getAvailableImageDirectories(){
        return ResponseEntity
                .ok()
                .body(imageService.getAvailableImageDirectories());
    }

    @PostMapping("change-directory")
    public ResponseEntity<String> changeImageDirectory(@RequestBody String directoryPath){
        imageService.changeImageDirectory(directoryPath);
        return ResponseEntity
                .ok("Success");
    }

    @GetMapping("refresh")
    public ResponseEntity<String> refreshImageList() {
        imageService.reloadBag();
        return ResponseEntity.ok("reloaded");
    }
    //TODO: put these in a meta info controller
//    allTags
//    /fileinfo/:filename
//    reloadinfo
//    saveinfo
//    /updateFileInfo/:filename
}
