import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICasee } from 'app/shared/model/casee.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { CaseeService } from './casee.service';
import { CaseeDeleteDialogComponent } from './casee-delete-dialog.component';

@Component({
  selector: 'jhi-casee',
  templateUrl: './casee.component.html',
})
export class CaseeComponent implements OnInit, OnDestroy {
  casees: ICasee[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected caseeService: CaseeService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.casees = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.caseeService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<ICasee[]>) => this.paginateCasees(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.casees = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInCasees();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ICasee): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInCasees(): void {
    this.eventSubscriber = this.eventManager.subscribe('caseeListModification', () => this.reset());
  }

  delete(casee: ICasee): void {
    const modalRef = this.modalService.open(CaseeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.casee = casee;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateCasees(data: ICasee[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.casees.push(data[i]);
      }
    }
  }
}
