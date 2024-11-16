package ru.yandex.forms.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.model.User;
import ru.yandex.forms.repositories.FormRepository;
import ru.yandex.forms.repositories.UserRepository;
import ru.yandex.forms.requests.UserRequest;
import ru.yandex.forms.response.UserResponse;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    private final FormRepository formRepository;

    @Autowired
    public UserController(UserRepository userRepository, FormRepository formRepository) {
        this.userRepository = userRepository;
        this.formRepository = formRepository;
    }


    @GetMapping("/{mail}")
    public ResponseEntity<HttpStatus> getUser(@PathVariable String mail){
        Optional<User> user = userRepository.findByEmail(mail);
        if (user.isEmpty()){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        else {
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
