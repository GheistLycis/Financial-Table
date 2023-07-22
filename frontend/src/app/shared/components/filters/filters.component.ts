import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import CategoryDTO from 'src/app/shared/DTOs/category';
import MonthDTO from 'src/app/shared/DTOs/month';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { MonthService } from 'src/app/shared/services/month/month.service';
import { BehaviorSubject, Subject, forkJoin, skip, map, tap, switchMap, combineLatest, debounceTime } from 'rxjs';
import Filters from 'src/app/shared/interfaces/ExpensesFilters';
import { MonthNamePipe } from 'src/app/shared/pipes/month-name/month-name.pipe';
import YearDTO from '../../DTOs/year';
import { TagService } from '../../services/tag/tag.service';
import TagDTO from 'src/app/shared/DTOs/tag';


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
  ) { }
  
  ngOnInit(): void {
    this.handleMonths()
    this.handleCategories()
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
