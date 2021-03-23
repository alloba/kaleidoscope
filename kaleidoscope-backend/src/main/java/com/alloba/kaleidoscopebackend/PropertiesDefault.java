package com.alloba.kaleidoscopebackend;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:application.properties")
public class PropertiesDefault {

    final Environment environment;

    public PropertiesDefault(Environment environment) {
        this.environment = environment;
    }

    public String awsRegion() {
        return environment.getProperty("awsRegion");
    }

    public String mediaBucket() {
        return environment.getProperty("mediaBucket");
    }
}
