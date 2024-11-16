package ru.yandex.forms.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.yandex.forms.model.Form;

import java.util.List;
import java.util.Optional;

public interface FormRepository extends MongoRepository<Form, String> {

    List<Form> findByOwnerEmail(String mail);

    List<Form> findByOwnerEmailOrRedactors(String ownerMail, List<String> redactorsMails);

    @Query("{\n" +
            "redactors:  ?0" +
            "}")
    List<Form> findFormsByRedactorMail(String redactor);

    Optional<Form> findByOwnerEmailAndName(String mail, String name);
}
