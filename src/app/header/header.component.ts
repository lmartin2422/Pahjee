import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) {}

  logout() {
    // Add your actual logout logic here (e.g., clear token, call backend)
    localStorage.removeItem('token'); // or however you're storing auth
    this.router.navigate(['/login']);
  }
}
