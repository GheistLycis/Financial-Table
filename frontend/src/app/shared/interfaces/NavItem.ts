export interface NavItem {
    title: string
    type: 'link' | 'menu'
    link: string
    children?: { 
        title: string
        link: string 
    }[]
}

export const navItems: NavItem[] = [
    {
        type: 'link',
        title: 'Dashboard',
        link: 'dashboard'
    },
    {
        type: 'link',
        title: 'Caixinhas',
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