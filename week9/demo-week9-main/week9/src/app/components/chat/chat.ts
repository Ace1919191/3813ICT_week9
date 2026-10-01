import { Component,OnInit,signal,inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chatservice } from '../../services/chatservice';
import { Msg } from '../../model/msg';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [FormsModule,DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit{
private chatService = inject(Chatservice);
  newmsg:Msg | null = null;
  messageout= signal("");
  messagesin = signal<Msg[]>([]);


  ngOnInit(): void {
    this.chatService.onMessage()
    .subscribe((msg)=>{
        this.messagesin.update((msgs)=>[...msgs,msg]);
          
    });
  }
    send(){
    if(this.messageout().trim()){
      this.newmsg = new Msg(this.messageout(),new Date(),1);
       this.chatService.sendMessage(this.newmsg);
      this.messageout.set("");
    }
  }
}
