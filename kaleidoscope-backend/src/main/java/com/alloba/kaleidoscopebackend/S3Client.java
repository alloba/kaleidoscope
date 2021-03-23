package com.alloba.kaleidoscopebackend;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Client {

    @Bean
    public AmazonS3 S3ClientBean(PropertiesDefault propertiesDefault){
        //the client builder will attempt to pull aws credentials from standard environment variables.
        //this should work for local and gitlab, not sure about beanstalk yet though. i would hope so.
        AmazonS3 bean = AmazonS3Client.builder().withRegion(propertiesDefault.awsRegion()).build();
        if(!bean.doesBucketExist(propertiesDefault.mediaBucket())){
            throw new RuntimeException("Target S3 bucket does not exist: " + propertiesDefault.mediaBucket());
        }

        return bean;
    }
}
