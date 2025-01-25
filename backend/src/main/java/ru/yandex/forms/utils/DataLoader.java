package ru.yandex.forms.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.model.Log;
import ru.yandex.forms.model.User;
import ru.yandex.forms.repositories.FormRepository;
import ru.yandex.forms.repositories.LogRepository;
import ru.yandex.forms.repositories.UserRepository;
import ru.yandex.forms.services.LogService;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@Slf4j
public class DataLoader implements ApplicationRunner {

    private final UserRepository userRepository;

    private final FormRepository formRepository;

    private final LogRepository logRepository;

    private final LogService logService;

    private static final String SASHA_MAIL = "sashaOwner@mail.ru";

    private static final String SENYA_MAIL = "senyaRedactor@mail.ru";

    private static final String VLAS_MAIL = "vlasovikZateinik@mail.ru";

    private static final String DENIS_MAIL = "denzel@mail.ru";

    private static final String ALISA_MAIL = "lisa228@mail.ru";

    @Autowired
    public DataLoader(UserRepository userRepository, FormRepository formRepository, LogRepository logRepository, LogService logService) {
        this.userRepository = userRepository;
        this.formRepository = formRepository;
        this.logRepository = logRepository;
        this.logService = logService;
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        formRepository.deleteAll();
        userRepository.deleteAll();
        logRepository.deleteAll();

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

    private void formsCreation() {

        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/1").isEmpty()) {
            Form form1 = new Form();
            form1.setName("Домашние животные/1");
            form1.setTableName("form1");
            form1.setOwnerEmail(SASHA_MAIL);
            form1.setRedactors(List.of(SENYA_MAIL));

            form1.setPath("./backend/uploads/tables/" + form1.getTableName() + ".xlsx");
            form1.setDate(Instant.parse("2024-12-12T15:36:50.357Z"));
            form1 = formRepository.save(form1);
            logService.createLog("Добавление таблице новых редакторов: " + form1.getRedactors().toString(), "Исправление", form1.getOwnerEmail(), form1.getId(), Instant.now().minus(40, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form1.getId(), "Изменение", form1.getOwnerEmail(), form1.getId(), Instant.now().minus(40, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form1.getId(), "Изменение", form1.getOwnerEmail(), form1.getId(), Instant.now().minus(40, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form1.getId(), "Изменение", form1.getOwnerEmail(), form1.getId(), Instant.now().minus(40, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form1.getId(), "Изменение", form1.getOwnerEmail(), form1.getId(), Instant.now().minus(40, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form1.getId(), "Изменение", form1.getOwnerEmail(), form1.getId(), Instant.now().minus(55, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form1.getId(), "Изменение", form1.getOwnerEmail(), form1.getId(), Instant.now().minus(55, ChronoUnit.DAYS));

            logService.createLog("Экспорт", "Экспорт", "", "", Instant.now().minus(66, ChronoUnit.DAYS));
            logService.createLog("Экспорт", "Экспорт", "", "", Instant.now().minus(66, ChronoUnit.DAYS));
            logService.createLog("Экспорт", "Экспорт", "", "", Instant.now().minus(66, ChronoUnit.DAYS));

            logService.createLog("Импорт", "Импорт", "", "", Instant.now().minus(70, ChronoUnit.DAYS));
            logService.createLog("Импорт", "Импорт", "", "", Instant.now().minus(70, ChronoUnit.DAYS));
            logService.createLog("Импорт", "Импорт", "", "", Instant.now().minus(70, ChronoUnit.DAYS));
            logService.createLog("Импорт", "Импорт", "", "", Instant.now().minus(71, ChronoUnit.DAYS));

            logService.createLog("Удаление формы", "Удаление", form1.getOwnerEmail(), "6794ee2cbe062cw8b22943fb3", Instant.now().minus(71, ChronoUnit.DAYS));

        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/2").isEmpty()) {
            Form form2 = new Form();
            form2.setName("Домашние животные/2");
            form2.setTableName("form2");
            form2.setOwnerEmail(SASHA_MAIL);
            form2.setRedactors(List.of(SENYA_MAIL, ALISA_MAIL, DENIS_MAIL));
            form2.setPath("./backend/uploads/tables/" + form2.getTableName() + ".xlsx");
            form2.setDate(Instant.parse("2024-12-09T15:36:50.357Z"));
            form2 = formRepository.save(form2);
            logService.createLog("Добавление таблице новых редакторов: " + form2.getRedactors().toString(), "Исправление", form2.getOwnerEmail(), form2.getId(), Instant.now().minus(86, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form2.getId(), "Изменение", form2.getOwnerEmail(), form2.getId(), Instant.now().minus(86, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form2.getId(), "Изменение", form2.getOwnerEmail(), form2.getId(), Instant.now().minus(86, ChronoUnit.DAYS));
        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/3").isEmpty()) {
            Form form3 = new Form();
            form3.setName("Домашние животные/3");
            form3.setTableName("form3");
            form3.setOwnerEmail(SASHA_MAIL);
            form3.setRedactors(List.of(SENYA_MAIL, VLAS_MAIL));
            form3.setPath("./backend/uploads/tables/" + form3.getTableName() + ".xlsx");
            form3.setDate(Instant.parse("2024-12-01T15:36:50.357Z"));
            form3 = formRepository.save(form3);
            logService.createLog("Добавление таблице новых редакторов: " + form3.getRedactors().toString(), "Исправление", form3.getOwnerEmail(), form3.getId(), Instant.now().minus(87, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form3.getId(), "Изменение", form3.getOwnerEmail(), form3.getId(), Instant.now().minus(87, ChronoUnit.DAYS));
            logService.createLog("Изменение формы с id: " + form3.getId(), "Изменение", form3.getOwnerEmail(), form3.getId(), Instant.now().minus(87, ChronoUnit.DAYS));
        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/4").isEmpty()) {
            Form form3 = new Form();
            form3.setName("Домашние животные/4");
            form3.setTableName("form4");
            form3.setOwnerEmail(SASHA_MAIL);
            form3.setRedactors(List.of(SENYA_MAIL, VLAS_MAIL));
            form3.setPath("./backend/uploads/tables/" + form3.getTableName() + ".xlsx");
            form3.setDate(Instant.parse("2024-12-01T15:36:50.357Z"));
            formRepository.save(form3);
        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/5").isEmpty()) {
            Form form3 = new Form();
            form3.setName("Домашние животные/5");
            form3.setTableName("form5");
            form3.setOwnerEmail(SASHA_MAIL);
            form3.setRedactors(List.of(SENYA_MAIL, VLAS_MAIL));
            form3.setPath("./backend/uploads/tables/" + form3.getTableName() + ".xlsx");
            form3.setDate(Instant.parse("2024-12-01T15:36:50.357Z"));
            formRepository.save(form3);
        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/6").isEmpty()) {
            Form form3 = new Form();
            form3.setName("Домашние животные/6");
            form3.setTableName("form6");
            form3.setOwnerEmail(SASHA_MAIL);
            form3.setRedactors(List.of(SENYA_MAIL, VLAS_MAIL));
            form3.setPath("./backend/uploads/tables/" + form3.getTableName() + ".xlsx");
            form3.setDate(Instant.parse("2024-12-01T15:36:50.357Z"));
            formRepository.save(form3);
        }
        if (formRepository.findByOwnerEmailAndName(SASHA_MAIL, "Домашние животные/7").isEmpty()) {
            Form form3 = new Form();
            form3.setName("Домашние животные/7");
            form3.setTableName("form7");
            form3.setOwnerEmail(SASHA_MAIL);
            form3.setRedactors(List.of(SENYA_MAIL, VLAS_MAIL));
            form3.setPath("./backend/uploads/tables/" + form3.getTableName() + ".xlsx");
            form3.setDate(Instant.parse("2024-12-01T15:36:50.357Z"));
            formRepository.save(form3);
        }
    }
}
