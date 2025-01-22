export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    BgColor?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: 'Home' },
    {
        title: 'Dashboard',
        icon: 'widget-add-line-duotone',
        to: '/dashboard'
    },
    {
        title: 'Jobs',
        icon: 'zip-file-outline',
        to: '/jobs'
    },
    {
        title: 'Divisions',
        icon: 'remove-folder-line-duotone',
        to: '/divisions'
    }
];

export default sidebarItem;
