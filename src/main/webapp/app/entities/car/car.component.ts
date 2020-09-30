import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICar } from 'app/shared/model/car.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { CarService } from './car.service';
import { CarDeleteDialogComponent } from './car-delete-dialog.component';

@Component({
  selector: 'jhi-car',
  templateUrl: './car.component.html',
})
export class CarComponent implements OnInit, OnDestroy {
  cars: ICar[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected carService: CarService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.cars = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.carService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<ICar[]>) => this.paginateCars(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.cars = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInCars();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ICar): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInCars(): void {
    this.eventSubscriber = this.eventManager.subscribe('carListModification', () => this.reset());
  }

  delete(car: ICar): void {
    const modalRef = this.modalService.open(CarDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.car = car;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateCars(data: ICar[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.cars.push(data[i]);
      }
    }
  }
}
