package ru.yandex.forms.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormRequest {


    @Schema(description = "mail владельца формы")
    private String ownerMail;

    @Schema(description = "Название формы")
    private String name;

}
