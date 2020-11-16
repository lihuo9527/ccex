import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiClientService } from './api-client.service';
import { LOGIN_PATH } from 'src/constants/path';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private apiClient: ApiClientService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.apiClient.currentUser) return true;
    this.router.navigate([LOGIN_PATH, { returnUrl: state.url }]);
    return false;
  }
}
