package learn.field_agent.controllers;

import learn.field_agent.domain.AliasService;
import learn.field_agent.domain.Result;
import learn.field_agent.domain.ResultType;
import learn.field_agent.models.Alias;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/alias")
public class AliasController {

    private final AliasService service;

    public AliasController(AliasService service) {
        this.service = service;
    }

    @GetMapping
    public List<Alias> findAll() { return service.findAll(); }

    @GetMapping("/aliasId/{aliasId}")
    public ResponseEntity<Alias> findById(@PathVariable int aliasId) {
        Alias alias = service.findById(aliasId);
        if (alias == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(alias, HttpStatus.OK);
    }

    @GetMapping("/agentId/{agentId}")
    public List<Alias> findAliasesByAgentId(@PathVariable int agentId) { return service.findAliasesByAgentId(agentId); }

    @PostMapping
    public ResponseEntity<Alias> add(@RequestBody Alias alias) {
        Result<Alias> result = service.add(alias);
        if (result.getType() == ResultType.INVALID) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/{aliasId}")
    public ResponseEntity<Void> update(@PathVariable int aliasId, @RequestBody Alias alias) {
        if (aliasId != alias.getAliasId()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Result<Alias> result = service.update(alias);
        if (result.getType() == ResultType.INVALID) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (result.getType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{aliasId}")
    public ResponseEntity<Void> delete(@PathVariable int aliasId) {
        if (service.deleteById(aliasId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
