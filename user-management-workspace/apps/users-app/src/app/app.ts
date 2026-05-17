import { Component } from '@angular/core';
import { UserListComponent } from '@user-management-workspace/feature-users';

@Component({
  standalone: true,
  imports: [UserListComponent],
  selector: 'app-root',
  template: `<lib-user-list></lib-user-list>`,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
  `],
})
export class App {
  protected title = 'users-app';
}
