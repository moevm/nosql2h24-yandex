package ru.yandex.forms.response;

import lombok.*;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.model.Log;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogPaginationResponse {

    List<Log> logs;

    Integer totalCount;

    Integer totalPage;

    Integer page;

    Integer size;

}
