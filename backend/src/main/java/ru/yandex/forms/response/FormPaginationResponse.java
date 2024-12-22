package ru.yandex.forms.response;

import lombok.*;
import ru.yandex.forms.model.Form;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormPaginationResponse {

    List<Form> forms;

    Integer totalCount;

    Integer totalPage;

    Integer page;

    Integer size;

}
