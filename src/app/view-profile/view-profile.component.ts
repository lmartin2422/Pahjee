import { Component, OnInit, Inject } from '@angular/core';  // Import Inject from @angular/core
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';  // Import MAT_DIALOG_DATA here


@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTabsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule], 
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  userId: number | null = null;
  viewedUserId!: number;        
  userData!: User;              
  messageContent = '';
  isFavorite = false;
  otherPictures: string[] = []; 
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private http: HttpClient,
    private dialog: MatDialog
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

  openImageDialog(imageUrl: string): void {
  this.selectedImage = imageUrl;
  this.dialog.open(DialogContentComponent, {
    data: { imageUrl: this.selectedImage }  // Pass imageUrl to dialog
  });
}

closeImageDialog(): void {
  this.selectedImage = null;
  this.dialog.closeAll();  // Close all open dialogs
}


  fetchUser(): void {
    this.userService.getUserById(this.viewedUserId).subscribe({
      next: user => {
        this.userData = user;
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

    this.http.get<any[]>(`http://127.0.0.1:8000/pictures/user/${this.viewedUserId}/other-pictures`).subscribe({
      next: (pictures) => {
        this.otherPictures = pictures.map(pic => pic.image_url.startsWith('http')
          ? pic.image_url
          : `http://127.0.0.1:8000${pic.image_url}`);
      },
      error: () => {
        console.log('No other pictures found');
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
    this.http.post(`http://127.0.0.1:8000/users/${this.userId}/favorites/${this.viewedUserId}`, {}).subscribe({
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
    this.http.delete(`http://127.0.0.1:8000/users/${this.userId}/favorites/${this.viewedUserId}`).subscribe({
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
    if (this.userId === null || this.viewedUserId === null) {
      console.error('User ID or Viewed User ID is null');
      return;
    }
    const senderId = this.userId;  
    const recipientId = this.viewedUserId;

    this.messageService.sendMessage(senderId, recipientId, this.messageContent).subscribe({
      next: () => {
        this.messageContent = '';
        window.alert('Message sent!');
        this.router.navigate(['/messages']);
      },
      error: err => {
        window.alert('Failed to send message: ' + err.message);
      }
    });
  }
}



@Component({
  selector: 'dialog-content',
  template: `
    
    <div mat-dialog-content>
      <img [src]="data.imageUrl" alt="Enlarged Image" class="enlarged-image" />
    </div>
    <div mat-dialog-actions>
      <!-- Use dialogRef.close() to close the dialog -->
      <button mat-button (click)="dialogRef.close()">Close</button>
    </div>
  `,
})
export class DialogContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,  // Use MatDialogRef here
    @Inject(MAT_DIALOG_DATA) public data: any  // Inject data from the calling component
  ) {}
}
