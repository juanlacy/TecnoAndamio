import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    Navbar,
    Sidebar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  sidenavOpened = signal(true);

  toggleSidenav(): void {
    this.sidenavOpened.update(value => !value);
  }
}
