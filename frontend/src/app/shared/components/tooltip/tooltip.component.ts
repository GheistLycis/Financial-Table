import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
  ],
})
export class TooltipComponent {
  @Input() icon: 'help' | 'warning' | 'info' | 'security' = 'help'
  @Input() container: string = 'body'
  @Input() positionTarget?: string
  @Input() class?: string
}
