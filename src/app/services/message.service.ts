import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class MessageService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

sendMessage(senderId: number, recipientId: number, content: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/messages/send`, {
    sender_id: senderId,
    recipient_id: recipientId,
    content
  });
}

  getMessages(userId: number) {
    return this.http.get(`${this.baseUrl}/messages/${userId}`);
  }
}
