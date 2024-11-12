package ru.yandex.forms.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import ru.yandex.forms.model.User;

public interface UserRepository extends MongoRepository<User, String> {


}
