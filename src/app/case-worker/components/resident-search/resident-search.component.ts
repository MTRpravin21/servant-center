import { DatePipe, DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { ResidentSearchService } from '../../services/resident-search.service';


@Component({
  selector: 'app-resident-search',
  templateUrl: './resident-search.component.html',
  styleUrls: ['./resident-search.component.scss'],
  providers: [DatePipe,MessageService],
})
export class ResidentSearchComponent implements OnInit {
  options = [
    { name: 'Veteran', code: 'VT' },
  ];

  public selectedResident: any;
  public tableValues: any;
  public allValues: any;
  public residentSearchForm!: FormGroup;
  public result: any;
  public maxDateValue: any;
  public data:any;
  public resdata:any;
  public submit:boolean=true;
  public addNewVeteran: boolean=false;
  newDate: any;
  selecteVetId!: number;
  ia1: boolean = true;
  details: any;
  livingStatus: any;
  dateofbirth: any;
  submitted: boolean = false;
  personalDetails!: FormGroup; 
  cwNickName: any[] = [];
  cwUserName: any[] = [];
  usernameInvalid: boolean= false;
  party_id!:number;
  party_type!: string;
  

  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();

  public showSpinner: boolean = true;
  public grayOut: boolean=true;
  public isVeteranFound: boolean = false;
  public isVeteranSelected: boolean = false;
  consent = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  genderList = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Others', value: 'O' },
  ];
  maritalStatusList = [
    { label: 'Married', value: 'Married' },
    { label: 'Seperated', value: 'Seperated' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' },
    { label: 'Single', value: 'Single' },
    { label: 'Same Sex Relationship', value: 'Same Sex Relationship' },
    { label: 'Living Together', value: 'Living Together' },
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private service: ResidentSearchService,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private datepipe: DatePipe,
    private cacheData: ClipBoardService,
    private messageService: MessageService
  ) {
    this.maxDateValue = new Date(new Date().getTime());
    this.getCWNickName();
    this.setForm();
  }
  setForm(){
    this.service.getResidentSearchData().subscribe((res) => {
      this.isVeteranFound=false;
      setTimeout(()=>{
      this.resdata=res;
      if(this.resdata){
        this.showSpinner=false;
        this.grayOut=false;
      }
      this.allValues = this.resdata;
      this.tableValues=this.allValues;
    },100);
    });
  }

  selectResident(event: any) {
    this.isVeteranSelected = true
    console.log("selected veteran id",event.data.veteran_id)
    this.cacheData.set('selectedResidentVeteranId',event.data.veteran_id)
    this.router.navigateByUrl('case-worker/resident-search/initial-assessment/page-1', { skipLocationChange: false })
  }
  
  columns = [
    { header: 'FirstName', field: 'first_name' },
    { header: 'LastName', field: 'last_name' },
    { header: 'Birthdate', field: 'date_of_birth',date: true,format: 'dd/MM/yyyy' },
    { header: 'City', field: 'city' },
    { header: 'Address', field: 'address_main' },
  ];

  tabMenuItems: MenuItem[] = [
    {
      label: 'Initial Assessment',
      routerLink: ['./initial-assessment'],
      skipLocationChange: true,
    },
    {
      label: 'Treatment Plan',
      routerLink: ['./treatment-plan'],
      skipLocationChange: true,
    },
    {
      label: 'Weekly Progress notes',
      routerLink: ['./weekly-progress'],
      skipLocationChange: true,
    },
    {
      label: 'Consent Agreements',
      routerLink: ['./consent-agreements'],
      skipLocationChange: true,
    },
    {
      label: 'Financial',
      routerLink: ['./financial'],
      skipLocationChange: true,
    },
    { label: 'Medical', routerLink: ['./medical'], skipLocationChange: true },
    {
      label: 'Other/Misc. Correspondence',
      routerLink: ['./misc'],
      skipLocationChange: true,
    },
  ];
  ngOnInit(): void {
    this.buildForm();
    this.getCWUserName();
  }

  onSubmit(formdata: any){  
    console.log(formdata)
    this.isVeteranSelected = false;
    this.tableValues=this.allValues;
    if(formdata.birthDate){
      this.newDate = this.datepipe.transform(formdata.birthDate, 'yyyy/MM/dd');
      formdata.birthDate = this.newDate;
    }
      this.result = this.tableValues.filter((index: any) => {
        let indexDate = this.datepipe.transform(index.date_of_birth, 'yyyy/MM/dd');        
      if(!formdata.birthDate){
        if(formdata.firstName && formdata.lastName){
          return (
            index.first_name?.toLowerCase() === formdata.firstName?.toLowerCase() &&
            index.last_name?.toLowerCase() === formdata.lastName?.toLowerCase() 
          );
        }else{
          return (
            index.first_name?.toLowerCase() === formdata.firstName?.toLowerCase()  
          );
        } 
      } else {
          return (
            index.first_name?.toLowerCase() === formdata.firstName?.toLowerCase() &&
            indexDate == formdata.birthDate
          );
      } 
    });
    console.log('this is result',this.result)
    if(this.result.length > 0){
      this.isVeteranFound=false;
    }
    this.tableValues = this.result; 
    if(this.tableValues.length === 0){
      this.isVeteranFound = true;
    } 
  }

  buildForm(): void {
    console.log(this.addNewVeteran);
    this.residentSearchForm = this.formBuilder.group({
      type: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      birthDate: [''],
    });
  }

  get firstName() {
    return this.residentSearchForm.get('firstName');
  }

  get lastName() {
    return this.residentSearchForm.get('lastName');
  }

  get birthDate() {
    return this.residentSearchForm.get('birthDate');
  }

  get iaPage1PD() {
    return this.personalDetails.controls;
  }

  addnew(){
    this.addNewVeteran=true;
    this.showSpinner=true;
    this.grayOut=true;
    //this.cacheData.set('selectedResidentVeteranId',0);
    console.log(this.addNewVeteran);
    this.buildnewVeteranForm();
  }

  buildnewVeteranForm(){
    this.party_type='veteran';
    this.party_id=Math.floor(100000 + Math.random() * 900000);
    this.personalDetails = this.formBuilder.group({
      party_id: [this.party_id],
      party_type: [this.party_type],
      recordNo: ['',Validators.required],
      intakeDate: ['',Validators.required],
      hmisId: ['',Validators.required],
      pFirstName: ['', Validators.required],
      middleInitial: [''],
      pLastName: ['', Validators.required],
      nickName: ['', Validators.required],
      pdob: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      ssn: ['', Validators.required],
      sex: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      race: ['', Validators.required],
      primaryPhone: ['', Validators.required],
      email: ['',Validators.required],
      primaryLanguage: ['', Validators.required],
      addressMain: ['', Validators.required],
      addressLine2: [''],
      state: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zipcode: ['', Validators.required],
      contactPerson: ['', Validators.required],
      relationship: ['', Validators.required],
      contactPersonAddress: ['', Validators.required],
      phone: ['', Validators.required],
      religiousPreferences: ['', Validators.required],
      hobbiesInterests: ['', Validators.required],
      consent: ['', Validators.required],
      caseWorkerId: ['',Validators.required],
      caseWorkerUserName: ['',Validators.required],
    });
    setTimeout(()=>{
      this.showSpinner=false;
      this.grayOut=false;}
      ,500);
      console.log(this.personalDetails.value);
  }

  getCWNickName(){
    this.service.getCwNickName().subscribe((res)=>{     
      for(let i=0;i<res.data.length;i++){
        this.cwNickName.push({label:res.data[i].nick_name, value:res.data[i].case_worker_id || res.data[i].nick_name});
      }
        console.log(this.cwNickName);
      });
  }

  getCWUserName(){
    this.service.getCwUsername().subscribe((res)=>{     
      for(let i=0;i<res.data.length;i++){
        this.cwUserName.push({label:res.data[i].username, value:res.data[i].username});
      }
        console.log(this.cwUserName);
      });
  }

  validateCWUserName(username:any){
    for(let i=0;i<this.cwUserName.length;i++){
      if(username.value==this.cwUserName[i].value){
        this.usernameInvalid = true;
        break;
      } else {
        this.usernameInvalid = false;
      }
    }    
  }

  saveForm(){
    this.showSpinner=true;
    this.grayOut=true;
    console.log(this.personalDetails.value)
    let birth_date= this.personalDetails.value.pdob;
    this.personalDetails.value.pdob=birth_date.toLocaleDateString();
    let intake_date=this.personalDetails.value.intakeDate;
    this.personalDetails.value.intakeDate=intake_date.toLocaleDateString();
    this.service.addnewVeteran(this.personalDetails.value).subscribe((response) => {
      if (response.responseStatus === 'SUCCESS') {
        this.showSpinner = false;
        this.grayOut = false;
        this.successMessage();
        this.setForm();
      } else if (response.responseStatus === 'FAILURE') {
        this.errorMessage();
      }
      this.addNewVeteran=false;
      this.isVeteranSelected=false;
      console.log('New veteran added Successfully');
    });
  }

  successMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully Added Veteran Details',
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Failed',
      detail: 'Something Went Wrong!',
    });
  }
  
  resetData() {
    this.buildForm();
    this.setForm();
    this.isVeteranSelected = false;
    this.addNewVeteran=false;
  }

  resetForm(){
      this.personalDetails.reset();
  }
}
