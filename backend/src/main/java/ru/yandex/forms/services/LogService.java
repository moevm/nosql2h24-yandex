package ru.yandex.forms.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.yandex.forms.model.Form;
import ru.yandex.forms.model.Log;
import ru.yandex.forms.repositories.LogRepository;
import ru.yandex.forms.response.FormPaginationResponse;
import ru.yandex.forms.response.LogPaginationResponse;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
@Slf4j
public class LogService {

    private final LogRepository logRepository;

    @Autowired
    public LogService(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public void createLog(String editAction, String eventType, String mail, String formId){
        Log log = new Log();
        log.setEditAction(editAction);
        log.setEditTime(Instant.now());
        log.setEventType(eventType);
        log.setEditEmail(mail);
        log.setFormId(formId);
        logRepository.save(log);
    }

    public LogPaginationResponse getLogsPagination(Integer page,Integer size){

        Pageable pageable = PageRequest.of(page, size);

        Page<Log> logPage = logRepository.findAll(pageable);

        return LogPaginationResponse.builder()
                .logs(logPage.getContent())
                .size(size)
                .page(page)
                .totalPage(logPage.getTotalPages())
                .totalCount((int) logPage.getTotalElements())
                .build();

    }
    public LogPaginationResponse getLogsSearch(String editAction, String editEmail, String fromDate, String toDate, String eventType, Integer page, Integer size){
        Pageable pageable = PageRequest.of(page, size);
        if (fromDate.isBlank()){
            fromDate = "1000-12-20";
        }
        if (toDate.isBlank()){
            toDate = "3000-12-20";
        }
            Page<Log> logsPage = logRepository.findByEditActionLikeIgnoreCaseAndEditEmailLikeIgnoreCaseAndEditTimeBetweenAndEventTypeLikeIgnoreCase(
                    editAction, editEmail, convertDate(fromDate), convertDate(toDate), eventType, pageable
            );
            return LogPaginationResponse.builder()
                    .logs(logsPage.getContent())
                    .size(size)
                    .page(page)
                    .totalPage(logsPage.getTotalPages())
                    .totalCount((int) logsPage.getTotalElements())
                    .build();

    }
    private Instant convertDate(String date){
        String pattern = "yyyy-MM-dd HH:mm:ss";
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(pattern, Locale.UK);
        LocalDateTime localDateTime = LocalDateTime.parse(date + " 00:00:00", dateTimeFormatter);
        ZoneId zoneId = ZoneId.of("UTC");
        ZonedDateTime zonedDateTime = localDateTime.atZone(zoneId);
        return zonedDateTime.toInstant();
    }
}
