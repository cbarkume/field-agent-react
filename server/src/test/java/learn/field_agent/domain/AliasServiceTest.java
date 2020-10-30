package learn.field_agent.domain;

import learn.field_agent.data.AliasRepository;
import learn.field_agent.data.LocationRepository;
import learn.field_agent.models.Alias;
import learn.field_agent.models.Location;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class AliasServiceTest {

    @Autowired
    AliasService service;

    @MockBean
    AliasRepository repository;

    @Test
    void shouldAdd() {
        Alias alias = makeAlias();
        Alias mockOut = makeAlias();
        mockOut.setAliasId(1);

        when(repository.add(alias)).thenReturn(mockOut);

        Result<Alias> actual = service.add(alias);
        assertEquals(ResultType.SUCCESS, ResultType.SUCCESS);
        assertNull(actual.getPayload());
    }

    @Test
    void shouldNotAddWhenInvalid() {
        Alias alias = makeAlias();
        alias.setName(null);

        Result<Alias> actual = service.add(alias);
        assertEquals(ResultType.INVALID, actual.getType());

        alias = makeAlias();
        alias.setAgentId(190);
        actual = service.add(alias);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldUpdate() {
        Alias alias = makeAlias();
        alias.setAliasId(1);

        when(repository.update(alias)).thenReturn(true);

        Result<Alias> actual = service.update(alias);
        assertEquals(ResultType.SUCCESS, ResultType.SUCCESS);
    }

    @Test
    void shouldNotUpdateWhenInvalid() {
        Alias alias = makeAlias();
        alias.setAliasId(1);
        alias.setName(null);
        Result<Alias> actual = service.update(alias);
        assertEquals(ResultType.INVALID, actual.getType());
    }

    private Alias makeAlias() {
        Alias alias = new Alias();
        alias.setName("Davey \"Fin Fingies\" Fisherman");
        alias.setPersona("Large fish man with fins for fingers");
        alias.setAgentId(1);
        return alias;
    }
}