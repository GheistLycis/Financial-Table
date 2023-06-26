import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import CategoryDTO from 'src/app/DTOs/category';
import GroupDTO from 'src/app/DTOs/group';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { CategoryService } from 'src/app/services/category/category.service';
import { GroupService } from 'src/app/services/group/group.service';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { BehaviorSubject, Subject, forkJoin, skip, map, tap, switchMap } from 'rxjs';
import TableFilters from 'src/app/utils/interfaces/tableFilters';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Output() filters = new EventEmitter<TableFilters>()
  years$ = new Subject<YearDTO[]>()
  selectedYears$ = new BehaviorSubject<YearDTO[]>(undefined)
  months$ = new Subject<MonthDTO[]>()
  selectedMonths$ = new BehaviorSubject<MonthDTO[]>(undefined)
  categories$ = new Subject<CategoryDTO[]>()
  selectedCategories$ = new BehaviorSubject<CategoryDTO[]>(undefined)
  groups$ = new Subject<GroupDTO[]>()
  selectedGroups$ = new BehaviorSubject<GroupDTO[]>(undefined)
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private categoryService: CategoryService,
    private groupService: GroupService,
  ) { }
  
  ngOnInit(): void {
    this.handleYears()
    this.handleMonths()
    this.handleCategories()
    this.handleGroups()
    
    this.yearService.list().pipe(
      map(({ data }) => data)
    ).subscribe(this.years$)
  }
  
  handleYears(): void {
    this.years$.pipe(
      tap(years => this.selectedYears$.next([years[0]]))
    ).subscribe()
    
    this.selectedYears$.pipe(
      skip(1),
      switchMap(years => forkJoin(years.map(({ id }) => this.monthService.list({ year: id }).pipe(
        map(({ data }) => data)))
      )),
      map(yearsMonths => yearsMonths.flat())
    ).subscribe(this.months$)
  }
  
  handleMonths(): void {
    this.months$.pipe(
      tap(months => this.selectedMonths$.next([months[0]])),
    ).subscribe()
    
    this.selectedMonths$.pipe(
      skip(1),
      switchMap(months => forkJoin(months.map(({ id }) => this.categoryService.list({ month: id }).pipe(
        map(({ data }) => data)))
      )),
      map(monthsCategories => monthsCategories.flat())
    ).subscribe(this.categories$)
  }
  
  handleCategories(): void {
    this.categories$.pipe(
      tap(categories => this.selectedCategories$.next([categories[0]])),
    ).subscribe()
    
    this.selectedCategories$.pipe(
      skip(1),
      switchMap(categories => forkJoin(categories.map(({ id }) => this.groupService.list({ category: id }).pipe(
        map(({ data }) => data)))
      )),
      map(monthsGroups => monthsGroups.flat())
    ).subscribe(this.groups$)
  }
  
  handleGroups(): void {
    this.groups$.pipe(
      tap(groups => {
        this.selectedGroups$.next([groups[0]])
        
        this.emitFilters()
      })
    ).subscribe()
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
