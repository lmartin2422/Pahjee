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
        },
        error: err => {
          console.error('❌ Error loading threads:', err);
          // Optional: user-facing fallback
          alert('Could not load message threads. Please try again later.');
        }
      });
    } else {
      console.warn('❌ No user_id found in localStorage');
    }
  }

  openConversation(partnerId: number): void {
    this.router.navigate(['/messages', partnerId]);
  }
}
