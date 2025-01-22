package ru.yandex.forms.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import ru.yandex.forms.model.Log;

import java.time.Instant;

public interface LogRepository extends MongoRepository<Log, String> {

    Page<Log> findByEditActionLikeIgnoreCaseAndEditEmailLikeIgnoreCaseAndEditTimeBetweenAndEventTypeLikeIgnoreCaseAndFormIdLike(
            String editAction,
            String editEmail,
            Instant fromDate,
            Instant toDate,
            String eventType,
            String id,
            Pageable pageable
    );

}
