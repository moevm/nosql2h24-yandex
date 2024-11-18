package ru.yandex.forms.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Контроллер для пользователей", description = "Позволяет проводить операции с пользователями")
public class UserController {

    private final UserRepository userRepository;

    private final FormRepository formRepository;

    @Autowired
    public UserController(UserRepository userRepository, FormRepository formRepository) {
        this.userRepository = userRepository;
        this.formRepository = formRepository;
    }


    @GetMapping("/{mail}")
    @Operation(
            summary = "Получить ответ, если ли пользователь в базе"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь есть в базе"),
            @ApiResponse(responseCode = "401", description = "Пользователя нет в базе")
    }
    )
    public ResponseEntity<HttpStatus> getUser(
            @PathVariable @Parameter(description = "mail пользователя", required = true) String mail
    ){
        Optional<User> user = userRepository.findByEmail(mail);
        if (user.isEmpty()){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        else {
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
