import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import MonthDTO from 'src/app/shared/DTOs/month';
import { Subject, map } from 'rxjs';
import TagChartData from 'src/app/shared/interfaces/TagChartData';
import { RoundPipe } from 'src/app/shared/pipes/round/round.pipe';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';

@Component({
  selector: 'app-tags-chart',
  templateUrl: './tags-chart.component.html',
  styleUrls: ['./tags-chart.component.scss'],
  providers: [RoundPipe]
})
export class TagsChartComponent {
  @Input() set months(months: MonthDTO[] | null) {
    if(months?.length) this.getData(months.map(({ id }) => id))
  }
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective
  options: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      xAxes: {
        display: false,
        max: 100,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Ranking de Tags',
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value): number => this.roundPipe.transform(value, 2),
      },
    },
  }
  data$ = new Subject<TagChartData>()
  plugins = [DataLabelsPlugin]

  constructor(
    private analyticsService: AnalyticsService,
    private roundPipe: RoundPipe,
  ) {}

  getData(months: MonthDTO['id'][]): void {
    this.analyticsService.categoryChart(months).pipe(
      map(({ data }) => data)
    ).subscribe(data => this.data$.next(data))
  }
}
