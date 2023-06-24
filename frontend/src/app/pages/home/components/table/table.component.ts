import { Component } from '@angular/core';
import TableFilters from 'src/app/utils/interfaces/tableFilters';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  getFilters(filters: TableFilters) {
    console.log(filters)
  }
}
