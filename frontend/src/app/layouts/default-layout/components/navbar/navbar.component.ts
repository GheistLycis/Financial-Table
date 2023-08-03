import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/services/session/session.service';
import UserDTO from 'src/app/shared/DTOs/user';
import { Router } from '@angular/router';


type navItem = {
  title: string
} & (link | menu)

type link = {
  type: 'link'
  link: string
}

type menu = {
  type: 'menu'
  link: string
  children: { title: string, link: string }[]
}


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userName!: string
  navItems: navItem[] = [
    {
      type: 'link',
      title: 'Dashboard',
      link: 'dashboard'
    },
    {
      type: 'link',
      title: 'Minhas Caixinhas',
      link: 'caixinhas'
    },
    {
      type: 'menu',
      title: 'Gerenciar',
      link: 'gerenciar',
      children: [
        {
          title: 'Anos',
          link: 'anos'
        },
        {
          title: 'Meses',
          link: 'meses'
        },
        {
          title: 'Tags',
          link: 'tags'
        },
      ],
    },
  ]

  constructor(
    private sessionService: SessionService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.userName = this.sessionService.getSession().user.name
  }

  logout(): void {
    this.sessionService.logout()
    this.router.navigate(['login'])
  }
  
  updateLocalUser(user: UserDTO): void {
    const session = this.sessionService.getSession()
    
    session.user = user
    this.sessionService.setSession(session)
    this.userName = user.name
  }
}
