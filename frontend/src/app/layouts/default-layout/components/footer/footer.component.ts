import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  easterEgg = ''

  showEasterEgg(): void {
    for(let i = 0; i < 3; i++) {
      setTimeout(() => this.easterEgg += '.', 500 * i)
    }

    setTimeout(() => this.easterEgg += ' =]', 2000)

    setTimeout(() => this.easterEgg = '', 4000)
  }
}
