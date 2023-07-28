import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartDataset } from 'chart.js';
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
        formatter: (value, ctx): string => {
          const dataset = ctx.dataset as ChartDataset<'doughnut', number[]> 
          const percent = (100 * value / dataset.data.reduce((acc, val) => acc += val, 0))

          return percent.toPrecision(2) + '%'
        },
        color: 'black',
      },
    },
  }
  data: ChartData<'doughnut', number[], string> = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'],
    datasets: [
      { data: [350, 450, 100] },
      { data: [50, 150, 120] },
      { data: [250, 130, 70] },
    ],
  }
  plugins = [DatalabelsPlugin]
}
