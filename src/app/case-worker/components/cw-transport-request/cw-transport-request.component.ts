import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TransportService } from '../../services/transport.service';
import { DatePipe } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cw-transport-request',
  templateUrl: './cw-transport-request.component.html',
  styleUrls: ['./cw-transport-request.component.scss'],
  providers: [MessageService],
})
export class CwTransportRequestComponent implements OnInit, OnChanges {
  @Input() requestFormObject: any;
  submitted = false;
  mobileMode = false;
  public minDateValue: any;
  public maxDateValue: any;
  public caseWorker: any;
  public firstName: any;
  public lastName: any;
  public appointmentDate: any;
  public time: any;
  public reason: any;
  public address: any;
  public city: any;
  public state!: any[];
  public zip: any;
  public coordinatorField: any;
  public nursingNotifiedField: any;
  public byField: any;
  public dateApproved: any;
  public dateField: any;
  defaultDate: any;
  tableData: any;
  selectedResident: any;
  public optionState: any;
  public newAappointmentDate:any;
  public msgCount!: number;
  public msgData: any;
  items!: MenuItem[];
  public isShowSpinner:boolean=false;
  public greyingOut: boolean= false;

  constructor(
    private formbuilder: FormBuilder,
    private service: TransportService,
    private datePipe: DatePipe,
    private router: Router,
    private messageService: MessageService,

  ) {
    this.minDateValue = new Date(new Date().getTime());
    this.maxDateValue = new Date(new Date().getTime());
  }
  
  transportRequestForm!: FormGroup;

  @HostListener('window:resize')
  onWindowResize() {
    this.mobileMode = window.innerWidth < 768;
  }

  ngOnInit(): void {
    this.onWindowResize();
    console.log("PATH--",this.router.url);
    // this.service.getTransportRequestFormData().subscribe((data) => {
    this.caseWorker = this.requestFormObject;
    console.log("data::",this.requestFormObject);
    //console.log("CaseWorker",this.caseWorker); 
    this.firstName = this.caseWorker.first_name;
    this.lastName = this.caseWorker.last_name;
    this.appointmentDate = this.caseWorker.appointment_date
    this.time = this.caseWorker.appointment_time;
    this.reason = this.caseWorker.reason_for_request;
    this.coordinatorField = this.caseWorker.transport_coordinator;
    this.nursingNotifiedField = this.caseWorker.nursing_notified;
    this.address = this.caseWorker.pick_up_address_main;
    this.city = this.caseWorker.pick_up_city;
    this.state = this.caseWorker.pick_up_state;
    console.log("State",this.state);

    this.zip = this.caseWorker.pick_up_zip_code;
    this.dateApproved = this.caseWorker.approved_date;
    this.byField = this.caseWorker.notified_by;
    this.dateField = this.caseWorker.date_filled;

    this.buildForm();
    console.log(this.transportRequestForm.value);
    // });
  }

  ngOnChanges(change: SimpleChanges): void {
    console.log('login');
    console.log(change);

    if (change?.requestFormObject) {
      this.caseWorker = change.requestFormObject.currentValue;
    }
    this.newAappointmentDate=this.datePipe.transform(this.caseWorker.appointment_date,'MM/dd/yyyy')
  }

  buildForm() {
    this.transportRequestForm = this.formbuilder.group({
      firstName: [this.firstName, Validators.required],
      lastName: [this.lastName, Validators.required],
      appointmentDate: [this.newAappointmentDate, Validators.required],
      time: [this.time, Validators.required],
      reason: [this.reason, Validators.required],
      address: [this.address, Validators.required],
      city: [this.city, Validators.required],
      state: [this.state, Validators.required],
      zip: [this.zip, Validators.required],
      coordinator: ['', Validators.required],
      approvedDate: [this.maxDateValue, Validators.required],
      nursingNotified: [false],
      by: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  get by() {
    return this.transportRequestForm.get('by');
  }

  get coordinator() {
    return this.transportRequestForm.get('coordinator');
  }
  get nursingNotified() {
    return this.transportRequestForm.get('nursingNotified');
  }

  get approvedDate() {
    return this.transportRequestForm.get('approvedDate');
  }

  get date() {
    return this.transportRequestForm.get('date');
  }

onSubmit() :void {
  this.isShowSpinner=true;
  this.greyingOut = true;

  let dateF= this.transportRequestForm.value.date
  this.transportRequestForm.value.date=dateF.toLocaleDateString();

  let dateApprove = this.transportRequestForm.value.approvedDate
  this.transportRequestForm.value.approvedDate = dateApprove.toLocaleDateString();

let obj={

  request_id:this.caseWorker.request_id,

  coordinator:this.transportRequestForm.value.coordinator,

  nursing_notified:this.transportRequestForm.value.nursingNotified,

  notified_by:this.transportRequestForm.value.by,

  approved_date:this.transportRequestForm.value.approvedDate,

  date:this.transportRequestForm.value.date
};
	this.service.approveTransportationForm(obj).subscribe((data)=>{    
    this.submitted = true;
	  console.log("Form submitted");
    if (data.responseStatus === 'SUCCESS') {
      this.isShowSpinner=false;
      this.greyingOut = false;
        this.sucessMessage();
        setTimeout(() => {
          this.refreshRequestComponent();
        }, 500);

    }else if (data.responseStatus === 'FAILURE') {
      this.errorMessage();
      this.refreshRequestComponent();
    }
    
   });
   
    console.log(this.transportRequestForm.value);
	  this.transportRequestForm.reset();
    // }
  }
  
    sucessMessage() {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Approved sucessfully',
      });
    }
  
    errorMessage() {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong',
      });
    }

   refreshRequestComponent() {
    const prev = this.router.routeReuseStrategy.shouldReuseRoute;
    const prevOSN = this.router.onSameUrlNavigation;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  
    this.router.navigate([this.router.url]);
    setTimeout(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = prev;
      this.router.onSameUrlNavigation = prevOSN;      
    }, 0);
  }

  reset() {
    this.buildForm();
    this.submitted = false;
  }
  // tableValues: any;
  // selectResident(index: number) {
  //   this.service.getTransportRequestFormData().subscribe((data) => {
  //     this.tableValues = data;
  //   });
  //   this.selectedResident = this.caseWorker[index];
  // }
}