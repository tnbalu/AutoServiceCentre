package com.ams.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.ams.web.rest.TestUtil;

public class CaseeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Casee.class);
        Casee casee1 = new Casee();
        casee1.setId(1L);
        Casee casee2 = new Casee();
        casee2.setId(casee1.getId());
        assertThat(casee1).isEqualTo(casee2);
        casee2.setId(2L);
        assertThat(casee1).isNotEqualTo(casee2);
        casee1.setId(null);
        assertThat(casee1).isNotEqualTo(casee2);
    }
}
