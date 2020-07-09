import { Component, OnInit } from '@angular/core';
import { WebService } from '../services/web.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {


  showPatient = false;
  isModalShowing = false;
  showCreateConversationComponent = false;
  conversationListViewModel: any = [];
  conversationSelected;
  selectableList: any = [];
  myOptionSelected = '';

  constructor(private webservice: WebService) {
    this.webservice
      .get('/getConversations/')
      .subscribe((res: any) => {
        console.log(res);
        this.conversationListViewModel = res;
      },
        e => { console.log(e.error); }
      );

    this.webservice
      .get('/getPatients/2')
      .subscribe((res: any) => {
        console.log(res);
        this.selectableList = res;
      },
        e => { console.log(e.error); }
      );
  }

  ngOnInit() {
    console.log('conversation component on init');
    // TODO here you can update the conversations list
  }

  back() {
    this.showPatient = true;
  }

  onConversationClicked(entry) {
    console.log(entry);
    this.conversationSelected = entry;
    this.isModalShowing = true;
  }

  saveAsociation(value) {
    console.log(value);
    this.isModalShowing = false;

    this.selectableList.forEach( async (element) => {
      if (element.patient.name === value) {
        const obj = {
          idPatient: element.patient.id,
          idConversation: this.conversationSelected.id
        };
        console.log(obj);
        (await this.webservice.post('/associateConversation/2', obj)).subscribe(async (res: any) => {
          console.log(res);
        }, async e => {
          console.log(e);
        });
      }
    });
  }


  loadCreateConversationComponent() {
    this.showCreateConversationComponent = true;
  }

}
