package ru.yandex.forms.requests;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormRequest {

    private String ownerMail;

    private String name;

}
