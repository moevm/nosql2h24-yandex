package ru.yandex.forms.requests;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteRedactorsRequest {

    String formId;

    String userMail;

}
