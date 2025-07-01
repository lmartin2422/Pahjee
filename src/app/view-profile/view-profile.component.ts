import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  userId!: number;              // Logged-in user ID
  viewedUserId!: number;        // ID of the profile being viewed
  userData!: User;              // Data of the profile being viewed
  messageContent = '';
  isFavorite = false
  

  constructor(
  private route: ActivatedRoute,
  private router: Router, // ✅ ADD THIS
  private userService: UserService,
  private messageService: MessageService,
  private http: HttpClient
) {}


  ngOnInit(): void {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.userId = +storedUserId;
    } else {
      console.error('No logged-in user ID found in localStorage.');
      return;
    }

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam && !isNaN(+idParam)) {
        this.viewedUserId = +idParam;
        this.fetchUser();
        this.checkIfFavorite();
      } else {
        console.error('Invalid or missing user ID in route:', idParam);
      }
    });
  }

  fetchUser(): void {
    this.userService.getUserById(this.viewedUserId).subscribe({
      next: user => {
        this.userData = user;

        // Fetch profile picture
        this.http.get<any>(`http://127.0.0.1:8000/profile-picture/${this.viewedUserId}`).subscribe({
          next: (pic) => {
            this.userData.profile_picture = pic.image_url.startsWith('http')
              ? pic.image_url
              : `http://127.0.0.1:8000${pic.image_url}`;
          },
          error: () => {
            console.log('No profile picture found');
          }
        });

      },
      error: err => {
        console.error('Error fetching user data:', err);
      }
    });
  }



  checkIfFavorite(): void {
    this.http.get<any[]>(`http://127.0.0.1:8000/users/${this.userId}/favorites`).subscribe({
      next: favorites => {
        this.isFavorite = favorites.some((fav: any) => fav.id === this.viewedUserId);
      },
      error: err => {
        console.error('Error checking favorites:', err);
      }
    });
  }

  addFavorite(): void {
    if (!this.userId || !this.viewedUserId) return;

    this.http.post(`http://127.0.0.1:8000/users/${this.userId}/favorites/${this.viewedUserId}`, {})
      .subscribe({
        next: () => {
          this.isFavorite = true;
          alert('✅ User added to favorites!');
        },
        error: (err: any) => {
          console.error('Error adding favorite:', err);
          alert('❌ Could not add to favorites.');
        }
      });
  }

  removeFavorite(): void {
    if (!this.userId || !this.viewedUserId) return;

    this.http.delete(`http://127.0.0.1:8000/users/${this.userId}/favorites/${this.viewedUserId}`)
      .subscribe({
        next: () => {
          this.isFavorite = false;
          alert('❌ User removed from favorites.');
        },
        error: (err: any) => {
          console.error('Error removing favorite:', err);
          alert('❌ Could not remove from favorites.');
        }
      });
  }

  sendMessage(): void {
    const senderId = this.userId;
    const recipientId = this.viewedUserId;

    this.messageService.sendMessage(senderId, recipientId, this.messageContent).subscribe({
      next: () => {
        this.messageContent = '';
        // ✅ Redirect to messages page
        window.alert('Message sent!');
        this.router.navigate(['/messages']);
      },
      error: err => {
        window.alert('Failed to send message: ' + err.message);
      }
    });
  }

}
