import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import YearHistory from 'src/app/shared/interfaces/YearHistory';


@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss']
})
export class YearsComponent implements OnInit {
  yearsHistories$ = new BehaviorSubject<YearHistory[]>([])
  
  constructor() { }
  
  ngOnInit(): void {

  }
  
  addYear(): void {
    
  }
}
