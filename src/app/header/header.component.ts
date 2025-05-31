import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Add this
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnDestroy {
  username: string | null = null;
  private usernameSub: Subscription;

   constructor(private userService: UserService, private router: Router) {
    this.usernameSub = this.userService.username$.subscribe(name => {
      this.username = name;
    });
  }

  logout() {
    // Clear all relevant localStorage items
    localStorage.removeItem('token'); // your old token
    localStorage.removeItem('access_token'); // the real token used in requests
    localStorage.removeItem('username'); // username
    localStorage.removeItem('user'); // in case user data was cached

    // Clear any in-memory user state
    this.userService.clearUsername();

    // Optionally add: clear user data if you're storing more info in the service
    // this.userService.clearUserData();

    // Redirect to login
    this.router.navigate(['/login']);

  }

  ngOnDestroy() {
    this.usernameSub.unsubscribe(); // ✅ cleanup
  }
}
