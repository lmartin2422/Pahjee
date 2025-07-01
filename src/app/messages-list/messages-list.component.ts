import { Component, OnInit } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {
  threads: any[] = [];
  userId: number = 0;
  selectedPartnerId: number | null = null;
  messages: any[] = [];
  partnerNames: { [userId: number]: string } = {}
  partnerData: { [userId: number]: { name: string, profilePic: string } } = {};

  constructor(private http: HttpClient, private router: Router) {}

  
  
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
                profilePic: profilePicUrl
              };
            },
            error: () => {
              // fallback if profile picture not found
              this.partnerData[userId] = {
                name: user.first_name || user.username,
                profilePic: 'assets/default-avatar.png'
              };
            }
          });
        },
        error: () => {
          this.partnerData[userId] = {
            name: 'User ' + userId,
            profilePic: 'assets/default.jpg'
          };
        }
      });
    }


  



openConversation(partnerId: number): void {
  this.router.navigate(['/direct-messages', partnerId]);
}

}
