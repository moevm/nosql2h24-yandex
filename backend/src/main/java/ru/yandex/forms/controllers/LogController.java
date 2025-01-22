package ru.yandex.forms.controllers;

import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.yandex.forms.model.Log;
import ru.yandex.forms.response.FormPaginationResponse;
import ru.yandex.forms.response.LogPaginationResponse;
import ru.yandex.forms.services.LogService;

@RestController
@RequestMapping("/logs")
public class LogController {

    private final LogService logService;

    @Autowired
    public LogController(LogService logService) {
        this.logService = logService;
    }

    @GetMapping
    public ResponseEntity<LogPaginationResponse> getLogs(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size
    ){

        return ResponseEntity.ok(logService.getLogsPagination(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Log> getLogById(
            @PathVariable String id
    ){
        return logService.getLogById(id);
    }

    @GetMapping("/search")
    public ResponseEntity<LogPaginationResponse> getLogsSearch(
            @RequestParam(value = "edit_action", required = false, defaultValue = "") String editAction,
            @RequestParam(value = "edit_mail", required = false, defaultValue = "") String editMail,
            @RequestParam(value = "from_date", required = false, defaultValue = "") String fromDate,
            @RequestParam(value = "to_date", required = false, defaultValue = "") String toDate,
            @RequestParam(value = "event_type", required = false, defaultValue = "") String eventType,
            @RequestParam(value = "form_id", required = false, defaultValue = "") String formId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size
    ) {
        return ResponseEntity.ok(logService.getLogsSearch(editAction, editMail, fromDate, toDate, eventType, formId, page, size));
    }
}
