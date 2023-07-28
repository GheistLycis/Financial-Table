import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-tags-chart',
  templateUrl: './tags-chart.component.html',
  styleUrls: ['./tags-chart.component.scss']
})
export class TagsChartComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective
  options: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Ranking de Tags',
      },
      datalabels: {
        formatter: (value, { chart, dataIndex }) => chart.data?.labels[dataIndex],
        anchor: 'end',
        align: 'end',
      },
    },
  }
  data: ChartData<'bar'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { 
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
      },
    ],
  }
  plugins = [DataLabelsPlugin]
}
