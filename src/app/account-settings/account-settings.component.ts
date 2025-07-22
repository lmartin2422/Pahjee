import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  // Boolean flags for settings toggles
  notificationsEnabled: boolean = true; // Assuming notifications are enabled by default

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Logic to fetch current user's settings (notifications) if any from an API or local storage
  }

  // Method to deactivate account
  // deactivateAccount() {
  //   if (confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
  //     const userId = localStorage.getItem('user_id');
  //     if (userId) {
  //       // Call the API to deactivate account
  //       this.userService.deactivateAccount(Number(userId)).subscribe(response => {
  //         alert("Your account has been deactivated.");
  //         this.logout();  // Logout the user after account deactivation
  //       }, error => {
  //         alert("Failed to deactivate account.");
  //       });
  //     }
  //   }
  // }

  deactivateAccount() {
  if (confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
    let userId = null;

    if (typeof window !== 'undefined') {
      userId = localStorage.getItem('user_id');
    }

    if (userId) {
      // Call the API to deactivate account
      this.userService.deactivateAccount(Number(userId)).subscribe(response => {
        alert("Your account has been deactivated.");
        this.logout();  // Logout the user after account deactivation
      }, error => {
        alert("Failed to deactivate account.");
      });
    }
  }
}


  // Method to toggle notification preferences
  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
    // Logic to update the notification settings on the backend or local storage
  }

  // Log out function
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }
}
