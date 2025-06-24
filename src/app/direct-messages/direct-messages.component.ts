import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.css']
})
export class DirectMessagesComponent implements OnInit {
  messages: any[] = [];
  messageForm: FormGroup;
  recipientId: number = 0;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.messageForm = this.fb.group({
      message: ['']
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      this.router.navigate(['/login']);
      return;
    }



    this.route.params.subscribe(params => {
      this.recipientId = +params['id']; // Read /messages/:id
      this.fetchMessages();
    });
  }

  fetchMessages(): void {
    const userId = localStorage.getItem('userId');
    if (userId && this.recipientId) {
      this.http.get<any[]>(`http://127.0.0.1:8000/messages/${userId}/${this.recipientId}`)
        .subscribe(data => this.messages = data);
    }
  }

  sendMessage(): void {
    const userId = localStorage.getItem('user_id');  // ✅ match key from localStorage
    if (!userId || !this.messageForm.value.message) return;

    this.http.post(`http://127.0.0.1:8000/messages`, {
      sender_id: Number(userId),
      recipient_id: this.recipientId,
      content: this.messageForm.value.message
    }).subscribe(() => {
      this.messageForm.reset();
      this.fetchMessages();
    });
  }
}
