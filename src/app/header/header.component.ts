import { Component, OnDestroy, OnInit } from '@angular/core';
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

export class HeaderComponent implements OnDestroy, OnInit {
  username: string | null = null;
  userId: string | null = null;
  private usernameSub: Subscription;

  constructor(private userService: UserService, private router: Router) {
    this.usernameSub = this.userService.username$.subscribe(name => {
      this.username = name;
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('user_id'); // ✅ safe to use here
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    this.userService.clearUsername();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.usernameSub.unsubscribe();
  }
}
