package learn.field_agent.controllers;

import learn.field_agent.domain.Result;
import learn.field_agent.domain.ResultType;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLException;

@ControllerAdvice
public class GlobalExceptionHandler {

    Result<Void> result = new Result();

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Object> handleException(RuntimeException ex) {
        result.addMessage("We can't show you the details, but something went wrong in our database. Sorry :[",
                ResultType.INVALID);
        return ErrorResponse.build(result);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleException(SQLException ex) {
        result.addMessage(ex.getMessage(),
                ResultType.INVALID);
        return ErrorResponse.build(result);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex) {
        result.addMessage("Something went wrong on our end! :[",
                ResultType.INVALID);
        return ErrorResponse.build(result);
    }
}