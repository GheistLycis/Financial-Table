import { Component } from '@angular/core';
import { Subject, map } from 'rxjs';
import MonthDTO from 'src/app/shared/DTOs/month';
import { YearService } from 'src/app/shared/services/year/year.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {
  actualYear$ = this.yearService.list().pipe(map(({ data }) => data[0].id))
  filteredMonths$ = new Subject<MonthDTO[]>()

  constructor(
    private yearService: YearService,
  ) {}
}
