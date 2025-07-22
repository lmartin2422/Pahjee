import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';  // Add RouterModule here


@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [CommonModule, FormsModule,  RouterModule],
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.css']
})
export class DirectMessagesComponent implements OnInit {
  userId: number = 0;
  partnerId: number = 0;
  messages: any[] = [];
  newMessage: string = '';
  recipientProfile: any = null;  // This will hold the recipient's profile information.

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

 ngOnInit(): void {
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
  this.userId = storedUserId ? +storedUserId : 0;  // If storedUserId is null, fallback to 0
  this.partnerId = +this.route.snapshot.paramMap.get('partnerId')!;
  this.loadMessages();
  this.loadRecipientInfo(); // 👈 Add this to load recipient profile info
}

  
  // ngOnInit(): void {
  //   this.userId = +(localStorage.getItem('user_id') || 0);
  //   this.partnerId = +this.route.snapshot.paramMap.get('partnerId')!;
  //   this.loadMessages();
  //   this.loadRecipientInfo(); // 👈 Add this to load recipient profile info
  // }

    loadRecipientInfo(): void {
      this.http.get<any>(`http://127.0.0.1:8000/users/public/${this.partnerId}`)
        .subscribe(user => {
          // Fetch profile picture for the recipient
          this.http.get<any>(`http://127.0.0.1:8000/profile-picture/${this.partnerId}`).subscribe(pic => {
            this.recipientProfile = {
              name: user.first_name || user.username,
              profilePic: pic.image_url.startsWith('http') 
                ? pic.image_url 
                : `http://127.0.0.1:8000${pic.image_url}`  // Fix the URL path to the profile picture
            };
          });
        });
}


  // Load the messages for this conversation
  loadMessages(): void {
    this.http.get<any[]>(`http://127.0.0.1:8000/messages/${this.userId}/${this.partnerId}`)
      .subscribe(data => this.messages = data);
  }

  // Send a message to the recipient
  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const body = {
      sender_id: this.userId,
      recipient_id: this.partnerId,
      content: this.newMessage
    };

    this.http.post(`http://127.0.0.1:8000/messages/send`, body)
      .subscribe(() => {
        this.newMessage = '';
        this.loadMessages(); // Reload messages after sending
      });
  }

  // Navigate back to the messages list
  goBack(): void {
    this.router.navigate(['/messages']); // Redirect to the messages list page
  }
}
