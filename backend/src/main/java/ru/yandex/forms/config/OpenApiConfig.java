package ru.yandex.forms.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "Yandex Forms api",
                description = "api для nosql project",
                version = "1.0.0"
        )
)
@Configuration
//@EnableOpenApi
public class OpenApiConfig {
}

