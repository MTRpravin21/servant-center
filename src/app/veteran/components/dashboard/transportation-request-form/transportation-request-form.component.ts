import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { VeteranprofileService } from '../../../services/veteranprofile.service';
import { states, destinationAddresses } from '../../../app.constants';
import { VeteranProfileResponse } from 'src/app/shared/models/VeteranProfileResponse';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { MessageService } from 'primeng/api';

interface State {
  value: string;
}
interface DropDown {
  name: string;
}
@Component({
  selector: 'app-transportation-request-form',
  templateUrl: './transportation-request-form.component.html',
  styleUrls: ['./transportation-request-form.component.scss'],
  providers: [MessageService],
})
export class TransportationRequestFormComponent implements OnInit {
  formTitle = 'TRANSPORTATION REQUEST FORM';

  transportRequestForm!: FormGroup;
  submitted = false;
  public state: any;
  public minDateValue: any;
  public maxDateValue: any;
  public veteranData: any;
  public firstName: any;
  public lastName: any;
  public data: any;
  public states: State[];
  public dateRequested:any;
  // selectedState!: State;
  selectedState!: any;
  //userId!: number;
  veteran_id!:number;
  public destinationAddresses!: DropDown[];
  public showOtherAddressTextBox: boolean = false;
  public phone: any;
  public greyingOut: boolean= false;
  public isShowSpinner:boolean=false;


  
  constructor(
    private cacheData: ClipBoardService,
    private formBuilder: FormBuilder,
    private service: VeteranprofileService,
    private messageService: MessageService

  ) {
    this.minDateValue = new Date(new Date().getTime()); 
    this.states = states;
    this.destinationAddresses = destinationAddresses;
  }
  
  ngOnInit(): void {
    // this.userId = this.cacheData.get("veteranId")
    this.veteran_id = this.cacheData.get("veteranId")
    this.selectedState = this.states[1];
        
    this.service
      .getProfileData(this.veteran_id)
      .subscribe((data: VeteranProfileResponse) => {
        this.veteranData = data;
        console.log("Veteran Data is : ",this.veteranData);
        this.firstName = this.veteranData.data[0].first_name;
        this.lastName = this.veteranData.data[0].last_name;
        this.phone = this.veteranData.data[0].contact_person_phone  
        console.log("Phone",this.phone);
       
              

        this.buildForm();
        console.log(this.transportRequestForm.value);
      });
  }
 
  buildForm() {
    this.transportRequestForm = this.formBuilder.group({
      veteran_id:[this.veteran_id],
      contactNumber:[this.phone],
      firstName: [this.firstName, Validators.required],
      lastName: [this.lastName, Validators.required],
      reason: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      time: ['', Validators.required],
      destinationAddress: ['', Validators.required],
      destinationAddress2: [''],
      city: ['', Validators.required],
      selectedState: ['', Validators.required],
      zipcode: ['', Validators.required],
    });
  }

  get reason() {
    return this.transportRequestForm.get('reason');
  }
  get appointmentDate() {
    return this.transportRequestForm.get('appointmentDate');
  }
  get time() {
    return this.transportRequestForm.get('time');
  }
  get city() {
    return this.transportRequestForm.get('city');
  }

  get destinationAddress() {
    return this.transportRequestForm.get('destinationAddress');
  }

  get destinationAddress2() {
    return this.transportRequestForm.get('destinationAddress2');
  }

  get zipcode() {
    return this.transportRequestForm.get('zipcode');
  }
  

  get control() {
    return this.transportRequestForm.controls;
  }

  onChange(evt: any) {
    console.log('changed option', evt);
    if (evt.value.value === 'other') {
      this.showOtherAddressTextBox = true;
      this.transportRequestForm.controls["destinationAddress2"].setValidators([Validators.required]);
      this.transportRequestForm.patchValue({
        city: '',
        selectedState: '',
        zipcode: '', 
      });
    } else {
      this.transportRequestForm.controls["destinationAddress2"].clearValidators();
      this.transportRequestForm.controls['destinationAddress2'].updateValueAndValidity()

      this.showOtherAddressTextBox = false;
      if (evt.value.value === 'Kernersville') {
        this.transportRequestForm.patchValue({
          city: 'Kernersville',
          selectedState: { value: 'NC', name: 'North Carolina' },
          zipcode: '27284',
        });
      } else if (evt.value.value === 'Salisbury') {
        this.transportRequestForm.patchValue({
          city: 'Salisbury',
          selectedState: { value: 'NC', name: 'North Carolina' },
          zipcode: '28144',
        });
      } else if (evt.value.value === 'Durham') {
        this.transportRequestForm.patchValue({
          city: 'Durham',
          selectedState: { value: 'NC', name: 'North Carolina' },
          zipcode: '27705',
        });
      }
    }
  }
  reset() {
    this.buildForm();
    this.submitted = false;
  }

  onSubmit(): void {
    this.greyingOut = true;
    this.isShowSpinner=true;


  let appointDate= this.transportRequestForm.value.appointmentDate
  this.transportRequestForm.value.appointmentDate=appointDate.toLocaleDateString();
  
  this.transportRequestForm.value.dateRequested= (new Date().getMonth() +1) +'/' + new Date().getUTCDate() +'/' + new Date().getFullYear();

   let t=new Date(this.transportRequestForm.value.time)
   this.transportRequestForm.value.time = t.getHours() +':'+ t.getMinutes() +':' +t.getSeconds()
   
  this.transportRequestForm.value.selectedState=this.transportRequestForm.value.selectedState.name;
  
    if (this.transportRequestForm.value.destinationAddress.name === 'Other') {
        this.transportRequestForm.value.destinationAddress= this.transportRequestForm.value.destinationAddress2+" " +this.transportRequestForm.value.selectedState
        +" "+this.transportRequestForm.value.city+" "+this.transportRequestForm.value.zipcode
    }else{
      this.transportRequestForm.value.destinationAddress= this.transportRequestForm.value.destinationAddress.name;
    }

	this.service.saveTransportationForm(this.transportRequestForm.value).subscribe((data)=>{
    this.submitted = true;
	  console.log("Form Submitted");
    console.log("FormData ",this.transportRequestForm.value);
    
    if (data.responseStatus === 'SUCCESS') {
     this.sucessMessage();
     this.greyingOut = false;
     this.isShowSpinner=false;

    }else if (data.responseStatus === 'FAILURE') {
     this.errorMessage();
    }
   });
   
   //this.transportRequestForm.reset();
   this.transportRequestForm.controls["reason"].reset()
   this.transportRequestForm.controls["appointmentDate"].reset()
   this.transportRequestForm.controls["time"].reset()
   this.transportRequestForm.controls["city"].reset()
   this.transportRequestForm.controls["selectedState"].reset()
   this.transportRequestForm.controls["destinationAddress2"].reset()
   this.transportRequestForm.controls["destinationAddress"].reset()
	 this.transportRequestForm.controls["zipcode"].reset()
  }

  sucessMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Form Saved Sucessfully',
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Something Went Wrong',
    });
  }
}
