import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidebar') sidebar!: MatSidenav; // Access MatSidenav instance
  isDesktop: boolean = window.innerWidth >= 768;
  activeTab: string = 'users';
  title = 'user-management-system';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = window.innerWidth >= 768;

    // Automatically open/close the sidebar based on screen size
    if (this.sidebar) {
      this.sidebar.mode = this.isDesktop ? 'side' : 'over';
      if (this.isDesktop) {
        this.sidebar.open();
      } else {
        this.sidebar.close();
      }
    }
  }

  toggleSidebar(sidebar: MatSidenav): void {
    sidebar.toggle(); // Toggle the sidebar programmatically
  }

  closeSidebar(): void {
    if (!this.isDesktop) {
      this.sidebar.close();
    }
  }
}
