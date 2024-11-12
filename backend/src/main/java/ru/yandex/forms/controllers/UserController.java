package ru.yandex.forms.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.model.User;
import ru.yandex.forms.repositories.FormRepository;
import ru.yandex.forms.repositories.UserRepository;
import ru.yandex.forms.requests.UserRequest;
import ru.yandex.forms.response.UserResponse;

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
    public ResponseEntity<UserResponse> getUser(@PathVariable String mail){
        User user = new User();
        user.setEmail(mail);
        String userMail = userRepository.save(user).getEmail();
        Form form = new Form();
        form.setName(userMail + " name");
        form.setOwnerEmail(userMail);
        formRepository.save(form);
        return ResponseEntity.ok(UserResponse.builder()
                .email(userMail)
                .build());
    }
}
