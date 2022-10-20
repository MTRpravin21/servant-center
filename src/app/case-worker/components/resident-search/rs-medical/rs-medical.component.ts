import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { HealthTrackerService } from 'src/app/veteran/services/health-tracker.service';

@Component({
  selector: 'app-rs-medical',
  templateUrl: './rs-medical.component.html',
  styleUrls: ['./rs-medical.component.scss']
})
export class RsMedicalComponent implements OnInit {
  healthTrackerDetails: any;
  cols!: any[];
  veteranId!:number;
  isTableEmpty:boolean=false;
  tableWeightValues!: any[];
  tableTemperatureValues!: any[];
  tableBloodPressureValues!: any[];
  tableBmiValues!: any[];
  tableDrugScreenValues!: any[];
  tableBreathalyzerValues!: any[];
  tableBloodSugarValues!: any[];
  tableOtherValues!: any[];
  showWeight: boolean = false;
  showTemperature: boolean = false;
  showBloodPressure: boolean = false;
  showBmi: boolean = false;
  showDrugScreen: boolean = false;
  showBreathalyzer: boolean = false;
  showBloodSugar: boolean = false;
  showOther: boolean = false;

  constructor(private service: HealthTrackerService,
    private cacheData: ClipBoardService) { }

  ngOnInit(): void {
    this.veteranId=this.cacheData.get("selectedResidentVeteranId");
    console.log("selected-veteran-Id-health-tracker",this.veteranId)
    this.showSelectedTable();
    this.getHealthTrackerByVeteranId();
  }

  showSelectedTable(){
    this.cols = [
      { field: 'note_date', header: 'Date' ,date: true,format: 'MM/dd/yyyy'},
      { field: 'measurement', header: 'Measurement' },
      { field: 'tracking_comments', header: 'Comment' },
  ];
  }

  getHealthTrackerByVeteranId() {
    let resp = this.service.getHealthTrackerByVeteranId(this.veteranId);
    resp.subscribe((data) => {
      console.log('Health Tracker API--->', data);
      this.healthTrackerDetails = data;
      if(data.data.length===0){
        this.isTableEmpty=true;
      }else{
      this.showHealthTrackerTable();
      }
    });
  }

  showHealthTrackerTable() {
    this.tableWeightValues = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.tracking_subject.toUpperCase() === 'WEIGHT';
      }
    );
    if(this.tableWeightValues.length!=0){
       this.showWeight=true;
    }
    this.tableTemperatureValues = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.tracking_subject.toUpperCase() === 'TEMPERATURE';
      }
    );
    if(this.tableTemperatureValues.length!=0){
      this.showTemperature=true;
   }
    this.tableBloodPressureValues = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.tracking_subject.toUpperCase() === 'BLOOD PRESSURE';
      }
    );
    if(this.tableBloodPressureValues.length!=0){
      this.showBloodPressure=true;
   }
    this.tableDrugScreenValues = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.tracking_subject.toUpperCase() === 'DRUG SCREEN';
      }
    );
    if(this.tableDrugScreenValues.length!=0){
      this.showDrugScreen=true;
   }
    this.tableBreathalyzerValues = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.tracking_subject.toUpperCase() === 'BREATHALYZER';
      }
    );
    if(this.tableBreathalyzerValues.length!=0){
      this.showBreathalyzer=true;
   }
    this.tableBloodSugarValues = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.tracking_subject.toUpperCase() === 'BLOOD SUGAR';
      }
    );
    if(this.tableBloodSugarValues.length!=0){
      this.showBloodSugar=true;
   }
    this.tableBmiValues = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.tracking_subject.toUpperCase() === 'BMI';
      }
    );
    if(this.tableBmiValues.length!=0){
      this.showBmi=true;
   }
    this.tableOtherValues = this.healthTrackerDetails['data'].filter(
      (data: any) => {
        return data.tracking_subject.toUpperCase() === 'OTHER';
      }
    );
    if(this.tableOtherValues.length!=0){
      this.showOther=true;
   }
  }

}
