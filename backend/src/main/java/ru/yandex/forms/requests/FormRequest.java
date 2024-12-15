package ru.yandex.forms.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormRequest {


    @Schema(description = "mail владельца формы")
    @NotBlank
    private String ownerMail;

    @Schema(description = "Название формы")
    @NotBlank(message = "Название формы не должно быть пустым")
    private String name;

    @Schema(description = "Название таблицы")
    @NotBlank(message = "Название таблицы не должно быть пустым")
    private String tableName;

    private List<String> redactors;

}
