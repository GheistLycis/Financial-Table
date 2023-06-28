import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/services/session/session.service';


export type navItem = {
  type: 'link' | 'menu'
  title: string
  link?: string
  children?: { title: string, link: string }[]
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
      title: 'Gerenciar',
      children: [
        {
          title: 'Anos',
          link: 'gerenciar/anos'
        },
        {
          title: 'Meses',
          link: 'gerenciar/meses'
        },
        {
          title: 'Categorias',
          link: 'gerenciar/categorias'
        },
        {
          title: 'Grupos',
          link: 'gerenciar/grupos'
        },
      ],
    },
  ]

  constructor(
    private session: SessionService,
  ) {}

  ngOnInit(): void {
    this.user = this.session.getUser() || ''
  }
}
