import { Inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { InfoService } from './info.service';
import { isPlatformBrowser } from '@angular/common';
import { connect } from 'http2';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private isBrowser = false;
  public defined : WritableSignal<boolean> = signal(false)

  constructor(
    private infoService: InfoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
    if (this.isBrowser) {
      this.socket = io(this.infoService.baseUrl)
      if (this.socket) {
        this.defined.set(true)
      }
    }
  }

  isConnected(): boolean {
    console.log(this.socket)
    if (this.socket) {
      return true
    }
    return false
  }

  sendMessage(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  onMessage(message: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(message, (dataReceived: any) => {
        observer.next(dataReceived);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
