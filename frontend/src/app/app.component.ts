import { Component, OnInit, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('cursorDot') cursorDot
  @ViewChild('cursorCircle') cursorCircle

  constructor() { }

  ngOnInit(): void { }

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: MouseEvent) {
    this.cursorDot.nativeElement.style.left = e.clientX - 5 + 'px'
    this.cursorDot.nativeElement.style.top = e.clientY - 50 + 'px'
  
    setTimeout(() => {
      this.cursorCircle.nativeElement.style.left = e.clientX - 6 + 'px'
      this.cursorCircle.nativeElement.style.top = e.clientY - 7 + 'px'
    }, 125)
  }
}
