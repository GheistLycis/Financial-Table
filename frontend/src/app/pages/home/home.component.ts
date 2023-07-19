import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent {
  update = 0
  
  constructor(config: NgbCarouselConfig) {
    config.animation = true
    config.interval = 0
    config.showNavigationIndicators = false
  }
}
