import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppShellComponent } from './app-shell/app-shell.component';
import { sendNotification } from '@nx-workshop/util-notifications';

@Component({
  standalone: true,
  imports: [RouterOutlet, AppShellComponent],
  selector: 'ens-root',
  template: `
    <app-shell>
      <router-outlet />
    </app-shell>
  `,
})
export class AppComponent {
  title = 'movies';
}
