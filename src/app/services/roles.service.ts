import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor() {}

  // determines if user has matching role
  public checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) { return false; }

    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }

    return false;
  }

  isStudent(user: User): boolean {
    const allowed = ['student'];
    return this.checkAuthorization(user, allowed);
  }

  isController(user: User): boolean {
    const allowed = ['controller'];
    return this.checkAuthorization(user, allowed);
  }

  isInstitution(user: User): boolean {
    const allowed = ['institution'];
    return this.checkAuthorization(user, allowed);
  }

  isAdmin(user: User): boolean {
    const allowed = ['administrator'];
    return this.checkAuthorization(user, allowed);
  }

}
