import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IaPage2Service } from 'src/app/case-worker/services/ia-page2.service';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-ia-form-page-two',
  templateUrl: './ia-form-page-two.component.html',
  styleUrls: ['./ia-form-page-two.component.scss'],
  providers: [MessageService]
})
export class IaFormPageTwoComponent implements OnInit {
  submitted!: boolean;
  ia2: boolean = true;
  greyingOut: boolean = true;
  data: any;
  serviceDate: any;
  selectedVetId!: number;
  page2Form!: FormGroup;
  educationAndEmploymentHistory!: FormGroup;
  mentalHealthInformation!: FormGroup;
  military = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  needPsychiatricCunsultant = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: IaPage2Service,
    private messageService: MessageService,
    private datepipe: DatePipe,
    private cacheData: ClipBoardService
  ) {
    this.selectedVetId = this.cacheData.get('selectedResidentVeteranId');
    this.setForm();
  }

  ngOnInit(): void {
    this.initializeFormGroups();
  }

  setForm() {
    this.service.getIAPage2(this.selectedVetId).subscribe((res) => {
      this.ia2 = false;
      this.greyingOut = false;
      this.data = res[0];
      this.serviceDate = this.datepipe.transform(
        this.data.service_dates,
        'dd/MM/yyyy'
      );
      this.buildForm();
      this.educationAndEmploymentHistory.patchValue({
        highestGradeCompleted: this.data.highest_education_grade,
        nameAndLocation: this.data.school_name,
        currentJob: this.data.current_occupation,
        // jobEmployedInLongest:this.data.,
        mostRecentJob: this.data.previous_occupations,
        // jobDate: this.data.,
        // reasonForLeaving: this.data.,
        military: this.data.active_military_status,
        branch: this.data.military_branch,
        typeOfDischarge: this.data.discharge_type,
        serviceDate: this.data.service_dates,
        serviceLocation: this.data.service_location,
        otherTrainingEducation: this.data.other_training_education,
        currentEmployer: this.data.current_employer,
        currentEmployerLocation: this.data.current_employer_location,
        otherTrainingOrSkills: this.data.work_skills,
      });
      this.mentalHealthInformation.patchValue({
      diagnosis: this.data.diagnosis,
      currentPsychiatricTreatment: this.data.current_psych_treatment,
      psychiatristName: this.data.psychiatrist_name,
      psychiatristAddress: this.data.psychiatrist_address,
      pastTreatments: this.data.psych_past_treatments,
      needPsychiatricCunsultant: this.data.psych_consult_needed,
      psychEvaluatorName: this.data.psych_evaluation_physician_name,
      psychEvaluatorAddress:this.data.psych_evaluation_physician_address,
      psychEvaluatorCity: this.data.psych_evaluation_physician_city,
      psychEvaluatorState:this.data.psych_evaluation_physician_state,
      psychEvaluatorZipcode: this.data.psych_evaluation_physician_zipcode,
      psychEvaluatorLicense: this.data.psych_evaluation_physician_license,
      psychiatristCityState: this.data.psychiatrist_city_state
      });
    });
  }

  initializeFormGroups() {
    this.educationAndEmploymentHistory = this.fb.group({
      highestGradeCompleted: ['', Validators.required],
      nameAndLocation: ['', Validators.required],
      otherTrainingOrSkills: ['', Validators.required],
      currentJob: ['', Validators.required],
      jobEmployedInLongest: ['', Validators.required],
      mostRecentJob: ['', Validators.required],
      jobDate: ['', Validators.required],
      reasonForLeaving: ['', Validators.required],
      military: ['', Validators.required],
      branch: ['', Validators.required],
      typeOfDischarge: ['', Validators.required],
      serviceDate: ['', Validators.required],
      serviceLocation: ['', Validators.required],
      otherTrainingEducation: ['', Validators.required],
      currentEmployer: ['', Validators.required],
      currentEmployerLocation: ['', Validators.required],
      veteranId: [this.selectedVetId, Validators.required]
    });
    this.mentalHealthInformation = this.fb.group({
      diagnosis: ['', Validators.required],
      currentPsychiatricTreatment: ['', Validators.required],
      psychiatristName: ['', Validators.required],
      psychiatristAddress: ['', Validators.required],
      pastTreatments: ['', Validators.required],
      needPsychiatricCunsultant: ['', Validators.required],
      psychEvaluatorName: ['', Validators.required],
      psychEvaluatorAddress: ['', Validators.required],
      psychEvaluatorCity: ['', Validators.required],
      psychEvaluatorState: ['', Validators.required],
      psychEvaluatorZipcode: ['', Validators.required],
      psychEvaluatorLicense: ['', Validators.required],
      veteranId: [this.selectedVetId, Validators.required],
      psychiatristCityState: ['', Validators.required]
    });
  }

  buildForm() {
    this.page2Form = this.fb.group({
      educationAndEmploymentHistory: this.educationAndEmploymentHistory,
      mentalHealthInformation: this.mentalHealthInformation
    });
  }

  onSubmit() {
    this.submitted = true;
    this.ia2 = true;
    this.greyingOut = true
    this.service
      .initialTreatmentGoalsPage2(this.page2Form.value)
      .subscribe((data) => {
        if(data.responseStatus === 'SUCCESS'){
        this.ia2 = false;
        this.greyingOut = false;
        this.successMessage();
        console.log('Submitted');
        }
        else if(data.responseStatus === 'FAILURE'){
          this.errorMessage();
        }
      });
    // this.router.navigateByUrl(
    //   'case-worker/resident-search/initial-assessment/page-3'
    // );
    console.log('page 2 values', this.page2Form.value);
  }
  next() {
    console.log('clicked next');
    if (this.submitted) {
      this.router.navigateByUrl(
        'case-worker/resident-search/initial-assessment/page-3'
      );
    } else {
      alert('Please save first');
    }
  }

  goBack() {
    this.router.navigateByUrl(
      'case-worker/resident-search/initial-assessment/page-1'
    );
  }

  index: number = 0;
  successMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully Updated Details',
    });
    
  }

  errorMessage(){
    this.messageService.add({
      severity: 'error',
      summary: 'Failed',
      detail: 'Something Went Wrong!',
    });
  }
}
