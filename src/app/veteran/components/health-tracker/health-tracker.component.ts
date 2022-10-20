import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { HealthTrackerService } from '../../services/health-tracker.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-health-tracker',
  templateUrl: './health-tracker.component.html',
  styleUrls: ['./health-tracker.component.scss'],
  providers: [MessageService],
})
export class HealthTrackerComponent implements OnInit {
  showWeight: boolean = false;
  showTemperature: boolean = false;
  showBloodPressure: boolean = false;
  showBmi: boolean = false;
  showDrugScreen: boolean = false;
  showBreathalyzer: boolean = false;
  showBloodSugar: boolean = false;
  showOther: boolean = false;
  healthTrackerForm!: FormGroup;
  healthTrackerDetails: any;
  healthTrackerFormDetails: any;
  isFormFilled: boolean = false;
  veteranId!: number;
  cols!: any[];
  tableWeightValues!: any[];
  tableTemperatureValues!: any[];
  tableBloodPressureValues!: any[];
  tableBmiValues!: any[];
  tableDrugScreenValues!: any[];
  tableBreathalyzerValues!: any[];
  tableBloodSugarValues!: any[];
  tableOtherValues!: any[];
  isShowSpinner: boolean = true;
  showOverlay: boolean = true;
  isShowTable: boolean =false;

  constructor(
    private formBuilder: FormBuilder,
    private service: HealthTrackerService,
    private cacheData: ClipBoardService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.veteranId = this.cacheData.get('veteranId');
    this.buildForm();
    this.getHealthTrackerByVeteranId();
    this.showSelectedTable();
  }

