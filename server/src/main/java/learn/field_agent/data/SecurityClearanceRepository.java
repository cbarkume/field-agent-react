package learn.field_agent.data;

import learn.field_agent.domain.Result;
import learn.field_agent.models.SecurityClearance;

import java.util.List;

public interface SecurityClearanceRepository {
    List<SecurityClearance> findAll();

    SecurityClearance findById(int securityClearanceId);

    SecurityClearance add(SecurityClearance sc);

    boolean update(SecurityClearance sc);

    boolean deleteById(int id);

}
