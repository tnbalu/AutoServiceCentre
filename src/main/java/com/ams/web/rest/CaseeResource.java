package com.ams.web.rest;

import com.ams.domain.Casee;
import com.ams.repository.CaseeRepository;
import com.ams.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.ams.domain.Casee}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CaseeResource {

    private final Logger log = LoggerFactory.getLogger(CaseeResource.class);

    private static final String ENTITY_NAME = "casee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CaseeRepository caseeRepository;

    public CaseeResource(CaseeRepository caseeRepository) {
        this.caseeRepository = caseeRepository;
    }

    /**
     * {@code POST  /casees} : Create a new casee.
     *
     * @param casee the casee to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new casee, or with status {@code 400 (Bad Request)} if the casee has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/casees")
    public ResponseEntity<Casee> createCasee(@RequestBody Casee casee) throws URISyntaxException {
        log.debug("REST request to save Casee : {}", casee);
        if (casee.getId() != null) {
            throw new BadRequestAlertException("A new casee cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Casee result = caseeRepository.save(casee);
        return ResponseEntity.created(new URI("/api/casees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /casees} : Updates an existing casee.
     *
     * @param casee the casee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated casee,
     * or with status {@code 400 (Bad Request)} if the casee is not valid,
     * or with status {@code 500 (Internal Server Error)} if the casee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/casees")
    public ResponseEntity<Casee> updateCasee(@RequestBody Casee casee) throws URISyntaxException {
        log.debug("REST request to update Casee : {}", casee);
        if (casee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Casee result = caseeRepository.save(casee);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, casee.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /casees} : get all the casees.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of casees in body.
     */
    @GetMapping("/casees")
    public ResponseEntity<List<Casee>> getAllCasees(Pageable pageable) {
        log.debug("REST request to get a page of Casees");
        Page<Casee> page = caseeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /casees/:id} : get the "id" casee.
     *
     * @param id the id of the casee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the casee, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/casees/{id}")
    public ResponseEntity<Casee> getCasee(@PathVariable Long id) {
        log.debug("REST request to get Casee : {}", id);
        Optional<Casee> casee = caseeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(casee);
    }

    /**
     * {@code DELETE  /casees/:id} : delete the "id" casee.
     *
     * @param id the id of the casee to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/casees/{id}")
    public ResponseEntity<Void> deleteCasee(@PathVariable Long id) {
        log.debug("REST request to delete Casee : {}", id);
        caseeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
