import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { VeteranDashboardService } from '../../services/veteran-dashboard.service';

@Component({
  selector: 'app-treatment-plan',
  templateUrl: './treatment-plan.component.html',
  styleUrls: ['./treatment-plan.component.scss'],
  providers: [MessageService],
})
export class TreatmentPlanComponent implements OnInit {
  public treatmentPlanForm!: FormGroup;
  public treatmentIssuesForm!: FormGroup;
  public treatmentGoals: any;
  public issuesArray: any = [];
  public delete: boolean = true;
  public error: boolean = false;
  public minDateValue: any;
  public eventId: any;
  public data: any;
  public formView = true;
  public treatmentArr: any;
  public formData:any;
  public vetID: number;
  public intake_date:any;
  public date_of_birth:any;
 public persons=['Client','Case Manager','RN']
 public showSpinner:boolean=true;
 public grayOut: boolean=true;
  treatmentArray: any;
 
  constructor(
    private formBuilder: FormBuilder,
    private service: VeteranDashboardService,
    private cacheData:ClipBoardService,
    private messageService: MessageService,
    private router: Router,
    private datepipe: DatePipe,
  ) {
    this.minDateValue = new Date();
    this.vetID=this.cacheData.get("veteranId")
    this.setForm();

  }

  ngOnInit(): void {
    this.buildForm();
  }

