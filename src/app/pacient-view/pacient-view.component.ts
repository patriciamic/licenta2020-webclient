import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebService } from '../services/web.service';

@Component({
  selector: 'app-pacient-view',
  templateUrl: './pacient-view.component.html',
  styleUrls: ['./pacient-view.component.scss']
})
export class PacientViewComponent implements OnInit, OnDestroy {

  isBack = false;
  isHide = false;
  isMedDisplayed = true;
  isConvDisplayed = false;
  isDrugDetailsShowing = false;
  isStatisticsDaySelected = false;

  data: any;
  medication: any = [];
  messages: any = [];

  currentMedSelected: any;

  statistics: any = [];

  // {
  //   id: number
  //   date: '',
  //   positive: number,
  //   negative: number,
  //   neutral: number
  // }

  constructor(private webservice: WebService) {
    this.data = JSON.parse(localStorage.getItem('patient'));
    console.log('patient arrived ', this.data);

    this.webservice
      .get('/getTreatment/' + this.data.patient.id)
      .subscribe((res: any) => {
        console.log(res);
        this.medication = res;
        this.addViewAttributes(this.medication);
      },
        e => { console.log(e.error); }
      );
  }

  ngOnDestroy(): void {
    console.log('destroy pacient view');
  }

  ngOnInit() { }

  back() {
    this.isBack = true;
    this.isHide = true;
  }

  onViewConversationClicked() {
    console.log('view conv clicked');
  }


  showMedication() {
    console.log('show medication');
    this.isMedDisplayed = true;
    this.isConvDisplayed = false;
  }

  showConversation() {
    this.isMedDisplayed = false;
    this.isConvDisplayed = true;
    this.webservice
      .get('/getConversation/' + this.data.patient.id)
      .subscribe((res: any) => {
        console.log('getConversation');
        console.log(res);
        this.messages = res;

        this.pipeDateForView(this.messages);

        // TODO statistics
        this.messages.forEach(element => {
          const obj = this.calculateStatistics(element);
          this.statistics.push(obj);
        });

      },
        e => { console.log(e.error); }
      );
  }

  pipeDateForView(list: any) {
    for (let i = 0; i < list.length; i++) {
      const temp = list[i].info.dateTime.split('T');
      list[i].info.dateTime = temp[0] + ' ' + temp[1].substring(0, 5);
    }
    console.log('AAA', list);

  }

  showDrugDetails(entry: any) {
    console.log('Med selected', entry);
    this.currentMedSelected = entry;
    this.isDrugDetailsShowing = true;

  }

  addViewAttributes(list: any) {

    list.forEach(element => {
      let countMorning = 0;
      let countAfternoon = 0;
      let countEvening = 0;
      let countNight = 0;
      element.treatment.listHoursAndMinutes.forEach(hm => {
        if (Number(hm.hour) >= 6 && Number(hm.hour) < 12) {
          countMorning++;
        }
        if (Number(hm.hour) >= 12 && Number(hm.hour) < 18) {
          countAfternoon++;
        }

        if (Number(hm.hour) >= 18 && Number(hm.hour) < 22) {
          countEvening++;
        }

        if (Number(hm.hour) >= 22 && Number(hm.hour) < 23) {
          countNight++;
        }
      });

      element.treatment.morning = countMorning;
      element.treatment.afternoon = countAfternoon;
      element.treatment.evening = countEvening;
      element.treatment.night = countNight;

    });
  }


  calculateStatistics(element: any) {
    const obj = {
      id: element.info.id,
      dateTime: element.info.dateTime,
      positive: 0,
      negative: 0,
      neutral: 0
    };

    element.conversation.forEach(item => {
      switch (item.properties.type) {
        case 'Positive':
          obj.positive++;
          break;
        case 'Negative':
          obj.negative++;
          break;
        case 'Neutral':
          obj.neutral++;
          break;
      }
    });

    obj.positive = Math.round(obj.positive * 100 / element.conversation.length);
    obj.negative = Math.round(obj.negative * 100 / element.conversation.length);
    obj.neutral = Math.round(obj.neutral * 100 / element.conversation.length);

    return obj;
  }

  onStatisticsDayClicked(entry) {
    this.isStatisticsDaySelected = true;
    const convSelected = this.messages.filter(( e: any ) => e.info.id === entry.id );
    console.log(convSelected);
  }

}
