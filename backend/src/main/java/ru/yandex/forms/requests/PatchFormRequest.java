package ru.yandex.forms.requests;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatchFormRequest {

    private String formId;

    private String formName;

    private String tableName;

}
