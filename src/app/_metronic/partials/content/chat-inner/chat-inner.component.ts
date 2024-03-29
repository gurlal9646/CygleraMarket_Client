import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  defaultMessages,
  defaultUserInfos,
  messageFromClient,
  MessageModel,
  UserInfoModel,
} from './dataExample';
import { RequestForApprovalService } from 'src/app/services/rfa.service';
import moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-chat-inner',
  templateUrl: './chat-inner.component.html',
})
export class ChatInnerComponent implements OnInit {
  @Input() isDrawer: boolean = false;
  @Input() requestId:string= '';
  @HostBinding('class') class = 'card-body';
  @HostBinding('id') id = this.isDrawer
    ? 'kt_drawer_chat_messenger_body'
    : 'kt_chat_messenger_body';
  @ViewChild('messageInput', { static: true })
  messageInput: ElementRef<HTMLTextAreaElement>;

  private messages$: BehaviorSubject<Array<MessageModel>> = new BehaviorSubject<
    Array<MessageModel>
  >(defaultMessages);
  messagesObs: any;
  user:UserModel;

  constructor(private rfaService:RequestForApprovalService,private authService:AuthService) {
   this.user = this.authService.getcurrentUserValue();

  }

  submitMessage(): void {
    const text = this.messageInput.nativeElement.value;
    const newMessage: MessageModel = {
      user: 2,
      type: 'out',
      text,
      time: 'Just now',
    };
    this.addMessage(newMessage);
    // auto answer
    setTimeout(() => {
      this.addMessage(messageFromClient);
    }, 4000);
    // clear input
    this.messageInput.nativeElement.value = '';
  }

  addMessage(newMessage: MessageModel): void {
    const messages = [...this.messages$.value];
    messages.push(newMessage);
    this.messages$.next(messages);
  }

  getUser(user: number): UserInfoModel {
    return defaultUserInfos[user];
  }

  getMessageCssClass(message: MessageModel): string {
    return `p-5 rounded text-gray-900 fw-bold mw-lg-400px bg-light-${
      message.type === 'in' ? 'info' : 'primary'
    } text-${message.type === 'in' ? 'start' : 'end'}`;
  }


  async getConversation(requestId: any) {
    const response = await this.rfaService.getConversation(requestId);
    if (response.code == 1) {
      this.messagesObs = response.data;
      for(let message of this.messagesObs){
        if(this.user.roleId === 1){
          message.type = 'in';
        }
        else{
          message.type = 'out';
        }
        message.time = moment(message.createdAt).fromNow();
      }
    }
    else{
      this.messagesObs = [];
    }
  }

  ngOnInit(): void {
    this.getConversation(this.requestId); 
  }
}
