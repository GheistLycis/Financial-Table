import { Directive, ElementRef, EventEmitter, Input, Output, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollDetection]',
  standalone: true,
})
export class ScrollDetectionDirective implements OnDestroy {
  @Input() threshold = 0.8
  @Output() scrolled = new EventEmitter<void>()
  scrollContainer!: HTMLDivElement

  constructor(private element: ElementRef<HTMLDivElement>) {
    this.scrollContainer = this.element.nativeElement
    this.scrollContainer.addEventListener('scroll', this.onScroll.bind(this))
  }

  ngOnDestroy(): void {
    this.scrollContainer.removeEventListener('scroll', this.onScroll.bind(this))
  }

  onScroll(): void {
    const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer
    const scrollPosition = scrollTop + clientHeight

    if(scrollPosition >= (this.threshold * scrollHeight)) this.scrolled.emit()
  }
}
