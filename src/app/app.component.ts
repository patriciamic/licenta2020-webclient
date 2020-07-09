import { Component } from '@angular/core';
import { WebService } from './services/web.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'clientweb';

  isTab1 = false;
  isTab2 = true;
  isTab3 = false;
  isTab4 = false;
  isTab5 = false;
  toggle = true;

  constructor(private webservice: WebService) {
  }

  onClickNav(value: string) {
    console.log('clicke on ' + value);
    this.isTab1 = false;
    this.isTab2 = false;
    this.isTab3 = false;
    this.isTab4 = false;
    this.isTab5 = false;

    switch (value) {
      case 'tab1':
        this.isTab1 = true;
        break;
      case 'tab2':
        this.isTab2 = true;
        break;
      case 'tab3':
        this.isTab3 = true;
        break;
      case 'tab4':
        this.isTab4 = true;
        break;
      case 'tab5':
        this.isTab5 = true;
        break;
    }


  }
}
