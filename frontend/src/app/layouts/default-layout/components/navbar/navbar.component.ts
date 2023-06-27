import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/services/session/session.service';


export type navItem = {
  type: string,
  title: string,
  link?: string
  children?: navItem[]
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user!: string
  navItems: navItem[] = [
    {
      type: 'link',
      title: 'Home',
      link: ''
    },
    {
      type: 'menu',
      title: 'Configurações',
      children: [
        {
          type: 'link',
          title: 'Grupos',
          link: 'configs/groups'
        },
        {
          type: 'link',
          title: 'Classes',
          link: 'configs/classes'
        },
      ],
    }
  ]

  constructor(
    private session: SessionService,
  ) {}

  ngOnInit(): void {
    this.user = this.session.getUser() || ''
  }
}
