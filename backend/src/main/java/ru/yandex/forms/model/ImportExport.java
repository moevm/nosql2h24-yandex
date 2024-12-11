package ru.yandex.forms.model;

import lombok.*;

import java.util.List;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportExport {

    List<Form> forms;

    List<User> users;

}
