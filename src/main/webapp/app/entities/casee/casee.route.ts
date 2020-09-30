import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICasee, Casee } from 'app/shared/model/casee.model';
import { CaseeService } from './casee.service';
import { CaseeComponent } from './casee.component';
import { CaseeDetailComponent } from './casee-detail.component';
import { CaseeUpdateComponent } from './casee-update.component';

@Injectable({ providedIn: 'root' })
export class CaseeResolve implements Resolve<ICasee> {
  constructor(private service: CaseeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICasee> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((casee: HttpResponse<Casee>) => {
          if (casee.body) {
            return of(casee.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Casee());
  }
}

export const caseeRoute: Routes = [
  {
    path: '',
    component: CaseeComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'amsApp.casee.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CaseeDetailComponent,
    resolve: {
      casee: CaseeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'amsApp.casee.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CaseeUpdateComponent,
    resolve: {
      casee: CaseeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'amsApp.casee.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CaseeUpdateComponent,
    resolve: {
      casee: CaseeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'amsApp.casee.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
