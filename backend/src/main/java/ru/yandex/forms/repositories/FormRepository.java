package ru.yandex.forms.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.yandex.forms.model.Form;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface FormRepository extends MongoRepository<Form, String> {

    List<Form> findByOwnerEmail(String mail);

    List<Form> findByOwnerEmailOrRedactors(String ownerMail, List<String> redactorsMails);

    List<Form> findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndRedactorsContainsIgnoreCaseAndDateLikeIgnoreCase(
            String tableName,
            String ownerMail,
            String redactor,
            String date
    );
    List<Form> findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndDateLikeIgnoreCase(
            String tableName,
            String ownerMail,
            String date
    );
    List<Form> findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndDateBetween(
            String tableName,
            String ownerMail,
            Instant fromDate,
            Instant toDate
    );

    Page<Form> findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndDateBetween(
            String tableName,
            String ownerMail,
            Instant fromDate,
            Instant toDate,
            Pageable pageable
    );

    Optional<Form> findByName(String name);

    List<Form> findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndRedactorsContainsIgnoreCaseAndDateBetweenIgnoreCase(
            String tableName,
            String ownerMail,
            String redactor,
            Instant fromDate,
            Instant toDate
    );

    Page<Form> findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndRedactorsContainsIgnoreCaseAndDateBetweenIgnoreCase(
            String tableName,
            String ownerMail,
            String redactor,
            Instant fromDate,
            Instant toDate,
            Pageable pageable
    );

    @Query("{'$or': [{ 'redactors': ?1 }, { 'ownerEmail': ?1 }]} ")
    Page<Form> findFormsByRedactorMailOrOwnerEmail(String redactor, Pageable pageable);

    Page<Form> findFormsByRedactorsContainsOrOwnerEmail(List<String> redactors, String ownerEmail, Pageable pageable);

    Optional<Form> findByOwnerEmailAndName(String mail, String name);

    //Page<Form> findByOwnerEmail
}
