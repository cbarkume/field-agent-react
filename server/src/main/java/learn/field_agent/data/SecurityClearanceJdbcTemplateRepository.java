package learn.field_agent.data;

import learn.field_agent.data.mappers.SecurityClearanceMapper;
import learn.field_agent.domain.Result;
import learn.field_agent.models.AgencyAgent;
import learn.field_agent.models.SecurityClearance;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Statement;
import java.util.List;

@Repository
public class SecurityClearanceJdbcTemplateRepository implements SecurityClearanceRepository {

    private final JdbcTemplate jdbcTemplate;

    public SecurityClearanceJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<SecurityClearance> findAll() {
        final String sql = "select security_clearance_id, `name` security_clearance_name " +
                "from security_clearance;";
        return jdbcTemplate.query(sql, new SecurityClearanceMapper());
    }

    @Override
    public SecurityClearance findById(int securityClearanceId) {
        final String sql = "select security_clearance_id, name security_clearance_name "
                + "from security_clearance "
                + "where security_clearance_id = ?;";
        try {
            return jdbcTemplate.queryForObject(sql, new SecurityClearanceMapper(), securityClearanceId);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public SecurityClearance add(SecurityClearance sc) {
        if (sc.getName() == null) {
            return null;
        }

        final String sql = "insert into security_clearance (`name`) values (?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, sc.getName());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        sc.setSecurityClearanceId(keyHolder.getKey().intValue());
        return sc;
    }

    @Override
    public boolean update(SecurityClearance sc) {
        if (sc.getName() == null) {
            return false;
        }

        final String sql = "update security_clearance set "
                + "`name` = ? "
                + "where security_clearance_id = ?;";

        int rowsUpdated = jdbcTemplate.update(sql,
                sc.getName(), sc.getSecurityClearanceId());

        return rowsUpdated > 0;
    }

    @Override
    public boolean deleteById(int id) {
        final AgencyAgentJdbcTemplateRepository agencyAgentRepo = new AgencyAgentJdbcTemplateRepository(jdbcTemplate);
        List<AgencyAgent> all = agencyAgentRepo.findAll();
        for (AgencyAgent a : all) {
            if (a.getSecurityClearance().getSecurityClearanceId() == id) {
                return false;
            }
        }

        final String sql = "delete from security_clearance where security_clearance_id = ?;";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
