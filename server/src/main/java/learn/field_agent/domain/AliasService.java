package learn.field_agent.domain;

import learn.field_agent.data.AgentRepository;
import learn.field_agent.data.AliasRepository;
import learn.field_agent.data.LocationRepository;
import learn.field_agent.models.Alias;
import learn.field_agent.models.Location;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AliasService {

    private final AliasRepository repository;
    private final AgentRepository agentRepository;

    public AliasService(AliasRepository repository, AgentRepository agentRepository) {
        this.repository = repository;
        this.agentRepository = agentRepository;
    }

    public List<Alias> findAll() {
        return repository.findAll();
    }

    public Alias findById(int id) {
        return repository.findById(id);
    }

    public List<Alias> findAliasesByAgentId(int agentId) { return repository.findAliasesByAgentId(agentId);}

    public Result<Alias> add(Alias alias) {
        Result<Alias> result = validate(alias);
        if (!result.isSuccess()) {
            return result;
        }

        if (alias.getAliasId() != 0) {
            result.addMessage("aliasId cannot be set for `add` operation", ResultType.INVALID);
            return result;
        }

        alias = repository.add(alias);
        result.setPayload(alias);
        return result;
    }

    public Result<Alias> update(Alias alias) {
        Result<Alias> result = validate(alias);
        if (!result.isSuccess()) {
            return result;
        }

        if (alias.getAliasId() <= 0) {
            result.addMessage("AliasId must be set for `update` operation", ResultType.INVALID);
            return result;
        }

        if (!repository.update(alias)) {
            String msg = String.format("aliasId: %s, not found", alias.getAliasId());
            result.addMessage(msg, ResultType.NOT_FOUND);
        }

        return result;
    }

    public boolean deleteById(int id) {
        return repository.deleteById(id);
    }

    private Result<Alias> validate(Alias alias) {
        Result<Alias> result = new Result<>();

        if (alias == null) {
            result.addMessage("alias cannot be null", ResultType.INVALID);
            return result;
        }

        if (Validations.isNullOrBlank(alias.getName())) {
            result.addMessage("name is required", ResultType.INVALID);
            return result;
        }

        if (Validations.isNullOrBlank(alias.getPersona())) {
            for (Alias a : findAll()) {
                if (a.getName().equals(alias.getName())) {
                    result.addMessage("persona is required when name is duplicated", ResultType.INVALID);
                }
            }
        }

        if (agentRepository.findById(alias.getAgentId()) == null) {
            result.addMessage("Not a valid agent ID", ResultType.INVALID);
        }

        return result;
    }
}
