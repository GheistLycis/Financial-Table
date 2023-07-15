import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/shared/services/session/session.service';
import { ProfileComponent } from './components/profile/profile.component';
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
      title: 'Home',
      link: ''
    },
    {
      type: 'link',
      title: 'Minhas Caixinhas',
      link: 'caixinhas'
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
          title: 'Tags',
          link: 'gerenciar/tags'
        },
      ],
    },
  ]

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userName = this.sessionService.getSession().user.name
  }
  
  logout(): void {
    this.sessionService.logout()
    this.router.navigate(['login'])
  }
  
  accessProfile(): void {
    const { result } = this.modalService.open(ProfileComponent, { size: 'md' })
    
    result.then((res: false | UserDTO) => {
      if(res) {
        const session = this.sessionService.getSession()
        
        session.user = res
        this.sessionService.setSession(session)
        this.userName = res.name
      }
    })
  }
}
