package learn.field_agent.domain;

import learn.field_agent.data.AliasRepository;
import learn.field_agent.data.LocationRepository;
import learn.field_agent.data.SecurityClearanceRepository;
import learn.field_agent.models.Alias;
import learn.field_agent.models.Location;
import learn.field_agent.models.SecurityClearance;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class SecurityClearanceServiceTest {

    @Autowired
    SecurityClearanceService service;

    @MockBean
    SecurityClearanceRepository repository;

    @Test
    void shouldAdd() {
        SecurityClearance sc = makeSecurityClearance();
        SecurityClearance mockOut = makeSecurityClearance();
        mockOut.setSecurityClearanceId(1);

        when(repository.add(sc)).thenReturn(mockOut);

        Result<SecurityClearance> actual = service.add(sc);
        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals(mockOut, actual.getPayload());
    }

    @Test
    void shouldNotAddWhenInvalid() {
        SecurityClearance sc = makeSecurityClearance();
        sc.setName(null);
        Result<SecurityClearance> actual = service.add(sc);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldUpdate() {
        SecurityClearance sc = makeSecurityClearance();
        sc.setSecurityClearanceId(1);

        when(repository.update(sc)).thenReturn(true);

        Result<SecurityClearance> actual = service.update(sc);
        assertEquals(ResultType.SUCCESS, actual.getType());
    }

    @Test
    void shouldNotUpdateWhenInvalid() {
        SecurityClearance sc = makeSecurityClearance();
        sc.setSecurityClearanceId(1);
        sc.setName(null);
        Result<SecurityClearance> actual = service.update(sc);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    private SecurityClearance makeSecurityClearance() {
        SecurityClearance sc = new SecurityClearance();
        sc.setName("Davey \"Fin Fingies\" Fisherman");
        return sc;
    }
}