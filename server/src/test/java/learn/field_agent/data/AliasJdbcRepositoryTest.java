package learn.field_agent.data;

import learn.field_agent.models.Alias;
import learn.field_agent.models.Location;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class AliasJdbcRepositoryTest {

    @Autowired
    AliasJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindAll() {
        List<Alias> all = repository.findAll();
        assertEquals(all.size(), 2);
    }

    @Test
    void shouldFindById() {
        Alias actual = repository.findById(1);
        assertNotNull(actual);
        assertEquals(1, actual.getAliasId());
    }

    @Test
    void shouldFindAliasByAgentId() {
        List<Alias> matches = repository.findAliasesByAgentId(1);
        assertNotNull(matches);
    }

    @Test
    void shouldAdd() {
        Alias alias = new Alias(3, "Billy bob", "country boi", 1);
        Alias actual = repository.add(alias);
        assertNotNull(actual);
        assertEquals(3, actual.getAliasId());
    }

    @Test
    void shouldUpdate() {
        Alias alias = new Alias(3, "Billy joel", "country singer", 1);
        assertTrue(repository.update(alias));
        alias.setAliasId(16);
        assertFalse(repository.update(alias));
    }

    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(2));
        assertFalse(repository.deleteById(53498));
    }
}