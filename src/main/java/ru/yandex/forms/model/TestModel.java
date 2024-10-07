package ru.yandex.forms.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "testmodel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestModel {

    @Id
    private String id;

    private int age;

    private String text;

}
