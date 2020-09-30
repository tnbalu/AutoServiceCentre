import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICar, Car } from 'app/shared/model/car.model';
import { CarService } from './car.service';
import { CarComponent } from './car.component';
import { CarDetailComponent } from './car-detail.component';
import { CarUpdateComponent } from './car-update.component';

@Injectable({ providedIn: 'root' })
export class CarResolve implements Resolve<ICar> {
  constructor(private service: CarService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICar> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((car: HttpResponse<Car>) => {
          if (car.body) {
            return of(car.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Car());
  }
}

export const carRoute: Routes = [
  {
    path: '',
    component: CarComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'amsApp.car.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CarDetailComponent,
    resolve: {
      car: CarResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'amsApp.car.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CarUpdateComponent,
    resolve: {
      car: CarResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'amsApp.car.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CarUpdateComponent,
    resolve: {
      car: CarResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'amsApp.car.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
