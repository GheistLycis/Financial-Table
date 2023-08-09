import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import CategoryDTO from '@DTOs/category';
import MonthDTO from '@DTOs/month';
import { CategoryService } from '@services/category/category.service';
import { MonthService } from '@services/month/month.service';
import { BehaviorSubject, Subject, forkJoin, skip, map, tap, switchMap, combineLatest, debounceTime, of } from 'rxjs';
import Filters from '@interfaces/ExpensesFilters';
import { MonthNamePipe } from '@pipes/month-name/month-name.pipe';
import YearDTO from '../../DTOs/year';
import { TagService } from '../../services/tag/tag.service';
import TagDTO from '@DTOs/tag';
import { Router } from '@angular/router';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  providers: [MonthNamePipe],
})
export class FiltersComponent implements OnInit {
  @Input() set year(yearId: YearDTO['id'] | undefined) {
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
  @Input() showTags = true
  @Input() multiple = true
  @Input() clearable = true
  @Output() filters = new EventEmitter<Filters>()
  @ViewChild(MonthNamePipe) MonthNamePipe!: MonthNamePipe
  months$ = new Subject<MonthDTO[]>()
  selectedMonths$ = new BehaviorSubject<MonthDTO[]>([])
  categories$ = new Subject<CategoryDTO[]>()
  selectedCategories$ = new BehaviorSubject<CategoryDTO[]>([])
  tags$ = this.tagService.list().pipe(map(({ data }) => data))
  selectedTags$ = new BehaviorSubject<TagDTO[]>([])
  
  constructor(
    private monthService: MonthService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private monthNamePipe: MonthNamePipe,
    public router: Router,
  ) { }
  
  ngOnInit(): void {
    this.handleMonths()
    if(this.showCategories) this.handleCategories()
    this.handleFilters()
  }
  
  handleMonths(): void {
    this.months$.pipe(
      tap(months => {
        const val = []

        if(months?.[0]) val.push(months[0])

        this.selectedMonths$.next(val)
      }),
    ).subscribe()
    
    this.selectedMonths$.pipe(
      skip(1),
      switchMap(months => {
        if(months.length) {
          return forkJoin(months.map(({ id }) => this.categoryService.list({ month: id }).pipe(
            map(({ data }) => data)))
          )
        }
        else {
          return of([])
        }
      }),
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
  }
  
  handleFilters(): void {
    combineLatest([
      this.selectedMonths$, 
      this.selectedCategories$, 
      this.selectedTags$
    ]).pipe(
      debounceTime(500),
      tap(() => {
        this.filters.emit({
          months: this.selectedMonths$.value,
          categories: this.selectedCategories$.value,
          tags: this.selectedTags$.value,
        })
      })
    ).subscribe()
  }
}
