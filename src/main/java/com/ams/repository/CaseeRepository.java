package com.ams.repository;

import com.ams.domain.Casee;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Casee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CaseeRepository extends JpaRepository<Casee, Long> {
}
