import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input() icon: 'help' | 'warning' | 'info' | 'security' = 'help'
  @Input() class?: string
}
