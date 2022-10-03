import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/case-worker/services/data.service';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
@Component({
  selector: 'app-rs-treatment-plan',
  templateUrl: './rs-treatment-plan.component.html',
  styleUrls: ['./rs-treatment-plan.component.scss'],
  providers: [MessageService],
})
export class RsTreatmentPlanComponent implements OnInit {
  public treatmentPlanForm!: FormGroup;
  public treatmentIssuesForm!: FormGroup;
  public treatmentGoals: any;
  public issuesArray: any = [];
  public delete: boolean = true;
  public error: boolean = false;
  public maxDateValue: any;
  public eventId: any;
  public data: any;
  public formView = true;
  public treatmentArr: any;
  public formData:any;
  public vetID!:any;
  showSpinner:boolean = true;
  grayOut:boolean = true;
  intake_date: any;
  date_of_birth: any;
  header: any;
  targetdate: any;
  indexPh:number=0;
  indexMh:number=0;
  indexSu:number=0;
  indexHo:number=0;
  indexIn:number=0;
  indexRe:number=0;
  indexEd:number=0;
  indexBe:number=0;
  

  constructor(
    private formBuilder: FormBuilder,
    private service: DataService,
    private cacheData:ClipBoardService,
    private messageService: MessageService,
    private scroller: ViewportScroller,
    private datepipe: DatePipe,
  ) {
    this.vetID=this.cacheData.get("selectedResidentVeteranId");
    this.setForm();
    
  }

  ngOnInit(): void {
    this.buildForm();
  }

