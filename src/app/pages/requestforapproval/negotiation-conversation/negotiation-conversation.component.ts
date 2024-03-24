import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RequestForApprovalService } from 'src/app/services/rfa.service';
import moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from 'src/app/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-negotiation-conversation',
  templateUrl: './negotiation-conversation.component.html',
  styleUrl: './negotiation-conversation.component.scss'
})
export class NegotiationConversationComponent implements OnInit {
  @Input() isDrawer: boolean = false;
  @Input() requestId:string= '';
  @HostBinding('class') class = 'card-body';
  @HostBinding('id') id = this.isDrawer
    ? 'kt_drawer_chat_messenger_body'
    : 'kt_chat_messenger_body';
  @ViewChild('messageInput', { static: true })
  messageInput: ElementRef<HTMLTextAreaElement>;
  messagesObs: any;
  user:UserModel;
  isTextareaEmpty:boolean = true;

  constructor(private rfaService:RequestForApprovalService,private authService:AuthService) {
   this.user = this.authService.getcurrentUserValue();

  }
  ngOnInit(): void {
    this.getConversation(this.requestId); 
  }

  async submitMessage() {
    const request = {
      requestId: this.requestId,
      message: this.messageInput.nativeElement.value,
      buyerId: this.user.uniqueId,
    };
    const response = await this.rfaService.addConversation(request);
    if (response.code == 1) {
      this.messageInput.nativeElement.value = '';
            await this.getConversation(this.requestId);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: response.message,
        timer: 5000,
      });
    }
  }

 


  getMessageCssClass(message: any): string {
    return `p-5 rounded text-gray-900 fw-bold mw-lg-400px bg-light-${
      message.type === 'in' ? 'info' : 'primary'
    } text-${message.type === 'in' ? 'start' : 'end'}`;
  }


  async getConversation(requestId: any) {
    const response = await this.rfaService.getConversation(requestId);
    if (response.code == 1) {
      this.messagesObs = response.data;
      for(let message of this.messagesObs){
        message.text = message.message;
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

  checkInput() {
    this.isTextareaEmpty = this.messageInput.nativeElement.value.trim() === '';
    console.log(this.isTextareaEmpty);
  }


}