  setForm() {
    this.service.getTreatmentData(this.vetID).subscribe((res:any) => {
      this.data = res.data;      
      if(this.data){
        this.showSpinner=false;
        this.grayOut=false;
      }
      this.intake_date = this.datepipe.transform(this.data.intake_date, 'dd/MM/yyyy');
      this.date_of_birth = this.datepipe.transform(this.data.date_of_birth, 'dd/MM/yyyy');
      console.log('TP API data->',res);
      this.buildForm();
      this.treatmentPlanForm.patchValue({
        firstName: this.data.first_name,
        lastName: this.data.last_name,
        recordNo: this.data.record_number,
        dateOfBirth1: this.date_of_birth,
        intakeDOB: this.intake_date,
        hmisIdNo: this.data.hmis_id,
        veteranDiagnosis: this.data.diagnosis,
        veteranSupports: this.data.supports,
        veteranStrengths: this.data.strengths,
        veteranNotes: this.data.notes
        //treatmentIssues: this.data.treatmentIssues
      });
    });
  }
  buildForm() {
    let d = 
      new Date().getMonth()+
      1+
      '/'+
      new Date().getUTCDate()+
      '/'+
      new Date().getFullYear();

    this.treatmentPlanForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      recordNo: ['', Validators.required],
      dateOfBirth1: ['', Validators.required],
      intakeDOB: ['', Validators.required],
      hmisIdNo: ['', Validators.required],
      veteranDiagnosis: ['', Validators.required],
      veteranSupports: ['', Validators.required],
      veteranStrengths: ['', Validators.required],
      treatmentIssues: this.initializeIssuesFormArray(),
      veteranNotes: ['', Validators.required],
      addedDate:[d]
    });

    this.treatmentIssuesForm = this.formBuilder.group({
      physicalHealth: this.initializeIssuesArray(),
      mentalHealth: this.initializeIssuesArray(),
      substanceUse: this.initializeIssuesArray(),
      housing: this.initializeIssuesArray(),
      incomeLegal: this.initializeIssuesArray(),
      relationships:this.initializeIssuesArray(),
      education:this.initializeIssuesArray(),
      benefits:this.initializeIssuesArray(),
    });

    this.treatmentGoals = [
      {
        label: 'PHYSICAL HEALTH',
        formName: 'physicalHealth',
        controls: this.physicalHealth.controls,
      },
      {
        label: 'MENTAL HEALTH',
        formName: 'mentalHealth',
        controls: this.mentalHealth.controls,
      },
      {
        label: 'SUBSTANCE USE',
        formName: 'substanceUse',
        controls: this.substanceUse.controls,
      },
      {
        label: 'HOUSING',
        formName: 'housing',
        controls: this.housing.controls,
      },
      {
        label: 'INCOME / FINANCIAL / LEGAL',
        formName: 'incomeLegal',
        controls: this.incomeLegal.controls,
      },
      {
        label: 'RELATIONSHIPS',
        formName: 'relationships',
        controls: this.relationships.controls,
      },
      {
        label: 'EDUCATION',
        formName: 'education',
        controls: this.education.controls,
      },
      {
        label: 'BENEFITS / MEDICAID / SNAP',
        formName: 'benefits',
        controls: this.benefits.controls,
      },
    ];
  }

  onSubmit() {
    this.formView = false;
    this.showTopView();
    this.formData= this.treatmentPlanForm.value;
    console.log(this.formData);
    this.treatmentArr = this.treatmentPlanForm.get('treatmentIssues')?.value;    
    console.log(this.treatmentArr[0].physicalHealth);
    let data = this.treatmentArr[0].physicalHealth;
    console.log("length",this.treatmentArr[0].physicalHealth.length);

    let physicalHealthData = this.treatmentArr[0].physicalHealth.filter(
      function (item: any) {
        if (item.goals != '') {
          return item;
        }
      }
    );
    this.treatmentArr[0].physicalHealth = physicalHealthData;

    let mentalHealthData = this.treatmentArr[0].mentalHealth.filter(function (
      item: any
    ) {
      if (item.goals != '') {
        return item;
      }
    });
    this.treatmentArr[0].mentalHealth = mentalHealthData;

    let benefitsData = this.treatmentArr[0].benefits.filter(function (
      item: any
    ) {
      if (item.goals != '') {
        return item;
      }
    });
    this.treatmentArr[0].benefits = benefitsData;

    let educationData = this.treatmentArr[0].education.filter(function (
      item: any
    ) {
      if (item.goals != '') {
        return item;
      }
    });
    this.treatmentArr[0].education = educationData;

    let housingData = this.treatmentArr[0].housing.filter(function (item: any) {
      if (item.goals != '') {
        return item;
      }
    });
    this.treatmentArr[0].housing = housingData;

    let incomeLegalData = this.treatmentArr[0].incomeLegal.filter(function (
      item: any
    ) {
      if (item.goals != '') {
        return item;
      }
    });
    this.treatmentArr[0].incomeLegal = incomeLegalData;

    let relationshipsData = this.treatmentArr[0].relationships.filter(function (
      item: any
    ) {
      if (item.goals != '') {
        return item;
      }
    });
    this.treatmentArr[0].relationships = relationshipsData;

    let substanceUseData = this.treatmentArr[0].substanceUse.filter(function (
      item: any
    ) {
      if (item.goals != '') {
        return item;
      }
    });
    this.treatmentArr[0].substanceUse = substanceUseData;
    this.treatmentArray = this.treatmentArr;
    console.log(' this.treatmentArray', this.treatmentArray);
  }
  
  showTopView() {
    const p = document.querySelector('#prnt');
    console.log(p)
    p?.scrollIntoView();
  }

  saveForm(){
    this.showSpinner=true;
    this.grayOut=true;
    const treatmentData= this.treatmentPlanForm.value;
    console.log(treatmentData);
   this.service.saveTreatmentData(this.vetID,this.treatmentPlanForm.value).subscribe((response) =>{
    if (response.responseStatus === 'SUCCESS') {
      this.showSpinner=false;
      this.grayOut=false;
      this.successMessage();
      this.refreshpage();
    } else if (response.responseStatus === 'FAILURE') {
      this.errorMessage();
    }
  });
   console.log("form submitted successfully");
}
 
  initializeIssuesFormArray() {
    this.issuesArray = this.formBuilder.array([]);
    for (let i = 0; i < 1; i++) {
      this.issuesArray.push(this.initialiseIssuesFormGroup());
    }
    return this.issuesArray;
  }

  initialiseIssuesFormGroup() {
    return this.formBuilder.group({
      physicalHealth: this.initializeIssuesArray(),
      mentalHealth: this.initializeIssuesArray(),
      substanceUse: this.initializeIssuesArray(),
      housing: this.initializeIssuesArray(),
      incomeLegal: this.initializeIssuesArray(),
      relationships: this.initializeIssuesArray(),
      education: this.initializeIssuesArray(),
      benefits: this.initializeIssuesArray(),
    });
  }

  initializeIssuesArray() {
    const tempArray = this.formBuilder.array([]);
    for (let i = 0; i < 3; i++) {
      tempArray.push(this.getIssues());
    }
    return tempArray;
  }

  getIssues(): FormGroup {
    return this.formBuilder.group({
      goals: [''],
      plans: [''],
      strategies: [''],
      targetDate: [''],
    });
  }

  get physicalHealth(): FormArray {
    return this.treatmentIssuesForm.get('physicalHealth') as FormArray;
  }
  get substanceUse(): FormArray {
    return this.treatmentIssuesForm.get('substanceUse') as FormArray;
  }

  get mentalHealth(): FormArray {
    return this.treatmentIssuesForm.get('mentalHealth') as FormArray;
  }
  get housing(): FormArray {
    return this.treatmentIssuesForm.get('housing') as FormArray;
  }
  get incomeLegal(): FormArray {
    return this.treatmentIssuesForm.get('incomeLegal') as FormArray;
  }
  get relationships(): FormArray {
    return this.treatmentIssuesForm.get('relationships') as FormArray;
  }
  get education(): FormArray {
    return this.treatmentIssuesForm.get('education') as FormArray;
  }
  get benefits(): FormArray {
    return this.treatmentIssuesForm.get('benefits') as FormArray;
  }
  get treatmentIssues(): FormArray {
    return this.treatmentPlanForm.get('treatmentIssues') as FormArray;
  }


  get getControl() {
    return this.treatmentPlanForm.controls;
  }

  successMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Treatment-Plan saved successfully!!',
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Treatment-Plan not saved!!',
    });
  }

  refreshpage() {
    setTimeout(() => {
      let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
         this.router.navigate([currentUrl]);
     }, 1500);
    
    }

  resetForm() {
    this.formView=true;
    this.showTopView();
    this.buildForm();
    this.setForm();
  }
  validateInput(event: any) {
    let className = event.target.id;
    let section = document.querySelector(`.${className}`);
    if (event.target.value === '') {
      section?.classList.remove('hide-display');
    } else {
      section?.classList.add('hide-display');
    }
  }
  getDate(event: any) {
    this.eventId = event.target.id;
    this.validateDate(event.target.value);
  }
  showForm() {
    this.formView = true;
  }
  validateDate(event: any) {
    let section;
    if (this.eventId) {
      section = document.querySelector(`.${this.eventId}`);
    }
    if (event === '' || event === null) {
      section?.classList.remove('hide-display');
    } else {
      section?.classList.add('hide-display');
    }
  }
  downloadForm() {
    window.print();
  }
}



