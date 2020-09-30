package com.ams.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;

import com.ams.domain.enumeration.CaseType;

/**
 * A Casee.
 */
@Entity
@Table(name = "casee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Casee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "created_on")
    private LocalDate createdOn;

    @Enumerated(EnumType.STRING)
    @Column(name = "case_type")
    private CaseType caseType;

    @ManyToOne
    @JsonIgnoreProperties(value = "casees", allowSetters = true)
    private Employee employee;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Casee name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getCreatedOn() {
        return createdOn;
    }

    public Casee createdOn(LocalDate createdOn) {
        this.createdOn = createdOn;
        return this;
    }

    public void setCreatedOn(LocalDate createdOn) {
        this.createdOn = createdOn;
    }

    public CaseType getCaseType() {
        return caseType;
    }

    public Casee caseType(CaseType caseType) {
        this.caseType = caseType;
        return this;
    }

    public void setCaseType(CaseType caseType) {
        this.caseType = caseType;
    }

    public Employee getEmployee() {
        return employee;
    }

    public Casee employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Casee)) {
            return false;
        }
        return id != null && id.equals(((Casee) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Casee{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", createdOn='" + getCreatedOn() + "'" +
            ", caseType='" + getCaseType() + "'" +
            "}";
    }
}
