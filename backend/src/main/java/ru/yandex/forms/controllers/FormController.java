package ru.yandex.forms.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.repositories.FormRepository;
import ru.yandex.forms.requests.FormRequest;

import java.util.List;

@RestController
@RequestMapping("/forms")
public class FormController {

    private final FormRepository formRepository;

    private final ModelMapper modelMapper = new ModelMapper();

    public FormController(FormRepository formRepository) {
        this.formRepository = formRepository;
    }

    @GetMapping("/{mail}")
    public ResponseEntity<List<Form>> getForms(@PathVariable String mail){
        return ResponseEntity.ok(formRepository.findByOwnerEmail(mail));
    }

    @PostMapping("/create-form")
    public ResponseEntity<Form> createForm(@RequestBody FormRequest formRequest){
        Form form = new Form();
        form.setOwnerEmail(formRequest.getOwnerMail());
        form.setName(formRequest.getName());
        return ResponseEntity.ok(formRepository.save(form));

    }

}
