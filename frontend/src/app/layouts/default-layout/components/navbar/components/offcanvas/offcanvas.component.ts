import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NavItem, navItems } from '@interfaces/NavItem';
import { SessionService } from '@services/session/session.service';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.scss']
})
export class OffcanvasComponent implements OnInit {
  navItems: NavItem[] = [
    {
      type: 'link' as 'link' | 'menu',
      title: 'Home',
      link: '',
    }
  ].concat(navItems)
  collapses: { [collapse: string]: boolean } = { 
    profile: true 
  }

  constructor(
    public activeOffcanvas: NgbActiveOffcanvas,
    public sessionService: SessionService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.navItems.forEach(({ type, title }) => {
      if(type == 'menu') this.collapses[title] = true
    })
  }
}
