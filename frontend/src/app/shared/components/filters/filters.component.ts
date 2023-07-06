import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import CategoryDTO from 'src/app/shared/DTOs/category';
import GroupDTO from 'src/app/shared/DTOs/group';
import MonthDTO from 'src/app/shared/DTOs/month';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { GroupService } from 'src/app/shared/services/group/group.service';
import { MonthService } from 'src/app/shared/services/month/month.service';
import { BehaviorSubject, Subject, forkJoin, skip, map, tap, switchMap, combineLatest, debounceTime } from 'rxjs';
import Filters from 'src/app/shared/interfaces/Filters';
import { MonthNamePipe } from 'src/app/shared/pipes/month-name/month-name.pipe';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  providers: [MonthNamePipe],
})
export class FiltersComponent implements OnInit {
  @Input() set year(yearId: number | undefined) {
    yearId && this.monthService.list({ year: yearId }).pipe(
      map(({ data }) => data.map(month => {
          //@ts-ignore
          month.month = this.monthNamePipe.transform(month.month)
          
          return month
        })
      ),
      tap(months => this.months$.next(months))
    ).subscribe()
  }
  @Input() showMonths = true
  @Input() showCategories = true
  @Input() showGroups = true
  @Input() multiple = true
  @Input() clearable = true
  @Output() filters = new EventEmitter<Filters>()
  @ViewChild(MonthNamePipe) MonthNamePipe!: MonthNamePipe
  months$ = new Subject<MonthDTO[]>()
  selectedMonths$ = new BehaviorSubject<MonthDTO[]>([])
  categories$ = new Subject<CategoryDTO[]>()
  selectedCategories$ = new BehaviorSubject<CategoryDTO[]>([])
  groups$ = new Subject<GroupDTO[]>()
  selectedGroups$ = new BehaviorSubject<GroupDTO[]>([])
  
  constructor(
    private monthService: MonthService,
    private categoryService: CategoryService,
    private groupService: GroupService,
    private monthNamePipe: MonthNamePipe,
  ) { }
  
  ngOnInit(): void {
    this.handleMonths()
    this.handleCategories()
    this.handleGroups()
    this.handleFilters()
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
      map(monthsCategories => monthsCategories
        .flat()
        .map(category => {
          category.name = `${category.name} (${this.monthNamePipe.transform(category.month.month)})`
          
          return category
        })
      ),
    ).subscribe(this.categories$)
  }
  
  handleCategories(): void {
    this.categories$.pipe(
      tap(() => this.selectedCategories$.next([])),
    ).subscribe()
    
    this.selectedCategories$.pipe(
      skip(1),
      switchMap(categories => forkJoin(categories.map(({ id }) => this.groupService.list({ category: id }).pipe(
        map(({ data }) => data)))
      )),
      map(monthsGroups => monthsGroups
        .flat()
        .map(group => {
          group.name = `${group.name} (${this.monthNamePipe.transform(group.category.month.month)})`
          
          return group
        })
      ),
    ).subscribe(this.groups$)
  }
  
  handleGroups(): void {
    this.groups$.pipe(
      tap(() => this.selectedGroups$.next([]))
    ).subscribe()
  }
  
  handleFilters(): void {
    combineLatest([
      this.selectedMonths$, 
      this.selectedCategories$, 
      this.selectedGroups$
    ]).pipe(
      debounceTime(500),
      tap(() => {
        this.filters.emit({
          months: this.selectedMonths$.getValue(),
          categories: this.selectedCategories$.getValue(),
          groups: this.selectedGroups$.getValue(),
        })
      })
    ).subscribe()
  }
}
