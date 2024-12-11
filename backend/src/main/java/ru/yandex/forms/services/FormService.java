package ru.yandex.forms.services;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import com.google.gson.reflect.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class FormService {

    private final FormRepository formRepository;

    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "./uploads/tables/";

    @Autowired
    public FormService(FormRepository formRepository, UserRepository userRepository) {
        this.formRepository = formRepository;
        this.userRepository = userRepository;
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

            return ResponseEntity.ok().headers(httpHeaders).body(tableBytes);

        }
        catch (IOException e) {
            log.error("File read error: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<byte[]> exportData(){
        List<Form> forms = formRepository.findAll();
        List<User> users = userRepository.findAll();


        Gson gson = new Gson();
        String json = gson.toJson(ImportExport.builder()
                        .forms(forms)
                        .users(users)
                .build());
        byte[] bytes = json.getBytes();

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
        ImportExport request = new Gson().fromJson(jsonContent, ImportExport.class);

        formRepository.deleteAll();
        userRepository.deleteAll();
        formRepository.saveAll(request.getForms());
        userRepository.saveAll(request.getUsers());
    }


    public List<Form> getFormsSearch(String tableName, String date, String owner, String redactor){
        return formRepository.findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndRedactorsContainsIgnoreCaseOrRedactorsIsNullAndDateLikeIgnoreCase(
                tableName, owner, redactor, date
        );
    }

    private MediaType getMediaType(String filePath) {
        if (filePath.endsWith(".xlsx")) {
            return MediaType.MULTIPART_FORM_DATA;
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }

}
