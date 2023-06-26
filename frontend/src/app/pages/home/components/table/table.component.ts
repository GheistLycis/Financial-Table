import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import YearDTO from 'src/app/DTOs/year';
import { YearService } from 'src/app/services/year/year.service';
import TableFilters from 'src/app/utils/interfaces/tableFilters';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  years: YearDTO[] = []
  activeYear!: YearDTO['id']
  
  constructor(
    private yearService: YearService,
  ) { }
  
  ngOnInit(): void {
    this.yearService.list().pipe(
      map(({ data }) => data),
      tap(years => {
        this.years = years
        
        this.activeYear = years[0].id
      })
    ).subscribe()
  }
  
  getFilters(filters: TableFilters) {
    console.log(filters)
  }
}
