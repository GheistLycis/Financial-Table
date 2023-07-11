import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/shared/services/session/session.service';
import { ProfileComponent } from './components/profile/profile.component';
import UserDTO from 'src/app/shared/DTOs/user';


type navItem = {
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
  userName!: string
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
          title: 'Tags',
          link: 'gerenciar/tags'
        },
      ],
    },
  ]

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.userName = this.sessionService.getSession().user.name
  }
  
  accessProfile(): void {
    const { result } = this.modalService.open(ProfileComponent, { size: 'lg' })
    
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
