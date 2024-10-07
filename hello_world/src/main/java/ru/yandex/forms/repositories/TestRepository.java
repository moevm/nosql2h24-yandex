package ru.yandex.forms.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import ru.yandex.forms.model.TestModel;

import java.util.List;

public interface TestRepository extends MongoRepository<TestModel, String> {

    List<TestModel> findByText(String text);

}
