package com.ams.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Car.
 */
@Entity
@Table(name = "car")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Car implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "company")
    private String company;

    @NotNull
    @Column(name = "modal", nullable = false)
    private String modal;

    @Column(name = "make")
    private String make;

    @Column(name = "entered_time")
    private ZonedDateTime enteredTime;

    @Column(name = "left_time")
    private ZonedDateTime leftTime;

    @OneToOne
    @JoinColumn(unique = true)
    private Contact contact;

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

    public Car name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCompany() {
        return company;
    }

    public Car company(String company) {
        this.company = company;
        return this;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getModal() {
        return modal;
    }

    public Car modal(String modal) {
        this.modal = modal;
        return this;
    }

    public void setModal(String modal) {
        this.modal = modal;
    }

    public String getMake() {
        return make;
    }

    public Car make(String make) {
        this.make = make;
        return this;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public ZonedDateTime getEnteredTime() {
        return enteredTime;
    }

    public Car enteredTime(ZonedDateTime enteredTime) {
        this.enteredTime = enteredTime;
        return this;
    }

    public void setEnteredTime(ZonedDateTime enteredTime) {
        this.enteredTime = enteredTime;
    }

    public ZonedDateTime getLeftTime() {
        return leftTime;
    }

    public Car leftTime(ZonedDateTime leftTime) {
        this.leftTime = leftTime;
        return this;
    }

    public void setLeftTime(ZonedDateTime leftTime) {
        this.leftTime = leftTime;
    }

    public Contact getContact() {
        return contact;
    }

    public Car contact(Contact contact) {
        this.contact = contact;
        return this;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Car)) {
            return false;
        }
        return id != null && id.equals(((Car) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Car{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", company='" + getCompany() + "'" +
            ", modal='" + getModal() + "'" +
            ", make='" + getMake() + "'" +
            ", enteredTime='" + getEnteredTime() + "'" +
            ", leftTime='" + getLeftTime() + "'" +
            "}";
    }
}
