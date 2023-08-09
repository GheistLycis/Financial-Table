import { Component, OnInit } from '@angular/core';
import { SessionService } from '@services/session/session.service';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { OffcanvasComponent } from './components/offcanvas/offcanvas.component';
import { navItems } from '@interfaces/NavItem';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userName!: string
  navItems = navItems

  constructor(
    private offcanvas: NgbOffcanvas,
    public sessionService: SessionService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.userName = this.sessionService.getSession().user.name
  }

  openOffcanvas(): void {
    this.offcanvas.open(OffcanvasComponent, { panelClass: 'w-75 overflow-y-no-bar' })
  }
}
