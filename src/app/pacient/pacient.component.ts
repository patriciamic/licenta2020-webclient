import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebService } from '../services/web.service';

@Component({
  selector: 'app-pacient',
  templateUrl: './pacient.component.html',
  styleUrls: ['./pacient.component.scss']
})
export class PacientComponent implements OnInit, OnDestroy {

  showPatientComponent = true;
  showConversationComponent = false;


  isAddPacientClicked = false;
  displayDisease = false;
  displayMedication = false;
  isTableDisplayed = true;

  diseaseOptionSelected = '';
  drugOptionSelected = '';

  pacientModel = {
    name: '',
    phoneNumber: '',
    address: '',
    diseases: '',
    medication: '',
    birthDate: ''
  };

  diseaseModel = {
    name: '',
    symptoms: ''
  };

  medicationModel = {
    name: '',
    timesPerDay: '',
    daysInterval: '',
    startDate: '',
    stopDate: ''
  };

  diseases: any = [];
  medication: any = [];
  pacient: any = {};
  patients: any = [];

  allDiseases: any = [];
  allDrugs: any = [];

  hourAndMinutes: any;
  listHourAndMinutes: any = [];

  constructor(private webservice: WebService) {
    this.getPatients();
    this.getDrugs();
    this.getDiseases();
  }

  private getDiseases() {
    this.webservice
      .get('/getDiseases')
      .subscribe((res: any) => {
        this.allDiseases = res;
      }, e => { console.log(e.error); });
  }

  private getDrugs() {
    this.webservice
      .get('/getDrugs')
      .subscribe((res: any) => {
        this.allDrugs = res;
      }, e => { console.log(e.error); });
  }

  private getPatients() {
    this.webservice
      .get('/getPatients/2')
      .subscribe((res: any) => {
        this.patients = [];
        res.forEach(element => {
          element.patient.birthDate = this.getAge(element.patient.birthDate);
          this.patients.push(element);
        });
        console.log(this.patients);
        this.patients.forEach(element => {
          this.webservice
            .get('/getConversation/' + element.patient.id)
            .subscribe((result: any) => {
              console.log('getConversation');
              console.log(result);
              // this.messages = res;
              // this.pipeDateForView(this.messages);
              // TODO statistics
              // this.messages.forEach(element => {
              //   const obj = this.calculateStatistics(element);
              //   this.statistics.push(obj);
              // });
              element.countMessages = result.length;
              console.log(element.countMessages);
              console.log(result[0]);

              if (element.countMessages !== 0) {
                element.lastResult = this.calculateStatistics(result[0]);
              } else {
                element.lastResult = '-';
              }

              try {
                element.dateOfLastConversation = result[0].info.dateTime.split('T')[0];
              } catch (ex) {
                element.dateOfLastConversation = '-';
              }

            },
              e => { console.log(e.error); }
            );
        });
      }, e => { console.log(e.error); });
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

    console.log(obj);
    const max = Math.max(obj.positive, obj.neutral, obj.negative);
    console.log(max);
    if ( max === obj.positive) {
      return max + '% Positive';
    }

    if ( max === obj.negative) {
      return max + '% Negative';
    }

    if ( max === obj.neutral) {
      return max + '% Neutral';
    }
  }

  getAge(dateTimeString: any) {
    const birthday: any = new Date(dateTimeString);
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  ngOnInit() {
    this.isTableDisplayed = true;
  }

  ngOnDestroy(): void {
  }

  addPacient() {
    this.isAddPacientClicked = true;
  }

  async savePacient() {
    this.isAddPacientClicked = false;

    this.pacient = {
      diseases: this.diseases,
      medication: this.medication,
      patient: {
        name: this.pacientModel.name,
        phoneNumber: this.pacientModel.phoneNumber,
        address: this.pacientModel.address,
        birthDate: this.pacientModel.birthDate,
      }
    };

    this.patients.push(this.pacient);
    (await this.webservice.post('/addPatient/2', this.pacient)).subscribe(async (res: any) => {
      this.getPatients();
    }, async e => {
      console.log(e);
    });

    this.pacientModel = {
      name: '',
      phoneNumber: '',
      address: '',
      diseases: '',
      medication: '',
      birthDate: ''
    };

    this.diseases = [];
    this.medication = [];
  }

  addMedication() {
    this.displayMedication = true;
    this.listHourAndMinutes = [];
  }

  saveMedication() {

    const obj: any = {};
    this.allDrugs.forEach(element => {
      if (element.name === this.drugOptionSelected) {
        obj.identity = element.identity;
        obj.name = element.name;
      }
    });

    this.medication.push({
      drug: obj,
      timesPerDay: this.listHourAndMinutes.length,
      daysInterval: this.medicationModel.daysInterval,
      startDate: this.medicationModel.startDate,
      stopDate: this.medicationModel.stopDate,
      listHourAndMinutes: [...this.listHourAndMinutes]
    });

    this.medicationModel = {
      name: '',
      timesPerDay: '',
      daysInterval: '',
      startDate: '',
      stopDate: '',
    };
    this.listHourAndMinutes = [];
    this.displayMedication = false;
  }

  cancel(value: string) {
    switch (value) {
      case 'all': this.isAddPacientClicked = false; break;
      case 'disease': this.displayDisease = false; break;
      case 'med': this.displayMedication = false; break;
    }
  }

  clickPatient(value) {
    this.isTableDisplayed = false;
    localStorage.setItem('patient', JSON.stringify(value));
  }


  addDiseaseNew() {
    const obj: any = {};
    this.allDiseases.forEach(element => {
      if (element.name === this.diseaseOptionSelected) {
        obj.identity = element.identity;
        obj.name = element.name;
      }
    });
    console.log(obj);
    this.diseases.push(obj);
  }

  addDrug() {
    const obj: any = {};
    this.allDrugs.forEach(element => {
      if (element.name === this.drugOptionSelected) {
        obj.identity = element.identity;
        obj.name = element.name;
      }
    });
    console.log(obj);
    this.medication.push(obj);
  }

  addHourAndMinutes() {
    console.log(this.hourAndMinutes);
    this.listHourAndMinutes.push(this.hourAndMinutes);
  }

  onConversationClick() {
    this.showPatientComponent = false;
    this.showConversationComponent = true;
  }

}
