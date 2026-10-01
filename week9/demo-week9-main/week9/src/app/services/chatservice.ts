import { Injectable,signal } from '@angular/core';
import { Observable } from 'rxjs';
import {io,Socket} from 'socket.io-client';
import { Msg } from '../model/msg';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Chatservice {
 private socket:Socket;
  messages = signal<Msg[]>([]);
  private readonly apiserver = environment.apiServer; 

  constructor() {
 
  this.socket = io(this.apiserver);
}
 sendMessage(msg: Msg): void {
    this.socket.emit('newmsg',msg);
  }

 onMessage():Observable<Msg>{
  return new Observable((observer)=>{
  this.socket.on('newmsg', (msg:Msg)=>{
    observer.next(msg);
    })
  })
  }
}
