package ru.yandex.forms.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.repositories.FormRepository;
import ru.yandex.forms.requests.FormRequest;
import ru.yandex.forms.services.FormService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/forms")
@Tag(name = "Контроллер для форм", description = "Позволяет производить операции с формами и таблицами")
public class FormController {

    private final FormRepository formRepository;

    private final FormService formService;

    public FormController(FormRepository formRepository, FormService formService) {
        this.formRepository = formRepository;
        this.formService = formService;
    }

    @GetMapping("/{mail}")
    @Operation(
            summary = "Получить список форм у пользователя"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список форм"),
    }
    )
    public ResponseEntity<List<Form>> getForms(
            @PathVariable @Parameter(description = "mail пользователя", required = true) String mail
    ){
        List<Form> forms = new ArrayList<>();
        forms.addAll(formRepository.findByOwnerEmail(mail));
        forms.addAll(formRepository.findFormsByRedactorMail(mail));
        return ResponseEntity.ok(forms);
    }

    @Operation(
            summary = "Создать новую форму (пока без xlsx таблицы)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Форма создана"),
    }
    )
    @PostMapping("/create-form")
    public ResponseEntity<Form> createForm(@RequestBody FormRequest formRequest){
        Form form = new Form();

        form.setOwnerEmail(formRequest.getOwnerMail());
        form.setName(formRequest.getName());

        return ResponseEntity.ok(formRepository.save(form));

    }

    @Operation(
            summary = "Получить таблицу по id формы"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Файл таблицы отправлен"),
            @ApiResponse(responseCode = "404", description = "Файл или id не было найдено")
    }
    )
    @GetMapping("/table/{id}")
    public ResponseEntity<byte[]> getTable(
            @PathVariable @Parameter(description = "id таблицы", required = true) String id){
        return formService.getTable(id);
    }


}
