import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICasee } from 'app/shared/model/casee.model';

@Component({
  selector: 'jhi-casee-detail',
  templateUrl: './casee-detail.component.html',
})
export class CaseeDetailComponent implements OnInit {
  casee: ICasee | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ casee }) => (this.casee = casee));
  }

  previousState(): void {
    window.history.back();
  }
}
