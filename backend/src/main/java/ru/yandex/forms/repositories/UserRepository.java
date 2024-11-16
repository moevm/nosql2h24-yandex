package ru.yandex.forms.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import ru.yandex.forms.model.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

}
