import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartDataset } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import MonthDTO from 'src/app/shared/DTOs/month';


const SAMPLE_DATA: ChartData<'doughnut', number[], string> = {
  labels: ['Categoria 1', 'Categoria 2', 'Categoria 3'],
  datasets: [
    { 
      data: [350, 450, 100],
      label: 'Abril',
      backgroundColor: ['red', 'green', 'blue']
    },
    { 
      data: [50, 150, 120],
      label: 'Março',
      backgroundColor: ['red', 'green', 'blue']
    },
    {
      data: [250, 130, 70],
      label: 'Fevereiro',
      backgroundColor: ['red', 'green', 'blue']
    },
    {
      data: [250, 130, 70],
      label: 'Janeiro',
      backgroundColor: ['red', 'green', 'blue']
    },
  ],
}


@Component({
  selector: 'app-categories-chart',
  templateUrl: './categories-chart.component.html',
  styleUrls: ['./categories-chart.component.scss']
})
export class CategoriesChartComponent {
  @Input() set months(months: MonthDTO[]) {
    this.getData(months)
  }
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective
  options: ChartConfiguration['options'] = {
    responsive: true, //@ts-ignore
    hoverOffset: 10,
    plugins: {
      title: {
        display: true,
        text: 'Gastos por Categoria',
      },
      legend: {
        position: 'top',
      },
      datalabels: {
        color: 'black',
        formatter: (value, ctx): string => {
          const dataset = ctx.dataset as ChartDataset<'doughnut', number[]> 
          const percent = (100 * value / dataset.data.reduce((acc, val) => acc += val, 0))

          return percent.toPrecision(2) + '%'
        },
      }
    },
  }
  data: ChartData<'doughnut', number[], string> = SAMPLE_DATA
  plugins = [DatalabelsPlugin]

  getData(months: MonthDTO[]): void {

  }
}
