package com.alloba.kaleidoscopebackend.service;

import com.alloba.kaleidoscopebackend.PropertiesDefault;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImageService {

    private final File baseImageDirectory;
    private final PropertiesDefault properties;

    private List<String> loadedImageList;

    @Autowired
    public ImageService(PropertiesDefault properties){
        this.properties = properties;
        this.baseImageDirectory = new File(properties.imageDirectory());
        this.reloadBag();
    }

    public List<File> getNestedFiles(File directory){
        if(directory.isFile() || directory.listFiles() == null){
            return Collections.emptyList();
        }
        List<File> files = Arrays.stream(Objects.requireNonNull(directory.listFiles())).filter(File::isFile).collect(Collectors.toList());
        List<File> subDirectories =Arrays.stream(Objects.requireNonNull(directory.listFiles())).filter(File::isDirectory).collect(Collectors.toList());
        for(File subDir : subDirectories){
            files.addAll(getNestedFiles(subDir));
        }
        return files;
    }

    public List<String> convertFilesToRelativePath(File baseDirectory, List<File> subFiles){
        String basePath = baseDirectory.getAbsolutePath();
        return subFiles.stream()
                .map(x -> x.getAbsolutePath().substring(basePath.length())) // +1 removes the front /
                .collect(Collectors.toList());
    }

    public File getRandomImageName() {
        Random random = new Random();
        if(loadedImageList.size() == 0)
            return null;
        else
            return new File(this.baseImageDirectory.getAbsolutePath() + loadedImageList.get(random.nextInt(loadedImageList.size())));
    }

    public File getImageFile(String imageFile) {
        File file = new File(this.baseImageDirectory + imageFile);
        if(!file.isFile())
            throw new RuntimeException("File Not Found");
        else return file;
    }

    public void reloadBag() {
        this.loadedImageList = convertFilesToRelativePath(this.baseImageDirectory, getNestedFiles(this.baseImageDirectory));
    }

    public List<String> getImageList() {
        return loadedImageList;
    }

    public List<String> getImageList(String subdir){
        return this.loadedImageList.stream().filter(x -> x.startsWith(subdir)).collect(Collectors.toList());
    }

    public List<String> getAvailableImageDirectories() {
        List<String> dirList = Arrays.stream(Objects.requireNonNull(new File(properties.imageDirectory()).listFiles()))
                .filter(File::isDirectory)
                .map(x -> File.separator + x.getName())
                .collect(Collectors.toList());

        dirList.add(File.separator);
        return dirList;
    }

    public List<String> urlEncodeFileList(List<String> filePaths){
        return filePaths.stream().map(image -> URLEncoder.encode(image, StandardCharsets.UTF_8)).collect(Collectors.toList());
    }
}
