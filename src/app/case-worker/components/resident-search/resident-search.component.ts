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
import { MenuItem } from 'primeng/api';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { ResidentSearchService } from '../../services/resident-search.service';


@Component({
  selector: 'app-resident-search',
  templateUrl: './resident-search.component.html',
  styleUrls: ['./resident-search.component.scss'],
  providers: [DatePipe],
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
  newDate: any;
  

  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();

  submitted = false;
  public showSpinner: boolean = true;
  public grayOut: boolean=true;
  public isVeteranFound: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private service: ResidentSearchService,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private datepipe: DatePipe,
    private cacheData: ClipBoardService
  ) {
    this.maxDateValue = new Date(new Date().getTime());
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
  }

  onSubmit(formdata: any){  
    console.log(formdata)
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

   resetData() {
    this.buildForm();
    this.setForm();
  }
}
