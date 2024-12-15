package ru.yandex.forms.requests;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatchRedactorsRequest {

    List<String> redactors;

    String formId;

}
