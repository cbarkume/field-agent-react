package learn.field_agent.data;

import learn.field_agent.models.SecurityClearance;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class SecurityClearanceJdbcTemplateRepositoryTest {

    @Autowired
    SecurityClearanceJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindAll() {
        List<SecurityClearance> all = repository.findAll();
        assertEquals(all.size(), 3);
    }

    @Test
    void shouldFindById() {
        SecurityClearance secret = new SecurityClearance(1, "Secret");
        SecurityClearance topSecret = new SecurityClearance(2, "Top Secret");

        SecurityClearance actual = repository.findById(1);
        assertEquals(secret, actual);

        actual = repository.findById(2);
        assertEquals(topSecret, actual);

        actual = repository.findById(3000);
        assertEquals(null, actual);
    }

    @Test
    void shouldAdd() {
        SecurityClearance secretIn = new SecurityClearance(0, "Way past secret");
        SecurityClearance secretOut = new SecurityClearance(3, "Way past secret");
        SecurityClearance actual = repository.add(secretIn);
        assertTrue(secretOut.equals(actual));

        secretIn = new SecurityClearance(2, null);
        actual = repository.add(secretIn);
        assertNull(actual);
    }

    @Test
    void shouldUpdate() {
        SecurityClearance secret = new SecurityClearance(2, "Way too secret");
        assertTrue(repository.update(secret));

        secret = new SecurityClearance(200, "Way too secret");
        assertFalse(repository.update(secret));

        secret = new SecurityClearance(2, null);
        assertFalse(repository.update(secret));


    }

    @Test
    void shouldDeleteById() {
        assertTrue(repository.deleteById(3));
        assertFalse(repository.deleteById(1));
        assertFalse(repository.deleteById(202049));
    }
}
