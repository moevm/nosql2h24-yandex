package ru.yandex.forms.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Component;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.model.User;
import ru.yandex.forms.repositories.FormRepository;
import ru.yandex.forms.repositories.UserRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class DataLoader implements ApplicationRunner {

    private final UserRepository userRepository;

    private final FormRepository formRepository;

    private static final String SASHA_MAIL = "sashaOwner@mail.ru";

    private static final String SENYA_MAIL = "senyaRedactor@mail.ru";

    @Autowired
    public DataLoader(UserRepository userRepository, FormRepository formRepository) {
        this.userRepository = userRepository;
        this.formRepository = formRepository;
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        formRepository.deleteAll();
        userRepository.deleteAll();
        userCreation();

        formsCreation();


    }

    private void userCreation(){
        if (userRepository.findByEmail(SASHA_MAIL).isEmpty()){
            User userSasha = new User();
            userSasha.setEmail(SASHA_MAIL);
            userRepository.save(userSasha);
        }
        if (userRepository.findByEmail(SENYA_MAIL).isEmpty()){
            User userSenya = new User();
            userSenya.setEmail(SENYA_MAIL);
            userRepository.save(userSenya);
        }
    }

    private void formsCreation(){

        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "form1").isEmpty()){
            Form form1 = new Form();
            form1.setName("form1");
            form1.setOwnerEmail(SASHA_MAIL);
            form1.setRedactors(List.of(SENYA_MAIL));
            form1.setPath("./backend/uploads/tables/form1.xlsx");
            formRepository.save(form1);

        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "form2").isEmpty()){
            Form form2 = new Form();
            form2.setName("form2");
            form2.setOwnerEmail(SASHA_MAIL);
            form2.setRedactors(List.of(SENYA_MAIL));
            form2.setPath("./backend/uploads/tables/form2.xlsx");
            formRepository.save(form2);
        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "form3").isEmpty()){
            Form form3 = new Form();
            form3.setName("form3");
            form3.setOwnerEmail(SASHA_MAIL);
            form3.setRedactors(List.of(SENYA_MAIL));
            form3.setPath("./backend/uploads/tables/form3.xlsx");
            formRepository.save(form3);
        }
    }
}
