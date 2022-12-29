import { Component, OnInit } from '@angular/core';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  analyticsYear!: YearDTO
  analyticsMonth!: MonthDTO
  analyticsSelect: string = ''
  years!: YearDTO[]
  months!: MonthDTO[]

  constructor(
    private yearService: YearService,
    private monthService: MonthService,
  ) {}

  ngOnInit(): void {
    this.yearService.list().subscribe(res => this.years = res.data)
    this.monthService.list().subscribe(res => this.months = res.data)
  }

  toggleSelect(option: string): void {
    if(option == 'year') {

    }
    else {

    }
  }
}
