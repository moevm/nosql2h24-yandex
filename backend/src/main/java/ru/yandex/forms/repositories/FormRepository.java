package ru.yandex.forms.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import ru.yandex.forms.model.Form;

import java.util.List;

public interface FormRepository extends MongoRepository<Form, String> {

    List<Form> findByOwnerEmail(String mail);

}