  showFilledForm() {
    let currentHealthTrackerDetails = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.current_tracker === true;
      }
    );
    for (let i = 0; i < currentHealthTrackerDetails.length; i++) {
      var trackingSubject = currentHealthTrackerDetails[i]['tracking_subject'];
      var trackingDetails = currentHealthTrackerDetails[i];
      let trackerDate = new Date(
        new Date(trackingDetails.note_date).toUTCString()
      );
      let healthTrackerDate =
        trackerDate.getMonth() +
        1 +
        '/' +
        trackerDate.getDate() +
        '/' +
        trackerDate.getFullYear();
      console.log('tracker date', healthTrackerDate);
      if (trackingSubject === 'weight') {
        this.showWeight = true;
        this.healthTrackerForm.controls['weight'].patchValue({
          date: healthTrackerDate,
          measurement: trackingDetails.measurement,
          comments: trackingDetails.tracking_comments,
          currentTracker: trackingDetails.current_tracker,
          isUpdate: trackingDetails.current_tracker,
        });
      }
      if (trackingSubject === 'temperature') {
        this.showTemperature = true;
        this.healthTrackerForm.controls['temperature'].patchValue({
          date: healthTrackerDate,
          measurement: trackingDetails.measurement,
          comments: trackingDetails.tracking_comments,
          currentTracker: trackingDetails.current_tracker,
          isUpdate: trackingDetails.current_tracker,
        });
      }
      if (trackingSubject === 'blood pressure') {
        this.showBloodPressure = true;
        this.healthTrackerForm.controls['bloodPressure'].patchValue({
          date: healthTrackerDate,
          measurement: trackingDetails.measurement,
          comments: trackingDetails.tracking_comments,
          currentTracker: trackingDetails.current_tracker,
          isUpdate: trackingDetails.current_tracker,
        });
      }
      if (trackingSubject === 'BMI') {
        this.showBmi = true;
        this.healthTrackerForm.controls['BMI'].patchValue({
          date: healthTrackerDate,
          measurement: trackingDetails.measurement,
          comments: trackingDetails.tracking_comments,
          currentTracker: trackingDetails.current_tracker,
          isUpdate: trackingDetails.current_tracker,
        });
      }
      if (trackingSubject === 'drug screen') {
        this.showDrugScreen = true;
        this.healthTrackerForm.controls['drugScreen'].patchValue({
          date: healthTrackerDate,
          measurement: trackingDetails.measurement,
          comments: trackingDetails.tracking_comments,
          currentTracker: trackingDetails.current_tracker,
          isUpdate: trackingDetails.current_tracker,
        });
      }
      if (trackingSubject === 'breathalyzer') {
        this.showBreathalyzer = true;
        this.healthTrackerForm.controls['breathalyzer'].patchValue({
          date: healthTrackerDate,
          measurement: trackingDetails.measurement,
          comments: trackingDetails.tracking_comments,
          currentTracker: trackingDetails.current_tracker,
          isUpdate: trackingDetails.current_tracker,
        });
      }
      if (trackingSubject === 'blood sugar') {
        this.showBloodSugar = true;
        this.healthTrackerForm.controls['bloodSugar'].patchValue({
          date: healthTrackerDate,
          measurement: trackingDetails.measurement,
          comments: trackingDetails.tracking_comments,
          currentTracker: trackingDetails.current_tracker,
          isUpdate: trackingDetails.current_tracker,
        });
      }
      if (trackingSubject === 'other') {
        this.showOther = true;
        this.healthTrackerForm.controls['other'].patchValue({
          date: healthTrackerDate,
          measurement: trackingDetails.measurement,
          comments: trackingDetails.tracking_comments,
          currentTracker: trackingDetails.current_tracker,
          isUpdate: trackingDetails.current_tracker,
        });
      }
    }
  }

 async getHealthTrackerByVeteranId() {
    let resp =await this.service.getHealthTrackerByVeteranId(this.veteranId);
    resp.subscribe((data) => {
      console.log('Health Tracker API--->', data);
      this.healthTrackerDetails = data;
      if (this.healthTrackerDetails) {
        this.showOverlay = false;
        this.isShowSpinner = false;
        this.showFilledForm();
        this.showHealthTrackerTable();
        this.updateFormValidator();
      }
    });
  }

  showHealthTrackerTable() {
    if (this.showWeight) {
      this.tableWeightValues = this.healthTrackerDetails['data'].filter(
        (data: any) => {
          return data.tracking_subject.toUpperCase() === 'WEIGHT';
        }
      );
    }
    if (this.showTemperature) {
      this.tableTemperatureValues = this.healthTrackerDetails['data'].filter(
        (data: any) => {
          return data.tracking_subject.toUpperCase() === 'TEMPERATURE';
        }
      );
    }
    if (this.showBloodPressure) {
      this.tableBloodPressureValues = this.healthTrackerDetails['data'].filter(
        (data: any) => {
          return data.tracking_subject.toUpperCase() === 'BLOOD PRESSURE';
        }
      );
    }
    if (this.showBmi) {
      this.tableBmiValues = this.healthTrackerDetails['data'].filter(
        (data: any) => {
          return data.tracking_subject.toUpperCase() === 'BMI';
        }
      );
    }
    if (this.showDrugScreen) {
      this.tableDrugScreenValues = this.healthTrackerDetails['data'].filter(
        (data: any) => {
          return data.tracking_subject.toUpperCase() === 'DRUG SCREEN';
        }
      );
    }
    if (this.showBreathalyzer) {
      this.tableBreathalyzerValues = this.healthTrackerDetails['data'].filter(
        (data: any) => {
          return data.tracking_subject.toUpperCase() === 'BREATHALYZER';
        }
      );
    }
    if (this.showBloodSugar) {
      this.tableBloodSugarValues = this.healthTrackerDetails['data'].filter(
        (data: any) => {
          return data.tracking_subject.toUpperCase() === 'BLOOD SUGAR';
        }
      );
    }
    if (this.showOther) {
      this.tableOtherValues = this.healthTrackerDetails['data'].filter(
        (data: any) => {
          return data.tracking_subject.toUpperCase() === 'OTHER';
        }
      );
    } 
  }

  buildForm() {
    this.healthTrackerForm = this.formBuilder.group({
      weight: this.formBuilder.group({
        trackingSubject: ['weight'],
        date: [null],
        measurement: [''],
        comments: [''],
        isUpdate: [false],
        currentTracker: [true],
      }),
      temperature: this.formBuilder.group({
        trackingSubject: ['temperature'],
        date: [null],
        measurement: [''],
        comments: [''],
        isUpdate: [false],
        currentTracker: [true],
      }),
      bloodPressure: this.formBuilder.group({
        trackingSubject: ['blood pressure'],
        date: [null],
        measurement: [''],
        comments: [''],
        isUpdate: [false],
        currentTracker: [true],
      }),
      BMI: this.formBuilder.group({
        trackingSubject: ['BMI'],
        date: [null],
        measurement: [''],
        comments: [''],
        isUpdate: [false],
        currentTracker: [true],
      }),
      drugScreen: this.formBuilder.group({
        trackingSubject: ['drug screen'],
        date: [null],
        measurement: [''],
        comments: [''],
        isUpdate: [false],
        currentTracker: [true],
      }),
      breathalyzer: this.formBuilder.group({
        trackingSubject: ['breathalyzer'],
        date: [null],
        measurement: [''],
        comments: [''],
        isUpdate: [false],
        currentTracker: [true],
      }),
      bloodSugar: this.formBuilder.group({
        trackingSubject: ['blood sugar'],
        date: [null],
        measurement: [''],
        comments: [''],
        isUpdate: [false],
        currentTracker: [true],
      }),
      other: this.formBuilder.group({
        trackingSubject: ['other'],
        date: [null],
        measurement: [''],
        comments: [''],
        isUpdate: [false],
        currentTracker: [true],
      }),
    });
  }

  onSubmit() {
    this.showOverlay = true;
    this.isShowSpinner = true;
    this.healthTrackerFormDetails = this.healthTrackerForm.value;
    if (!this.showWeight) {
      delete this.healthTrackerFormDetails['weight'];
    }
    if (!this.showTemperature) {
      delete this.healthTrackerFormDetails['temperature'];
    }
    if (!this.showBloodPressure) {
      delete this.healthTrackerFormDetails['bloodPressure'];
    }
    if (!this.showBmi) {
      delete this.healthTrackerFormDetails['BMI'];
    }
    if (!this.showDrugScreen) {
      delete this.healthTrackerFormDetails['drugScreen'];
    }
    if (!this.showBreathalyzer) {
      delete this.healthTrackerFormDetails['breathalyzer'];
    }
    if (!this.showBloodSugar) {
      delete this.healthTrackerFormDetails['bloodSugar'];
    }
    if (!this.showOther) {
      delete this.healthTrackerFormDetails['other'];
    }
    this.checkNewTracker();
  }

  async checkNewTracker() {
    let healthTrackerValue: any[] = [];
    let updateHealthTrackerValue: any[] = [];
    console.log('initial value form', healthTrackerValue);
    let formValue: any[] = Object.values(this.healthTrackerFormDetails);
    var currentValue = this.healthTrackerDetails['data'].filter((data: any) => {
      return data.current_tracker === true;
    });
    var newHealthTracker = formValue.filter((data: any) => {
      return data.isUpdate === false;
    });
    for (let i = 0; i < newHealthTracker.length; i++) {
      healthTrackerValue.push(newHealthTracker[i]);
    }
    console.log('new Tracker Form', newHealthTracker);
    console.log('Form value', formValue);
    console.log('current value', currentValue);
    for (let i = 0; i < formValue.length; i++) {
      for (let j = 0; j < currentValue.length; j++) {
        if (formValue[i].trackingSubject === currentValue[j].tracking_subject) {
          var formValueDate = new Date(formValue[i].date);
          var formDate =
            formValueDate.getDate() +
            '/' +
            (formValueDate.getMonth() + 1) +
            '/' +
            formValueDate.getFullYear();
          var currentValueDate = new Date(
            new Date(currentValue[j].note_date).toUTCString()
          );
          var currentDate =
            currentValueDate.getDate() +
            '/' +
            (currentValueDate.getMonth() + 1) +
            '/' +
            currentValueDate.getFullYear();
          console.log('formDate', formDate);
          console.log('currentDate', currentDate);
          console.log('comparision', formDate === currentDate);
          if (
            formDate === currentDate &&
            formValue[i].measurement !== currentValue[j].measurement
          ) {
            console.log('changed form', formValue[i]);
            let oldTrackerValue = currentValue.filter((data: any) => {
              let trackerDate = new Date(
                new Date(data.note_date).toUTCString()
              );
              data.note_date =
                trackerDate.getMonth() +
                1 +
                '/' +
                trackerDate.getDate() +
                '/' +
                trackerDate.getFullYear();
              return data.tracking_subject === formValue[i].trackingSubject;
            });
            for(let i=0;i<oldTrackerValue.length;i++){
              updateHealthTrackerValue.push(oldTrackerValue[i]);
            }
            console.log('old', oldTrackerValue);
            healthTrackerValue.push(formValue[i]);
            console.log('new', formValue[i]);
            break;
          }
          if (formDate != currentDate) {
            console.log('date changed form', formValue[i]);
            let oldTrackerValue = currentValue.filter((data: any) => {
              let trackerDate = new Date(
                new Date(data.note_date).toUTCString()
              );
              data.note_date =
                trackerDate.getMonth() +
                1 +
                '/' +
                trackerDate.getDate() +
                '/' +
                trackerDate.getFullYear();
              return data.tracking_subject === formValue[i].trackingSubject;
            });
            for(let i=0;i<oldTrackerValue.length;i++){
              updateHealthTrackerValue.push(oldTrackerValue[i]);
            }
            console.log('date old', oldTrackerValue);
            healthTrackerValue.push(formValue[i]);
            console.log('date new', formValue[i]);
            break;
          }
          if (formValue[i].comments != currentValue[j].tracking_comments) {
            console.log('comments changed form', formValue[i]);
            let oldTrackerValue = currentValue.filter((data: any) => {
              let trackerDate = new Date(
                new Date(data.note_date).toUTCString()
              );
              data.note_date =
                trackerDate.getMonth() +
                1 +
                '/' +
                trackerDate.getDate() +
                '/' +
                trackerDate.getFullYear();
              return data.tracking_subject === formValue[i].trackingSubject;
            });
            for(let i=0;i<oldTrackerValue.length;i++){
              updateHealthTrackerValue.push(oldTrackerValue[i]);
            }
            console.log('comments old', oldTrackerValue);
            healthTrackerValue.push(formValue[i]);
            console.log('comments new', formValue[i]);
            break;
          }
        }
      }
    }
      var healthTrackerAllDetails:any[]=[];
      healthTrackerAllDetails.push(healthTrackerValue);
      healthTrackerAllDetails.push(updateHealthTrackerValue);
      console.log("test now",healthTrackerAllDetails)
      console.log("test now array 1",healthTrackerAllDetails[0])
      console.log("test now array 2",healthTrackerAllDetails[1])
      this.service
        .updateHealthTrackerByVeteranID(
          this.veteranId,
          healthTrackerAllDetails
        )
        .subscribe((response: any) => {
          console.log(response);
          this.healthTrackerDetails = response;
          if (response.responseStatus == 'SUCCESS') {
            this.showFilledForm();
            this.showHealthTrackerTable();
            this.showOverlay = false;
            this.isShowSpinner = false;
            this.sucessMessage();
            this.updateFormValidator();
          } else if (response.responseStatus == 'FAILURE') {
            this.errorMessage();
          }
        });
    
    for (let i = 0; i < healthTrackerValue.length; i++) {
      console.log('insert submitted form value', healthTrackerValue[i]);
    }
    for (let i = 0; i < updateHealthTrackerValue.length; i++) {
      console.log('update submitted form value', updateHealthTrackerValue[i]);
    }
    while (healthTrackerValue.length > 0) {
      healthTrackerValue.pop();
    }
    while (updateHealthTrackerValue.length > 0) {
      updateHealthTrackerValue.pop();
    }
  }

  updateFormValidator(){
    console.log("update valid form")
    let weightDate=this.healthTrackerForm.get('weight')?.get('date');
    let weightMeasurement=this.healthTrackerForm.get('weight')?.get('measurement');
    let temperatureDate=this.healthTrackerForm.get('temperature')?.get('date');
    let temperatureMeasurement=this.healthTrackerForm.get('temperature')?.get('measurement');
    let bloodPressureDate=this.healthTrackerForm.get('bloodPressure')?.get('date');
    let bloodPressureMeasurement=this.healthTrackerForm.get('bloodPressure')?.get('measurement');
    let bmiDate=this.healthTrackerForm.get('BMI')?.get('date');
    let bmiMeasurement=this.healthTrackerForm.get('BMI')?.get('measurement');
    let drugScreenDate=this.healthTrackerForm.get('drugScreen')?.get('date');
    let drugScreenMeasurement=this.healthTrackerForm.get('drugScreen')?.get('measurement');
    let breathalyzerDate=this.healthTrackerForm.get('breathalyzer')?.get('date');
    let breathalyzerMeasurement=this.healthTrackerForm.get('breathalyzer')?.get('measurement');
    let bloodSugarDate=this.healthTrackerForm.get('bloodSugar')?.get('date');
    let bloodSugarMeasurement=this.healthTrackerForm.get('bloodSugar')?.get('measurement');
    let otherDate=this.healthTrackerForm.get('other')?.get('date');
    let otherMeasurement=this.healthTrackerForm.get('other')?.get('measurement');
    this.isShowTable=false;
    if (!this.showWeight) {
      weightDate?.clearValidators(); 
      weightDate?.updateValueAndValidity();
      weightMeasurement?.clearValidators(); 
      weightMeasurement?.updateValueAndValidity();
    }else{
      weightDate?.setValidators([Validators.required]); 
      weightDate?.updateValueAndValidity();
      weightMeasurement?.setValidators([Validators.required]);
      weightMeasurement?.updateValueAndValidity();
      this.isShowTable=true;
    }
    if (!this.showTemperature) {
      temperatureDate?.clearValidators(); 
      temperatureDate?.updateValueAndValidity();
      temperatureMeasurement?.clearValidators(); 
      temperatureMeasurement?.updateValueAndValidity();
    }else{
      temperatureDate?.setValidators([Validators.required]); 
      temperatureDate?.updateValueAndValidity();
      temperatureMeasurement?.setValidators([Validators.required]);
      temperatureMeasurement?.updateValueAndValidity();
      this.isShowTable=true;
    }
    if (!this.showBloodPressure) {
      bloodPressureDate?.clearValidators(); 
      bloodPressureDate?.updateValueAndValidity();
      bloodPressureMeasurement?.clearValidators(); 
      bloodPressureMeasurement?.updateValueAndValidity(); 
    }else{
      bloodPressureDate?.setValidators([Validators.required]); 
      bloodPressureDate?.updateValueAndValidity();
      bloodPressureMeasurement?.setValidators([Validators.required]);
      bloodPressureMeasurement?.updateValueAndValidity();
      this.isShowTable=true;
    }
    if (!this.showBmi) {
      bmiDate?.clearValidators(); 
      bmiDate?.updateValueAndValidity();
      bmiMeasurement?.clearValidators(); 
      bmiMeasurement?.updateValueAndValidity();
    }else{
      bmiDate?.setValidators([Validators.required]); 
      bmiDate?.updateValueAndValidity();
      bmiMeasurement?.setValidators([Validators.required]);
      bmiMeasurement?.updateValueAndValidity();
      this.isShowTable=true;
    }
    if (!this.showDrugScreen) {
      drugScreenDate?.clearValidators(); 
      drugScreenDate?.updateValueAndValidity();
      drugScreenMeasurement?.clearValidators(); 
      drugScreenMeasurement?.updateValueAndValidity();
    }else{
      drugScreenDate?.setValidators([Validators.required]); 
      drugScreenDate?.updateValueAndValidity();
      drugScreenMeasurement?.setValidators([Validators.required]);
      drugScreenMeasurement?.updateValueAndValidity();
      this.isShowTable=true;
    }
    if (!this.showBreathalyzer) {
      breathalyzerDate?.clearValidators(); 
      breathalyzerDate?.updateValueAndValidity();
      breathalyzerMeasurement?.clearValidators(); 
      breathalyzerMeasurement?.updateValueAndValidity();
    }else{
      breathalyzerDate?.setValidators([Validators.required]); 
      breathalyzerDate?.updateValueAndValidity();
      breathalyzerMeasurement?.setValidators([Validators.required]);
      breathalyzerMeasurement?.updateValueAndValidity();
      this.isShowTable=true;
    }
    if (!this.showBloodSugar) {
      bloodSugarDate?.clearValidators(); 
      bloodSugarDate?.updateValueAndValidity();
      bloodSugarMeasurement?.clearValidators(); 
      bloodSugarMeasurement?.updateValueAndValidity();
    }else{
      bloodSugarDate?.setValidators([Validators.required]); 
      bloodSugarDate?.updateValueAndValidity();
      bloodSugarMeasurement?.setValidators([Validators.required]);
      bloodSugarMeasurement?.updateValueAndValidity();
      this.isShowTable=true;
    }
    if (!this.showOther) {
      otherDate?.clearValidators(); 
      otherDate?.updateValueAndValidity();
      otherMeasurement?.clearValidators(); 
      otherMeasurement?.updateValueAndValidity();
    }else{
      otherDate?.setValidators([Validators.required]); 
      otherDate?.updateValueAndValidity();
      otherMeasurement?.setValidators([Validators.required]);
      otherMeasurement?.updateValueAndValidity();
      this.isShowTable=true;
    }
  }

  showSelectedTable() {
    this.cols = [
      { field: 'note_date', header: 'Date', date: true, format: 'MM/dd/yyyy' },
      { field: 'measurement', header: 'Measurement' },
      { field: 'tracking_comments', header: 'Comment' },
    ];
  }

  resetForm() {
    this.isShowSpinner = true;
    this.showOverlay = true;
    this.buildForm();
    this.isFormFilled = false;
    this.getHealthTrackerByVeteranId();
    this.resetMessage();
    this.updateFormValidator();
  }

  changeCheckBox(){
    this.updateFormValidator();
  }

  sucessMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Health Tracker updated sucessfully',
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Health Tracker not updated',
    });
  }

  resetMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Health Tracker Form reset completed',
    });
  }
}
