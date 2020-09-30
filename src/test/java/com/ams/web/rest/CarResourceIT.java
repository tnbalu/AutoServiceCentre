package com.ams.web.rest;

import com.ams.AmsApp;
import com.ams.domain.Car;
import com.ams.repository.CarRepository;

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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.ams.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link CarResource} REST controller.
 */
@SpringBootTest(classes = AmsApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class CarResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY = "BBBBBBBBBB";

    private static final String DEFAULT_MODAL = "AAAAAAAAAA";
    private static final String UPDATED_MODAL = "BBBBBBBBBB";

    private static final String DEFAULT_MAKE = "AAAAAAAAAA";
    private static final String UPDATED_MAKE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_ENTERED_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ENTERED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_LEFT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LEFT_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCarMockMvc;

    private Car car;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Car createEntity(EntityManager em) {
        Car car = new Car()
            .name(DEFAULT_NAME)
            .company(DEFAULT_COMPANY)
            .modal(DEFAULT_MODAL)
            .make(DEFAULT_MAKE)
            .enteredTime(DEFAULT_ENTERED_TIME)
            .leftTime(DEFAULT_LEFT_TIME);
        return car;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Car createUpdatedEntity(EntityManager em) {
        Car car = new Car()
            .name(UPDATED_NAME)
            .company(UPDATED_COMPANY)
            .modal(UPDATED_MODAL)
            .make(UPDATED_MAKE)
            .enteredTime(UPDATED_ENTERED_TIME)
            .leftTime(UPDATED_LEFT_TIME);
        return car;
    }

    @BeforeEach
    public void initTest() {
        car = createEntity(em);
    }

    @Test
    @Transactional
    public void createCar() throws Exception {
        int databaseSizeBeforeCreate = carRepository.findAll().size();
        // Create the Car
        restCarMockMvc.perform(post("/api/cars")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(car)))
            .andExpect(status().isCreated());

        // Validate the Car in the database
        List<Car> carList = carRepository.findAll();
        assertThat(carList).hasSize(databaseSizeBeforeCreate + 1);
        Car testCar = carList.get(carList.size() - 1);
        assertThat(testCar.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCar.getCompany()).isEqualTo(DEFAULT_COMPANY);
        assertThat(testCar.getModal()).isEqualTo(DEFAULT_MODAL);
        assertThat(testCar.getMake()).isEqualTo(DEFAULT_MAKE);
        assertThat(testCar.getEnteredTime()).isEqualTo(DEFAULT_ENTERED_TIME);
        assertThat(testCar.getLeftTime()).isEqualTo(DEFAULT_LEFT_TIME);
    }

    @Test
    @Transactional
    public void createCarWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = carRepository.findAll().size();

        // Create the Car with an existing ID
        car.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCarMockMvc.perform(post("/api/cars")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(car)))
            .andExpect(status().isBadRequest());

        // Validate the Car in the database
        List<Car> carList = carRepository.findAll();
        assertThat(carList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkModalIsRequired() throws Exception {
        int databaseSizeBeforeTest = carRepository.findAll().size();
        // set the field null
        car.setModal(null);

        // Create the Car, which fails.


        restCarMockMvc.perform(post("/api/cars")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(car)))
            .andExpect(status().isBadRequest());

        List<Car> carList = carRepository.findAll();
        assertThat(carList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCars() throws Exception {
        // Initialize the database
        carRepository.saveAndFlush(car);

        // Get all the carList
        restCarMockMvc.perform(get("/api/cars?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(car.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)))
            .andExpect(jsonPath("$.[*].modal").value(hasItem(DEFAULT_MODAL)))
            .andExpect(jsonPath("$.[*].make").value(hasItem(DEFAULT_MAKE)))
            .andExpect(jsonPath("$.[*].enteredTime").value(hasItem(sameInstant(DEFAULT_ENTERED_TIME))))
            .andExpect(jsonPath("$.[*].leftTime").value(hasItem(sameInstant(DEFAULT_LEFT_TIME))));
    }
    
    @Test
    @Transactional
    public void getCar() throws Exception {
        // Initialize the database
        carRepository.saveAndFlush(car);

        // Get the car
        restCarMockMvc.perform(get("/api/cars/{id}", car.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(car.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY))
            .andExpect(jsonPath("$.modal").value(DEFAULT_MODAL))
            .andExpect(jsonPath("$.make").value(DEFAULT_MAKE))
            .andExpect(jsonPath("$.enteredTime").value(sameInstant(DEFAULT_ENTERED_TIME)))
            .andExpect(jsonPath("$.leftTime").value(sameInstant(DEFAULT_LEFT_TIME)));
    }
    @Test
    @Transactional
    public void getNonExistingCar() throws Exception {
        // Get the car
        restCarMockMvc.perform(get("/api/cars/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCar() throws Exception {
        // Initialize the database
        carRepository.saveAndFlush(car);

        int databaseSizeBeforeUpdate = carRepository.findAll().size();

        // Update the car
        Car updatedCar = carRepository.findById(car.getId()).get();
        // Disconnect from session so that the updates on updatedCar are not directly saved in db
        em.detach(updatedCar);
        updatedCar
            .name(UPDATED_NAME)
            .company(UPDATED_COMPANY)
            .modal(UPDATED_MODAL)
            .make(UPDATED_MAKE)
            .enteredTime(UPDATED_ENTERED_TIME)
            .leftTime(UPDATED_LEFT_TIME);

        restCarMockMvc.perform(put("/api/cars")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedCar)))
            .andExpect(status().isOk());

        // Validate the Car in the database
        List<Car> carList = carRepository.findAll();
        assertThat(carList).hasSize(databaseSizeBeforeUpdate);
        Car testCar = carList.get(carList.size() - 1);
        assertThat(testCar.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCar.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testCar.getModal()).isEqualTo(UPDATED_MODAL);
        assertThat(testCar.getMake()).isEqualTo(UPDATED_MAKE);
        assertThat(testCar.getEnteredTime()).isEqualTo(UPDATED_ENTERED_TIME);
        assertThat(testCar.getLeftTime()).isEqualTo(UPDATED_LEFT_TIME);
    }

    @Test
    @Transactional
    public void updateNonExistingCar() throws Exception {
        int databaseSizeBeforeUpdate = carRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCarMockMvc.perform(put("/api/cars")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(car)))
            .andExpect(status().isBadRequest());

        // Validate the Car in the database
        List<Car> carList = carRepository.findAll();
        assertThat(carList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCar() throws Exception {
        // Initialize the database
        carRepository.saveAndFlush(car);

        int databaseSizeBeforeDelete = carRepository.findAll().size();

        // Delete the car
        restCarMockMvc.perform(delete("/api/cars/{id}", car.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Car> carList = carRepository.findAll();
        assertThat(carList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
