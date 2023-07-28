import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-categories-chart',
  templateUrl: './categories-chart.component.html',
  styleUrls: ['./categories-chart.component.scss']
})
export class CategoriesChartComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective
  options: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gastos por Categoria',
      },
      legend: {
        position: 'top',
      },
      datalabels: {
        formatter: (value, { chart, dataIndex }) => chart.data?.labels[dataIndex]
      },
    },
  }
  data: ChartData<'pie'> = {
    labels: ['Download Sales', 'In Store Sales', 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
  }
  plugins = [DatalabelsPlugin]
}
