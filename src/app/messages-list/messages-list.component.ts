import { Component, OnInit } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { Router, RouterModule } from '@angular/router';  // Add RouterModule here




import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';




import { ImageUploadDialogComponent } from '../image-upload-dialog/image-upload-dialog.component';


@Component({
  selector: 'app-messages-list',
  standalone: true,
 imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    FormsModule,
    RouterModule  // Add RouterModule here to enable [routerLink] in standalone components

  ],  
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {
  threads: any[] = [];
  userId: number | null = null;
  selectedPartnerId: number | null = null;
  messages: any[] = [];
  partnerNames: { [userId: number]: string } = {}
  partnerData: { [userId: number]: { userId: number; name: string; profilePic: string } } = {};
  isTyping = false;
  messageContent: string = ''
  
  
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, ) {}

  
  
  ngOnInit(): void {
  const storedUserId = localStorage.getItem('user_id');
  console.log('✅ user_id from localStorage:', storedUserId);

  if (storedUserId) {
    this.userId = +storedUserId;

    this.http.get<any[]>(`http://127.0.0.1:8000/messages/threads/${this.userId}`).subscribe({
      next: data => {
        console.log('✅ Threads loaded:', data);
        this.threads = data;

        // 🔽 Load display names for each partner in the threads
        this.threads.forEach(thread => {
          const partnerId = thread.sender_id === this.userId ? thread.recipient_id : thread.sender_id;
          this.loadPartnerName(partnerId);
        });
      },
      error: err => {
        console.error('❌ Error loading threads:', err);
        alert('Could not load message threads. Please try again later.');
      }
    });
  } else {
    console.warn('❌ No user_id found in localStorage');
  }
}



 loadPartnerName(userId: number): void {
  if (this.partnerData[userId]) return;

  this.http.get<any>(`http://127.0.0.1:8000/users/public/${userId}`).subscribe({
    next: user => {
      // Load profile picture separately
      this.http.get<any>(`http://127.0.0.1:8000/profile-picture/${userId}`).subscribe({
        next: pic => {
          const profilePicUrl = pic.image_url.startsWith('http')
            ? pic.image_url
            : `http://127.0.0.1:8000${pic.image_url}`;

          this.partnerData[userId] = {
            name: user.first_name || user.username,
            profilePic: profilePicUrl,
            userId: user.id,  // Store the userId here
          };
        },
        error: () => {
          // fallback if profile picture not found
          this.partnerData[userId] = {
            name: user.first_name || user.username,
            profilePic: 'assets/default-avatar.png',
            userId: user.id,  // Store the userId here
          };
        }
      });
    },
    error: () => {
      this.partnerData[userId] = {
        name: 'User ' + userId,
        profilePic: 'assets/default.jpg',
        userId: userId,  // Store the userId here
      };
    }
  });
}



    openMediaDialog() {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent);

    dialogRef.afterClosed().subscribe((file) => {
      if (file) {
        // Handle file upload logic and send message with the file
      }
    });
  }

   onTyping() {
    this.isTyping = true;
    // Optionally reset typing after some time
    setTimeout(() => this.isTyping = false, 1000);
  }

  sendMessage() {
    this.isTyping = false;
    // Logic to send the message
  }



  openConversation(partnerId: number): void {
  // Navigate to the conversation page using the partnerId
  this.router.navigate(['/direct-messages', partnerId]);
}




goBack(): void {
  this.router.navigate(['/messages']); // Navigate back to the messages list
}



}
