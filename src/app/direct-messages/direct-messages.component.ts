import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.css']
})
export class DirectMessagesComponent implements OnInit {
  userId: number = 0;
  partnerId: number = 0;
  messages: any[] = [];
  newMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
  this.userId = +(localStorage.getItem('user_id') || 0);
  this.partnerId = +this.route.snapshot.paramMap.get('partnerId')!;
  this.loadMessages();
  this.loadRecipientInfo(); // 👈 Add this!
}



  displayName: string = '';

  loadRecipientInfo(): void {
    this.http.get<any>(`http://127.0.0.1:8000/users/public/${this.partnerId}`)
      .subscribe(user => {
        this.displayName = user.first_name || user.username;
      });
  }


  loadMessages(): void {
    this.http.get<any[]>(`http://127.0.0.1:8000/messages/${this.userId}/${this.partnerId}`)
      .subscribe(data => this.messages = data);
  }

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
        this.loadMessages(); // reload messages after send
      });
  }
}

