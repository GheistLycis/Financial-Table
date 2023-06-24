import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import CategoryDTO from 'src/app/DTOs/category';
import GroupDTO from 'src/app/DTOs/group';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { CategoryService } from 'src/app/services/category/category.service';
import { GroupService } from 'src/app/services/group/group.service';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { BehaviorSubject, Observable, Subject, forkJoin, skip, map } from 'rxjs';
import TableFilters from 'src/app/utils/interfaces/tableFilters';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Output() filters = new EventEmitter<TableFilters>()
  years: YearDTO[] = []
  selectedYears$ = new BehaviorSubject<YearDTO[]>([])
  months$ = new Subject<MonthDTO[]>()
  selectedMonths$ = new BehaviorSubject<MonthDTO[]>([])
  categories$ = new Subject<CategoryDTO[]>()
  selectedCategories$ = new BehaviorSubject<CategoryDTO[]>([])
  groups$ = new Subject<GroupDTO[]>()
  selectedGroups$ = new BehaviorSubject<GroupDTO[]>([])
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private categoryService: CategoryService,
    private groupService: GroupService,
  ) { 
    this.selectedYears$.pipe(skip(1)).subscribe(years => {
      const forkJoinArr: Observable<MonthDTO[]>[] = []
      
      years.forEach(({ id }) => forkJoinArr.push(this.monthService.list({ year: id }).pipe(map(({ data }) => data))))
      
      const months$ = forkJoin(forkJoinArr)
      
      months$.subscribe(months => this.months$.next(months.flat()))
    })
    
    this.months$.subscribe(value => this.selectedMonths$.next([value[0]]))
    
    this.selectedMonths$.pipe(skip(1)).subscribe(months => {
      const forkJoinArr: Observable<CategoryDTO[]>[] = []
      
      months.forEach(({ id }) => forkJoinArr.push(this.categoryService.list({ month: id }).pipe(map(({ data }) => data))))
      
      const categories$ = forkJoin(forkJoinArr)
      
      categories$.subscribe(categories => this.categories$.next(categories.flat()))
    })
    
    this.categories$.subscribe(value => this.selectedCategories$.next([value[0]]))
    
    this.selectedCategories$.pipe(skip(1)).subscribe(categories => {
      const forkJoinArr: Observable<GroupDTO[]>[] = []
      
      categories.forEach(({ id }) => forkJoinArr.push(this.groupService.list({ category: id }).pipe(map(({ data }) => data))))
      
      const groups$ = forkJoin(forkJoinArr)
      
      groups$.subscribe(groups => this.groups$.next(groups.flat()))
    })
    
    this.groups$.subscribe(value => {
      this.selectedGroups$.next([value[0]])
      
      this.emitFilters()
    })
  }
  
  ngOnInit(): void {
    this.yearService.list().subscribe(({ data }) => {
      this.years = data
      
      this.selectedYears$.next([this.years[0]])
    })
  }
  
  emitFilters(): void {
    this.filters.emit({
      years: this.selectedYears$.getValue(),
      months: this.selectedMonths$.getValue(),
      categories: this.selectedCategories$.getValue(),
      groups: this.selectedGroups$.getValue(),
    })
  }
}
