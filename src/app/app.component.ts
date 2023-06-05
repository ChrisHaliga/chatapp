import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {}

  title = 'AngularSandbox';
  mode = 0;

  updateMode(mode:any)
  {
    this.mode = mode;
  }
}