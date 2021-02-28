package com.alloba.kaleidoscopebackend.service;

import com.alloba.kaleidoscopebackend.PropertiesDefault;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Random;
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

    public String getImagePath(String imageFile) {
        File[] imageList = imageDirectoryObject.listFiles((dir, name) -> name.equals(imageFile));
        System.out.println(Arrays.toString(imageDirectoryObject.listFiles()));
        if(imageList == null){
            return "";
        }

        if(imageList.length > 1){
            throw new RuntimeException("more than one matching file found, this should be impossible.");
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

    public List<String> getAvailableImageDirectories() {
        return Arrays.stream(Objects.requireNonNull(new File(properties.imageDirectory()).listFiles()))
                .filter(File::isDirectory)
                .map(File::getAbsolutePath)
                .collect(Collectors.toList());
    }

    public void changeImageDirectory(String directoryPath) {
        this.imageDirectoryObject = new File(directoryPath);
        this.staticBag = Arrays.stream(Objects.requireNonNull(imageDirectoryObject.listFiles()))
                .filter(File::isFile)
                .map(File::getName)
                .filter(name -> name.endsWith(".webm"))
                .collect(Collectors.toList());
    }
}
