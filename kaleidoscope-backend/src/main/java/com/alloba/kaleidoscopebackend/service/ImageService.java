package com.alloba.kaleidoscopebackend.service;

import com.alloba.kaleidoscopebackend.PropertiesDefault;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImageService {

    private final PropertiesDefault properties;
    private final AmazonS3 s3Client;

    private List<String> loadedImageList;
    private List<String> directories;

    @Autowired
    public ImageService(PropertiesDefault properties, AmazonS3 s3Client){
        this.properties = properties;
        this.s3Client = s3Client;

        this.loadImages();
        this.loadDirectories();
    }

    public void loadImages(){
        this.loadedImageList = s3Client
                .listObjects(properties.mediaBucket())
                .getObjectSummaries()
                .stream()
                .map(S3ObjectSummary::getKey)
                .collect(Collectors.toList());
    }

    public void loadDirectories(){
        Set<String> dirs = new HashSet<>();
        this.loadedImageList.forEach(x -> {
            if(x.split("/").length > 1){
                dirs.add(x.split("/")[0]);
            }
        });
        this.directories = new ArrayList<>(dirs);
        this.directories.add(File.separator);
    }

    public InputStream getImageFile(String imageFile) {
        S3Object s3Object = s3Client.getObject(properties.mediaBucket(), imageFile);
        return s3Object.getObjectContent();
    }

    public List<String> getImageList() {
        return loadedImageList;
    }

    public List<String> getImageList(String subdir){
        return this.loadedImageList.stream().filter(x -> x.startsWith(subdir)).collect(Collectors.toList());
    }

    public List<String> getAvailableImageDirectories() {
        return this.directories;
    }

    public List<String> urlEncodeFileList(List<String> filePaths){
        return filePaths.stream().map(image -> URLEncoder.encode(image, StandardCharsets.UTF_8)).collect(Collectors.toList());
    }
}
