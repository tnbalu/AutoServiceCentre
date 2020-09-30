import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContact } from 'app/shared/model/contact.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ContactService } from './contact.service';
import { ContactDeleteDialogComponent } from './contact-delete-dialog.component';

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit, OnDestroy {
  contacts: IContact[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected contactService: ContactService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.contacts = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.contactService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IContact[]>) => this.paginateContacts(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.contacts = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInContacts();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IContact): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInContacts(): void {
    this.eventSubscriber = this.eventManager.subscribe('contactListModification', () => this.reset());
  }

  delete(contact: IContact): void {
    const modalRef = this.modalService.open(ContactDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contact = contact;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateContacts(data: IContact[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.contacts.push(data[i]);
      }
    }
  }
}
