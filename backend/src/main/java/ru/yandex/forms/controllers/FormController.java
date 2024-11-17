package ru.yandex.forms.controllers;

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
public class FormController {

    private final FormRepository formRepository;

    private final FormService formService;

    private final ModelMapper modelMapper = new ModelMapper();

    public FormController(FormRepository formRepository, FormService formService) {
        this.formRepository = formRepository;
        this.formService = formService;
    }

    @GetMapping("/{mail}")
    public ResponseEntity<List<Form>> getForms(@PathVariable String mail){
        List<Form> forms = new ArrayList<>();
        forms.addAll(formRepository.findByOwnerEmail(mail));
        forms.addAll(formRepository.findFormsByRedactorMail(mail));
        return ResponseEntity.ok(forms);
    }

    @PostMapping("/create-form")
    public ResponseEntity<Form> createForm(@RequestBody FormRequest formRequest){
        Form form = new Form();

        form.setOwnerEmail(formRequest.getOwnerMail());
        form.setName(formRequest.getName());

        return ResponseEntity.ok(formRepository.save(form));

    }

    @GetMapping("/table/{id}")
    public ResponseEntity<byte[]> getTable(@PathVariable String id){
        return formService.getTable(id);
    }


}
