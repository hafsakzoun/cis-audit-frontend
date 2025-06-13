import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/script-generator', title: 'Script Generator',  icon:'person', class: '' },
    { path: '/scripts-list', title: 'My Scripts',  icon:'content_paste', class: '' },
    { path: '/rules-extractor', title: 'Rules Extractor',  icon:'library_books', class: '' },
    { path: '/audit-history', title: 'Audit History',  icon:'bubble_chart', class: '' },
    { path: '/my-profile', title: 'My profile',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/about', title: 'About',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
