package com.ams.web.rest;

import com.ams.AmsApp;
import com.ams.domain.Casee;
import com.ams.repository.CaseeRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ams.domain.enumeration.CaseType;
/**
 * Integration tests for the {@link CaseeResource} REST controller.
 */
@SpringBootTest(classes = AmsApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class CaseeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED_ON = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_ON = LocalDate.now(ZoneId.systemDefault());

    private static final CaseType DEFAULT_CASE_TYPE = CaseType.INQUIREY;
    private static final CaseType UPDATED_CASE_TYPE = CaseType.START;

    @Autowired
    private CaseeRepository caseeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCaseeMockMvc;

    private Casee casee;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Casee createEntity(EntityManager em) {
        Casee casee = new Casee()
            .name(DEFAULT_NAME)
            .createdOn(DEFAULT_CREATED_ON)
            .caseType(DEFAULT_CASE_TYPE);
        return casee;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Casee createUpdatedEntity(EntityManager em) {
        Casee casee = new Casee()
            .name(UPDATED_NAME)
            .createdOn(UPDATED_CREATED_ON)
            .caseType(UPDATED_CASE_TYPE);
        return casee;
    }

    @BeforeEach
    public void initTest() {
        casee = createEntity(em);
    }

    @Test
    @Transactional
    public void createCasee() throws Exception {
        int databaseSizeBeforeCreate = caseeRepository.findAll().size();
        // Create the Casee
        restCaseeMockMvc.perform(post("/api/casees")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(casee)))
            .andExpect(status().isCreated());

        // Validate the Casee in the database
        List<Casee> caseeList = caseeRepository.findAll();
        assertThat(caseeList).hasSize(databaseSizeBeforeCreate + 1);
        Casee testCasee = caseeList.get(caseeList.size() - 1);
        assertThat(testCasee.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCasee.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testCasee.getCaseType()).isEqualTo(DEFAULT_CASE_TYPE);
    }

    @Test
    @Transactional
    public void createCaseeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = caseeRepository.findAll().size();

        // Create the Casee with an existing ID
        casee.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCaseeMockMvc.perform(post("/api/casees")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(casee)))
            .andExpect(status().isBadRequest());

        // Validate the Casee in the database
        List<Casee> caseeList = caseeRepository.findAll();
        assertThat(caseeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCasees() throws Exception {
        // Initialize the database
        caseeRepository.saveAndFlush(casee);

        // Get all the caseeList
        restCaseeMockMvc.perform(get("/api/casees?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(casee.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].createdOn").value(hasItem(DEFAULT_CREATED_ON.toString())))
            .andExpect(jsonPath("$.[*].caseType").value(hasItem(DEFAULT_CASE_TYPE.toString())));
    }
    
    @Test
    @Transactional
    public void getCasee() throws Exception {
        // Initialize the database
        caseeRepository.saveAndFlush(casee);

        // Get the casee
        restCaseeMockMvc.perform(get("/api/casees/{id}", casee.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(casee.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.createdOn").value(DEFAULT_CREATED_ON.toString()))
            .andExpect(jsonPath("$.caseType").value(DEFAULT_CASE_TYPE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingCasee() throws Exception {
        // Get the casee
        restCaseeMockMvc.perform(get("/api/casees/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCasee() throws Exception {
        // Initialize the database
        caseeRepository.saveAndFlush(casee);

        int databaseSizeBeforeUpdate = caseeRepository.findAll().size();

        // Update the casee
        Casee updatedCasee = caseeRepository.findById(casee.getId()).get();
        // Disconnect from session so that the updates on updatedCasee are not directly saved in db
        em.detach(updatedCasee);
        updatedCasee
            .name(UPDATED_NAME)
            .createdOn(UPDATED_CREATED_ON)
            .caseType(UPDATED_CASE_TYPE);

        restCaseeMockMvc.perform(put("/api/casees")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedCasee)))
            .andExpect(status().isOk());

        // Validate the Casee in the database
        List<Casee> caseeList = caseeRepository.findAll();
        assertThat(caseeList).hasSize(databaseSizeBeforeUpdate);
        Casee testCasee = caseeList.get(caseeList.size() - 1);
        assertThat(testCasee.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCasee.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testCasee.getCaseType()).isEqualTo(UPDATED_CASE_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingCasee() throws Exception {
        int databaseSizeBeforeUpdate = caseeRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaseeMockMvc.perform(put("/api/casees")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(casee)))
            .andExpect(status().isBadRequest());

        // Validate the Casee in the database
        List<Casee> caseeList = caseeRepository.findAll();
        assertThat(caseeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCasee() throws Exception {
        // Initialize the database
        caseeRepository.saveAndFlush(casee);

        int databaseSizeBeforeDelete = caseeRepository.findAll().size();

        // Delete the casee
        restCaseeMockMvc.perform(delete("/api/casees/{id}", casee.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Casee> caseeList = caseeRepository.findAll();
        assertThat(caseeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
