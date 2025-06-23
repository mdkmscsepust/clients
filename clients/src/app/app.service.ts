import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<string>();
  apiUrl: string = "http://localhost:8000/chat-stream"

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open.');
    }
  }

  messages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  close(): void {
    this.socket?.close();
  }

  streamResponse(prompt: string): EventSource {
    const url = `${this.apiUrl}?prompt=${encodeURIComponent(prompt)}`;
    return new EventSource(url);
  }
}
