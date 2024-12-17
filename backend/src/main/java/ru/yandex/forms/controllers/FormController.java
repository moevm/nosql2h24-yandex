package ru.yandex.forms.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.repositories.FormRepository;
import ru.yandex.forms.requests.DeleteRedactorsRequest;
import ru.yandex.forms.requests.FormRequest;
import ru.yandex.forms.requests.PatchFormRequest;
import ru.yandex.forms.requests.PatchRedactorsRequest;
import ru.yandex.forms.response.UserResponse;
import ru.yandex.forms.services.FormService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
            summary = "Создать новую форму"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Форма создана"),
    }
    )
    @PostMapping("/create-form")
    public ResponseEntity<String> createForm(@RequestBody FormRequest formRequest){

        if (formRequest.getFormName().isBlank()) {
            return new ResponseEntity<>("Название формы не может быть пустым", HttpStatus.BAD_REQUEST);
        }
        if (formRequest.getTableName().isBlank()) {
            return new ResponseEntity<>("Название таблицы не может быть пустым", HttpStatus.BAD_REQUEST);
        }
        if (formService.isContain(formRequest.getOwnerMail(), formRequest.getFormName())){
            return new ResponseEntity<>("Название формы не уникальное", HttpStatus.BAD_REQUEST);
        }
        Form form = new Form();

        form.setOwnerEmail(formRequest.getOwnerMail());

        form.setName(formRequest.getFormName());
        form.setDate(Instant.now());
        form.setRedactors(formRequest.getRedactors());
        if (!formService.isTableExist(formRequest.getTableName())){
            formService.createXlsxFile(formRequest.getTableName());
        }
        form.setPath("./uploads/tables/" + formRequest.getTableName() + ".xlsx");
        form.setTableName(formRequest.getTableName());

        formRepository.save(form);
        return ResponseEntity.ok("Создано");

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


    @Operation(
            summary = "Поиск элементов"
    )
    @GetMapping("/table")
    public ResponseEntity<List<Form>> searchForm(
        @RequestParam(value = "table_name", required = false, defaultValue = "") String tableName,
        @RequestParam(value = "from_date", required = false, defaultValue = "") String fromDate,
        @RequestParam(value = "to_date", required = false, defaultValue = "") String toDate,
        @RequestParam(value = "owner_mail", required = false, defaultValue = "") String owner,
        @RequestParam(value = "redactor", required = false, defaultValue = "") String redactor
    ){
        return ResponseEntity.ok(formService.getFormsSearch(
                tableName, fromDate, toDate, owner, redactor
        ));
    }

    @GetMapping("/available/redactors/{id}")
    public ResponseEntity<List<UserResponse>> getUsersNoOwner(
            @PathVariable @Parameter(description = "id таблицы", required = true) String id
    ){
        return formService.getUsersNoOwner(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteForm(
            @PathVariable @Parameter(description = "id таблицы", required = true) String id
    ){
        return formService.deleteForm(id);
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateForm(
            @RequestBody PatchFormRequest patchFormRequest
            ){
        if (patchFormRequest.getFormName().isBlank()) {
            return new ResponseEntity<>("Название формы не может быть пустым", HttpStatus.BAD_REQUEST);
        }
        if (patchFormRequest.getTableName().isBlank()) {
            return new ResponseEntity<>("Название таблицы не может быть пустым", HttpStatus.BAD_REQUEST);
        }
        Optional<Form> form = formRepository.findById(patchFormRequest.getFormId());
        if (form.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (formService.isContain(form.get().getOwnerEmail(), patchFormRequest.getFormName())){
            return new ResponseEntity<>("Название формы не уникальное", HttpStatus.BAD_REQUEST);
        }

        return formService.updateForm(patchFormRequest.getFormId(), patchFormRequest.getFormName(), patchFormRequest.getTableName());
    }


    @DeleteMapping("/form/redactors")
    public ResponseEntity<HttpStatus> deleteRedactor(
            @RequestBody DeleteRedactorsRequest deleteRedactorsRequest
            ){
        return formService.deleteRedactor(deleteRedactorsRequest.getUserMail(), deleteRedactorsRequest.getFormId());
    }

    @PatchMapping("/redactors")
    public ResponseEntity<HttpStatus> patchRedactors(
            @RequestBody PatchRedactorsRequest request
            ) {
        return formService.patchRedactors(request.getFormId(), request.getRedactors());
    }

    /*
    @GetMapping("/redactors/{id}")
    public ResponseEntity<List<UserResponse>> getRedactors(
            @PathVariable @Parameter(description = "id таблицы", required = true) String id
    ) {
        return getUsersNoOwner(id);
    }

     */

    @GetMapping("/export")
    public ResponseEntity<byte[]> getData() {
        return formService.exportData();
    }

    @PostMapping("/import")
    public ResponseEntity<HttpStatus> importData(@RequestParam("jsonFile")MultipartFile file) throws IOException {
       formService.importData(file);
       return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
