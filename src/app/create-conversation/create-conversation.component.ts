import { Component, OnInit } from '@angular/core';
import { WebService } from '../services/web.service';

@Component({
  selector: 'app-create-conversation',
  templateUrl: './create-conversation.component.html',
  styleUrls: ['./create-conversation.component.scss']
})
export class CreateConversationComponent implements OnInit {

  showConversationComponent = false;
  conversationName;
  nodeModelView = {
    symptom: '',
    question: '',
    type: '',
    first: true
  };
  typeList: any = ['positive', 'negative', 'neutral'];

  selectableListSymptoms: any = ['Headache', 'Happiness', 'Sadness', 'Pain'];
  selectableListQuestions: any = ['Do you have headache?', 'Do you feel happy?', 'Are you sad?', 'Are you in pain?'];

  nodesAddedView: any = [];
  tempListOfChildren: any = [];
  currentNodeParent;
  listNextParents: any = [];
  currentIndexOfParent = 0;
  isLeaf = false;
  indexParentNode = -1;
  index = 0;

  tree: any = [];
  id = 0;

  listView: any = [];

  currentParentView = {
    properties: {
      symptom: '',
      question: '',
      type: '',
      first: false
    }
  };

  simpleList: any = [];

  childrenListView: any = [];

  constructor(private webservice: WebService) { }

  ngOnInit() {
  }

  onAddNodeClicked() {
    console.log(this.nodeModelView);
    console.log('1');
    // start keep it as a tree
    if (this.nodeModelView.first) {
      this.currentNodeParent = {
        id: this.id++,
        parent: null,
        children: [] as any,
        properties: this.nodeModelView
      };
      this.currentParentView = this.currentNodeParent;
      this.saveNode(this.currentNodeParent);
      this.tree.push(this.currentNodeParent);

      const item = {
        id: this.currentNodeParent.id,
        properties: this.currentNodeParent.properties,
        parent: null
      };
      this.simpleList.push(item);
    } else {
      console.log('2');
      if (this.tempListOfChildren.length < 3) {
      const node = {
        id: this.id++,
        parent: this.currentNodeParent,
        children: [] as any,
        properties: this.nodeModelView
      };

      this.saveNode(node);
      this.tempListOfChildren.push(node);
      this.currentNodeParent.children.push(node);

      const item = {
        id: node.id,
        properties: node.properties,
        parent: {
          id: this.currentNodeParent.id,
          properties: this.currentNodeParent.properties
        }
      };
      this.simpleList.push(item);
      } else {

        if (this.listNextParents.length === 0) {
          this.listNextParents = this.tempListOfChildren;
        }

        this.updateIndexParent();
        this.tempListOfChildren = [];
        this.currentNodeParent = this.listNextParents[this.indexParentNode];
        this.currentParentView = this.currentNodeParent;
        const node = {
          id: this.id++,
          parent: this.currentNodeParent,
          children: [] as any,
          properties: this.nodeModelView
        };

        this.saveNode(node);
        this.tempListOfChildren.push(node);
        this.currentNodeParent.children.push(node);


        const item = {
          id: node.id,
          properties: node.properties,
          parent: {
            id: this.currentNodeParent.id,
            properties: this.currentNodeParent.properties
          }
        };
        this.simpleList.push(item);
      }

    }

    this.nodeModelView = {
      symptom: '',
      question: '',
      type: '',
      first: false
    };

  }

  private updateIndexParent() {
    if (this.indexParentNode < 3) {
      this.indexParentNode++;
    } else {
      this.indexParentNode = 0;
      this.listNextParents = this.tempListOfChildren;
    }
  }

  private saveNode(node: {
    id: number; parent: any; children: any;
    properties: { symptom: string; question: string; type: string; first: boolean; };
  }) {

    const viewObj = {
      id: node.id,
      properties: node.properties
    };

    this.listView.push(viewObj);
    this.nodesAddedView.push(node);
  }

  onNodeSelected(entry) {
    console.log(entry);
    this.childrenListView = this.simpleList.filter((e: any) => {
      if (e.parent != null) {
        return e.parent.id === entry.id;
      }
    });
    console.log(this.childrenListView);
    this.currentParentView = entry;
    // this.currentNodeParent = this.currentParentView;
  }

  async saveConversation() {
    console.log(this.simpleList);
    const obj = {
      name: this.conversationName,
      tree: this.simpleList
    };

    (await this.webservice.post('/addConversation', obj)).subscribe(async (res: any) => {
    }, async e => {
      console.log(e);
    });

    // this.showConversationComponent = true;
  }


  // TODO recreate the method where you find a node by id and return the parent and the children
}


