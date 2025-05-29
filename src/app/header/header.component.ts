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
    localStorage.removeItem('token');
    this.userService.clearUsername(); // ✅ keep state in sync
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.usernameSub.unsubscribe(); // ✅ cleanup
  }
}
