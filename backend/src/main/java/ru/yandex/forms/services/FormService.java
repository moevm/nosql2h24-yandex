package ru.yandex.forms.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.model.User;
import ru.yandex.forms.repositories.FormRepository;
import ru.yandex.forms.repositories.UserRepository;
import ru.yandex.forms.model.ImportExport;
import ru.yandex.forms.response.FormPaginationResponse;
import ru.yandex.forms.response.UserResponse;
import ru.yandex.forms.serializer.InstantDeserializer;
import ru.yandex.forms.serializer.InstantSerializer;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FormService {

    private final FormRepository formRepository;

    private final UserRepository userRepository;

    private final LogService logService;

    private static final String UPLOAD_DIR = "./uploads/tables/";

    @Autowired
    public FormService(FormRepository formRepository, UserRepository userRepository, LogService logService) {
        this.formRepository = formRepository;
        this.userRepository = userRepository;
        this.logService = logService;
    }

    @Transactional
    public ResponseEntity<byte[]> getTable(String id){
        try {

            Optional<Form> optionalForm = formRepository.findById(id);

            if (optionalForm.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Form form = optionalForm.get();

            Path tablePath = Paths.get(form.getPath());
            File tableFile = tablePath.toFile();

            if (!tableFile.exists()){
                log.info(String.valueOf(tablePath.toAbsolutePath()));
                log.info(tablePath.toString());
                log.warn("Table was not found");
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            byte[] tableBytes = Files.readAllBytes(tablePath);

            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(getMediaType(form.getPath()));

            logService.createLog("Отправлена " + tablePath.toFile().getName() + " таблица", "Отправка", form.getOwnerEmail(), form.getId());

            return ResponseEntity.ok().headers(httpHeaders).body(tableBytes);

        }
        catch (IOException e) {
            log.error("File read error: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void createXlsxFile(String filename){
        File file = new File("./backend/uploads/tables/" + filename + ".xlsx");
        try {
            file.createNewFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean isTableExist(String filename){

        Path tablePath = Paths.get("./backend/uploads/tables/" + filename + ".xlsx");
        File tableFile = tablePath.toFile();

        return tableFile.exists();
    }

    public ResponseEntity<byte[]> exportData(){
        List<Form> forms = formRepository.findAll();
        List<User> users = userRepository.findAll();


        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Instant.class, new InstantSerializer())
                .create();
        String json = gson.toJson(ImportExport.builder()
                        .forms(forms)
                        .users(users)
                .build());
        byte[] bytes = json.getBytes();

            logService.createLog("Экспорт", "Экспорт", "", "");
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=data.json")
                    .contentType(MediaType.APPLICATION_JSON)
                    .contentLength(bytes.length)
                    .body(bytes);
    }

    public void importData(MultipartFile file) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        String line;
        StringBuilder content = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            content.append(line);
        }
        reader.close();

        String jsonContent = content.toString();

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Instant.class, new InstantDeserializer())
                .create();
        ImportExport request = gson.fromJson(jsonContent, ImportExport.class);

        formRepository.deleteAll();
        userRepository.deleteAll();
        formRepository.saveAll(request.getForms());
        userRepository.saveAll(request.getUsers());

        logService.createLog("Импорт", "Импорт", "", "");
    }

    public ResponseEntity<HttpStatus> patchRedactors(String formId, List<String> redactors){
        Optional<Form> form = formRepository.findById(formId);
        if (form.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        form.get().setRedactors(redactors);
        formRepository.save(form.get());

        logService.createLog("Добавление таблице новых редакторов: " + redactors.toString(), "Исправление", form.get().getOwnerEmail(), formId);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }


    public FormPaginationResponse getFormsSearch(String tableName, String fromDate, String toDate, String owner, String redactor, Integer page, Integer size){
        Pageable pageable = PageRequest.of(page, size);
        if (fromDate.isBlank()){
            fromDate = "1000-12-20";
        }
        if (toDate.isBlank()){
            toDate = "3000-12-20";
        }
        if (Objects.equals(redactor, "")){
            Page<Form> formsPage = formRepository.findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndDateBetween(
                    tableName, owner, convertDate(fromDate), convertDate(toDate), pageable
            );
            return FormPaginationResponse.builder()
                    .forms(formsPage.getContent())
                    .size(size)
                    .page(page)
                    .totalPage(formsPage.getTotalPages())
                    .totalCount((int) formsPage.getTotalElements())
                    .build();
        }
        else {
            Page<Form> formsPage = formRepository.findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndRedactorsContainsIgnoreCaseAndDateBetweenIgnoreCase(
                    tableName, owner, redactor, convertDate(fromDate), convertDate(toDate), pageable
            );
            return FormPaginationResponse.builder()
                    .forms(formsPage.getContent())
                    .size(size)
                    .page(page)
                    .totalPage(formsPage.getTotalPages())
                    .totalCount((int) formsPage.getTotalElements())
                    .build();
        }

    }

    public FormPaginationResponse getFormsPageable(Integer page, Integer size, String mail){
        Pageable pageable = PageRequest.of(page, size);

        Page<Form> formsPage = formRepository.findFormsByRedactorsContainsOrOwnerEmail(List.of(mail), mail, pageable);

        return FormPaginationResponse.builder()
                .forms(formsPage.getContent())
                .size(size)
                .page(page)
                .totalPage(formsPage.getTotalPages())
                .totalCount((int) formsPage.getTotalElements())
                .build();
    }

    @Transactional
    public ResponseEntity<List<UserResponse>> getUsersNoOwner(String formId){
        Optional<Form> form = formRepository.findById(formId);
        if (form.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(user -> !Objects.equals(user.getEmail(), form.get().getOwnerEmail()))
                .map(user -> UserResponse.builder()
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList())
        );
    }
    @Transactional
    public ResponseEntity<HttpStatus> deleteForm(String id){
        Optional<Form> form = formRepository.findById(id);

        if (form.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        formRepository.delete(form.get());
        logService.createLog("Удаление формы с id: " + id, "Удаление", form.get().getOwnerEmail(), form.get().getId());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @Transactional
    public ResponseEntity<String> updateForm(String formId, String formName, String tableName){
        Optional<Form> form = formRepository.findById(formId);

        if (form.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (isContain(form.get().getOwnerEmail(), formName)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        form.get().setName(formName);
        form.get().setTableName(tableName);
        if (!isTableExist(tableName)){
            createXlsxFile(tableName);
        }
        form.get().setPath("./backend/uploads/tables/" + tableName + ".xlsx");

        formRepository.save(form.get());
        logService.createLog("Изменение формы с id: " + formId, "Изменение", form.get().getOwnerEmail(), formId);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }


    @Transactional
    public ResponseEntity<HttpStatus> deleteRedactor(String mail, String formId){
        Optional<Form> form = formRepository.findById(formId);
        if (form.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        form.get().setRedactors(form.get().getRedactors().stream().filter(
                red -> !red.equals(mail)
        )
                .collect(Collectors.toList()));
        formRepository.save(form.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private MediaType getMediaType(String filePath) {
        if (filePath.endsWith(".xlsx")) {
            return MediaType.MULTIPART_FORM_DATA;
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    private Instant convertDate(String date){
        String pattern = "yyyy-MM-dd HH:mm:ss";
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(pattern, Locale.UK);
        LocalDateTime localDateTime = LocalDateTime.parse(date + " 00:00:00", dateTimeFormatter);
        ZoneId zoneId = ZoneId.of("UTC");
        ZonedDateTime zonedDateTime = localDateTime.atZone(zoneId);
        return zonedDateTime.toInstant();
    }

    public boolean isContain(String userMail, String formName){
        Optional<Form> form = formRepository.findByOwnerEmailAndName(userMail, formName);
        return form.isPresent();
    }

}
