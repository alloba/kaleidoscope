package com.alloba.kaleidoscopebackend.controller;

import com.alloba.kaleidoscopebackend.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
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

//    @GetMapping("image")
//    public ResponseEntity<InputStreamResource> getImage(@RequestParam("imageFile") String imageFile) {
//        S3Object image = imageService.getImageFile(imageFile);
//        return ResponseEntity
//                .ok()
//                .contentType(MediaType.parseMediaType("video/webm"))
//                .header("Content-Length", String.valueOf(image.getObjectMetadata().getContentLength()))
//                .header("Accept-Ranges", "bytes")
//                .body(new InputStreamResource(image.getObjectContent()));
//        //fixme: s3 content streams are technically being terminated early, thowing errors. which es bad. but dunno how fix.
//        //      PROBABLY actually.... maybe just uh.... send the image url?
//    }

    @GetMapping("image")
    public void getImage(@RequestParam("imageFile") String imageFile, HttpServletResponse response) throws IOException {
        String redirect = imageService.getImageFileString(imageFile);
        response.sendRedirect(redirect);
    }

    @GetMapping("image-list")
    public ResponseEntity<List<String>> getImageList(@RequestParam("subDir") Optional<String> subDir) {
        List<String> imageList;
        imageList = imageService.getImageList(subDir);

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
        imageService.loadImages();
        imageService.loadDirectories();
        return ResponseEntity.ok("reloaded");
    }
}
