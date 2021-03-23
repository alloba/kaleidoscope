package com.alloba.kaleidoscopebackend.service;

import com.alloba.kaleidoscopebackend.PropertiesDefault;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
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
        ListObjectsRequest request = new ListObjectsRequest();
        request.setBucketName(properties.mediaBucket());
        List<S3ObjectSummary> summaries = new ArrayList<>();
        do{
            ObjectListing response = s3Client.listObjects(request);
            summaries.addAll(response.getObjectSummaries());

            if(response.isTruncated())
                request.setMarker(response.getNextMarker());
            else
                request = null;
        }
        while (request != null);

        this.loadedImageList = summaries
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

    public S3Object getImageFile(String imageFile) {
        S3Object s3Object = s3Client.getObject(properties.mediaBucket(), imageFile);
        return s3Object;
    }

    public String getImageFileString(String imageFile){
        return s3Client.getUrl(properties.mediaBucket(), imageFile).toExternalForm();
    }

    public List<String> getImageList(Optional<String> subdir){
        if(subdir.isEmpty() || File.separator.equals(subdir.get()))
            return this.loadedImageList;
        return this.loadedImageList.stream().filter(x -> x.startsWith(subdir.get())).collect(Collectors.toList());
    }

    public List<String> getAvailableImageDirectories() {
        return this.directories;
    }

    public List<String> urlEncodeFileList(List<String> filePaths){
        return filePaths.stream().map(image -> URLEncoder.encode(image, StandardCharsets.UTF_8)).collect(Collectors.toList());
    }
}
