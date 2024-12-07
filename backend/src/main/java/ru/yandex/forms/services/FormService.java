package ru.yandex.forms.services;

import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.repositories.FormRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class FormService {

    private final FormRepository formRepository;

    private static final String UPLOAD_DIR = "./uploads/tables/";

    @Autowired
    public FormService(FormRepository formRepository) {
        this.formRepository = formRepository;
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


    public List<Form> getFormsSearch(String tableName, String date, String owner, String redactor){
        return formRepository.findByNameLikeIgnoreCaseAndOwnerEmailLikeIgnoreCaseAndRedactorsContainsIgnoreCaseAndDateLikeIgnoreCase(
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