  setForm() {
    this.service.getTreatmentPlanData(this.vetID).subscribe((res) => {
      this.data = res.data;
        if(this.data){
          this.showSpinner=false;
          this.grayOut=false;
        }
      this.header=this.data[0];
      this.intake_date = this.datepipe.transform(this.header.intake_date, 'dd/MM/yyyy');
      this.date_of_birth = this.datepipe.transform(this.header.date_of_birth, 'dd/MM/yyyy');  
      this.treatmentArr = this.treatmentPlanForm.get('treatmentIssues')?.value;
      console.log('data',this.data) 

      this.buildForm();
      this.treatmentPlanForm.patchValue({
        firstName: this.header.first_name,
        lastName: this.header.last_name,
        recordNo: this.header.record_number,
        dateOfBirth1:this.date_of_birth,
        intakeDOB: this.intake_date,
        hmisIdNo: this.header.hmis_id,
        veteranDiagnosis: this.header.diagnosis,
        veteranSupports: this.header.supports,
        veteranStrengths: this.header.strengths,
        veteranNotes: this.header.notes,
      });
        for(let i=0;i<this.data.length;i++){
          if(this.data[i].goal_type === 'physical health'){
          console.log("goal type identified",this.data[i].goal_type)
          let targetDate = this.datepipe.transform(this.data[i].targetdate, 'MM/dd/yyyy')
          this.treatmentIssues.controls[0].get('physicalHealth.'+this.indexPh)?.patchValue({
              goals: this.data[i].goal,
              plans: this.data[i].plan,
              strategies: this.data[i].strategy,
              targetDate:targetDate,
            });
            console.log('test',this.treatmentIssues.controls[0].get('physicalHealth.'+this.indexPh));
            this.indexPh++;
          }	
          if(this.data[i].goal_type === 'mental health'){
            console.log("goal type identified",this.data[i].goal_type)
            let targetDate = this.datepipe.transform(this.data[i].targetdate, 'MM/dd/yyyy')
            this.treatmentIssues.controls[0].get('mentalHealth.'+this.indexMh)?.patchValue({
                goals: this.data[i].goal,
                plans: this.data[i].plan,
                strategies: this.data[i].strategy,
                targetDate:targetDate,
              });
            console.log('test',this.treatmentIssues.controls[0].get('mentalHealth.'+this.indexMh));
            this.indexMh++;
          }
          if(this.data[i].goal_type === 'substance use'){
            console.log("goal type identified",this.data[i].goal_type)
            let targetDate = this.datepipe.transform(this.data[i].targetdate, 'MM/dd/yyyy')
            this.treatmentIssues.controls[0].get('education.'+this.indexSu)?.patchValue({
                goals: this.data[i].goal,
                plans: this.data[i].plan,
                strategies: this.data[i].strategy,
                targetDate:targetDate,
              });
            console.log('test',this.treatmentIssues.controls[0].get('substanceUse.'+this.indexSu));
            this.indexSu++;
          }
          if(this.data[i].goal_type === 'housing'){
            console.log("goal type identified",this.data[i].goal_type)
            let targetDate = this.datepipe.transform(this.data[i].targetdate, 'MM/dd/yyyy')
            this.treatmentIssues.controls[0].get('housing.'+this.indexHo)?.patchValue({
                goals: this.data[i].goal,
                plans: this.data[i].plan,
                strategies: this.data[i].strategy,
                targetDate:targetDate,
              });
            console.log('test',this.treatmentIssues.controls[0].get('housing.'+this.indexHo));
            this.indexHo++;
          }
          if(this.data[i].goal_type === 'social'){
            console.log("goal type identified",this.data[i].goal_type)
            let targetDate = this.datepipe.transform(this.data[i].targetdate, 'MM/dd/yyyy')
            this.treatmentIssues.controls[0].get('incomeLegal.'+this.indexIn)?.patchValue({
                goals: this.data[i].goal,
                plans: this.data[i].plan,
                strategies: this.data[i].strategy,
                targetDate:targetDate,
              });
            console.log('test',this.treatmentIssues.controls[0].get('incomeLegal.'+this.indexIn));
            this.indexIn++;
          }
          if(this.data[i].goal_type === 'family'){
            console.log("goal type identified",this.data[i].goal_type)
            let targetDate = this.datepipe.transform(this.data[i].targetdate, 'MM/dd/yyyy')
            this.treatmentIssues.controls[0].get('relationships.'+this.indexRe)?.patchValue({
                goals: this.data[i].goal,
                plans: this.data[i].plan,
                strategies: this.data[i].strategy,
                targetDate:targetDate,
              });
            console.log('test',this.treatmentIssues.controls[0].get('relationships.'+this.indexRe));
            this.indexRe++;
          }
          if(this.data[i].goal_type === 'career'){
            console.log("goal type identified",this.data[i].goal_type)
            let targetDate = this.datepipe.transform(this.data[i].targetdate, 'MM/dd/yyyy')
            this.treatmentIssues.controls[0].get('education.'+this.indexEd)?.patchValue({
                goals: this.data[i].goal,
                plans: this.data[i].plan,
                strategies: this.data[i].strategy,
                targetDate:targetDate,
              });
            console.log('test',this.treatmentIssues.controls[0].get('education.'+this.indexEd));
            this.indexEd++;
          }
          if(this.data[i].goal_type === 'benefits'){
            console.log("goal type identified",this.data[i].goal_type)
            let targetDate = this.datepipe.transform(this.data[i].targetdate, 'MM/dd/yyyy')
            this.treatmentIssues.controls[0].get('benefits.'+this.indexBe)?.patchValue({
                goals: this.data[i].goal,
                plans: this.data[i].plan,
                strategies: this.data[i].strategy,
                targetDate:targetDate,
              });
            console.log('test',this.treatmentIssues.controls[0].get('benefits.'+this.indexBe));
            this.indexBe++;
          }
        }
    });
  };

  buildForm() {
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
    this.showSpinner=true;
    this.grayOut=true;
    
    this.service.updateTreatmentPlanData(this.vetID,this.treatmentPlanForm.value).subscribe((response)=>{
      if (response.responseStatus === 'SUCCESS'){
        setTimeout(() => {
          this.showSpinner=false;
          this.grayOut=false;
          this.successMessage();
          this.scroller.scrollToAnchor("topOfPage");
        }, 500); 
      }else if (response.responseStatus === 'FAILURE'){
        this.errorMessage();
      }
    });
    console.log("Form value =>>>>",this.treatmentPlanForm.value);  
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
      goals: ['', Validators.required],
      plans: ['', Validators.required],
      strategies: ['', Validators.required],
      targetDate: [null, Validators.required],
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

  addNewField() {
    this.issuesArray.push(this.initialiseIssuesFormGroup());
    if (this.issuesArray.value.length > 3) {
      this.delete = false;
    }
  }
  get getControl() {
    return this.treatmentPlanForm.controls;
  }

  deleteField() {
    this.issuesArray.value.pop();
    this.issuesArray.removeAt(-1);
    if (this.issuesArray.value.length === 3) {
      this.delete = true;
    }
  }

  successMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Updated',
      detail: 'Treatment-Plan updated successfully!!',
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Treatment-Plan not updated!!',
    });
  }

  resetForm() {
    this.formView=true;
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

}
