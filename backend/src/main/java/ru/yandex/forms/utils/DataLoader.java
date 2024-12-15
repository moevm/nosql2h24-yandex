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

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class DataLoader implements ApplicationRunner {

    private final UserRepository userRepository;

    private final FormRepository formRepository;

    private static final String SASHA_MAIL = "sashaOwner@mail.ru";

    private static final String SENYA_MAIL = "senyaRedactor@mail.ru";

    private static final String VLAS_MAIL = "vlasovikZateinik@mail.ru";

    private static final String DENIS_MAIL = "denzel@mail.ru";

    private static final String ALISA_MAIL = "lisa228@mail.ru";

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
        if (userRepository.findByEmail(VLAS_MAIL).isEmpty()){
            User userVlas = new User();
            userVlas.setEmail(VLAS_MAIL);
            userRepository.save(userVlas);
        }
        if (userRepository.findByEmail(DENIS_MAIL).isEmpty()){
            User userDenis = new User();
            userDenis.setEmail(DENIS_MAIL);
            userRepository.save(userDenis);
        }
        if (userRepository.findByEmail(ALISA_MAIL).isEmpty()){
            User userAlisa = new User();
            userAlisa.setEmail(ALISA_MAIL);
            userRepository.save(userAlisa);
        }
    }

    private void formsCreation(){

        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/1").isEmpty()){
            Form form1 = new Form();
            form1.setName("Домашние животные/1");
            form1.setTableName("form1");
            form1.setOwnerEmail(SASHA_MAIL);
            form1.setRedactors(List.of(SENYA_MAIL));
            form1.setPath("./backend/uploads/tables/" + form1.getTableName() + ".xlsx");
            form1.setDate(Instant.parse("2024-12-12T15:36:50.357Z"));
            formRepository.save(form1);

        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/2").isEmpty()){
            Form form2 = new Form();
            form2.setName("Домашние животные/2");
            form2.setTableName("form2");
            form2.setOwnerEmail(SASHA_MAIL);
            form2.setRedactors(List.of(SENYA_MAIL, ALISA_MAIL, DENIS_MAIL));
            form2.setPath("./backend/uploads/tables/" + form2.getTableName() + ".xlsx");
            form2.setDate(Instant.parse("2024-12-09T15:36:50.357Z"));
            formRepository.save(form2);
        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/3").isEmpty()){
            Form form3 = new Form();
            form3.setName("Домашние животные/3");
            form3.setTableName("form3");
            form3.setOwnerEmail(SASHA_MAIL);
            form3.setRedactors(List.of(SENYA_MAIL, VLAS_MAIL));
            form3.setPath("./backend/uploads/tables/" + form3.getTableName() + ".xlsx");
            form3.setDate(Instant.parse("2024-12-01T15:36:50.357Z"));
            formRepository.save(form3);
        }
    }
}
