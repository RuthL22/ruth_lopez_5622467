import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Mantenimiento de Clientes', url: '/cliente-list', icon: 'person'  },
     
    

  ];
  public labels = ['Clientes',];
  constructor() {}
}
