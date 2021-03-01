package com.alloba.kaleidoscopebackend.service;

import com.alloba.kaleidoscopebackend.PropertiesDefault;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImageService {

    private List<String> staticBag;
    private File imageDirectoryObject;
    private final PropertiesDefault properties;

    @Autowired
    public ImageService(PropertiesDefault properties){
        this.properties = properties;
        this.imageDirectoryObject = new File(properties.imageDirectory());
        this.staticBag = Arrays.stream(Objects.requireNonNull(imageDirectoryObject.listFiles()))
                .filter(File::isFile)
                .map(File::getName)
                .filter(name -> name.endsWith(".webm"))
                .collect(Collectors.toList());
    }

    public String getRandomImageName() {
        Random random = new Random();
        if(staticBag.size() == 0)
            return "";
        else
            return staticBag.get(random.nextInt(staticBag.size()));
    }

    public String getImagePath(String imageFile, String subDir) {
        File[] imageList = new File(imageDirectoryObject.getPath() + "/" + subDir).listFiles((dir, name) -> name.equals(imageFile));
        if(imageList == null){
            return "";
        }
        if(imageList.length > 1){
            throw new RuntimeException("more than one matching file found, this should be impossible.");
        }
        if(imageList.length == 0){
            return "";
        }
        else return imageList[0].getAbsolutePath();
    }

    public void reloadBag() {
        this.imageDirectoryObject = new File(properties.imageDirectory());
        this.staticBag = Arrays.stream(Objects.requireNonNull(imageDirectoryObject.listFiles()))
                .map(File::getName)
                .collect(Collectors.toList());
    }

    public List<String> getImageList() {
        return staticBag;
    }

    public List<String> getImageList(String subdirectory) {
        File subdir = new File(properties.imageDirectory() + "/" + subdirectory);

        return Arrays.stream(Objects.requireNonNull(subdir.listFiles()))
                .filter(File::isFile)
                .map(File::getName)
                .filter(name -> name.endsWith(".webm"))
                .collect(Collectors.toList());
    }

    public List<String> getAvailableImageDirectories() {
        List<String> dirList = new ArrayList<>();
        dirList.add("/");

        List<String> remainder = Arrays.stream(Objects.requireNonNull(new File(properties.imageDirectory()).listFiles()))
                .filter(File::isDirectory)
                .map(File::getName)
                .collect(Collectors.toList());

        dirList.addAll(remainder);
        System.out.println("found directories: ");
        System.out.println(dirList.toString());
        return dirList;
    }
}
