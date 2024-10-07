package ru.yandex.forms.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.yandex.forms.model.TestModel;
import ru.yandex.forms.repositories.TestRepository;

import java.util.List;

@RestController
public class TestController {

    private final TestRepository testRepository;

    @Autowired
    public TestController(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @PostMapping("/save")
    public TestModel saveModel(@RequestBody TestModel testModel){
        return testRepository.save(testModel);

    }

    @GetMapping("/index")
    public List<TestModel> findAll(){
        return testRepository.findAll();
    }

}
