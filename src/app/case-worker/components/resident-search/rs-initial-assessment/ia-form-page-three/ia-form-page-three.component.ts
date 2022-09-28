import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IaPage3Service } from 'src/app/case-worker/services/ia-page3.service';

@Component({
  selector: 'app-ia-form-page-three',
  templateUrl: './ia-form-page-three.component.html',
  styleUrls: ['./ia-form-page-three.component.scss'],
})
export class IaFormPageThreeComponent implements OnInit {
  page3Form!: FormGroup;
  // ia3: boolean = true;
  // greyingOut: boolean = true;
  submitted!: boolean;
  mentalStatusAssessment!: FormGroup;
  medicalInformation!: FormGroup;
  ideation!: FormGroup;
  generalAppearanceList: any = [
    { label: 'Well Groomed', value: 'well groomed' },
    { label: 'Dirty', value: 'dirty' },
    { label: 'Neat', value: 'neat' },
    { label: 'Careless', value: 'careless' },
    { label: 'Average', value: 'average' },
    { label: 'Slim', value: 'slim' },
    { label: 'Obese', value: 'obese' },
  ];
selectedgeneralAppearance: any []= [];
  thoughtForumList: any = [
    { label: 'Logical', value: 'logical' },
    { label: 'Coherent', value: 'coherent' },
    { label: 'Relevant', value: 'relevant' },
    { label: 'Loose Associations', value: 'loose associations' },
    { label: 'Confused', value: 'confused' },
    { label: 'Incoherent', value: 'incoherent' },
    { label: 'Flight of Ideas', value: 'flight of ideas' },
    { label: 'Thought blocking', value: 'Thought blocking' },
  ];
selectdeThoughtForum: any []= [];
  moodList = [
    { label: 'Depressed', value: 'depressed' },
    { label: 'Elated', value: 'elated' },
    { label: 'Angry', value: 'angry' },
    { label: 'Happy', value: 'happy' },
    { label: 'Neutral', value: 'neutral' },
  ];
answeredByClient: any [] = [];
observedByInterviewer: any []= [];
  affectList = [
    { label: 'Appropriate', value: 'appropriate' },
    { label: 'Fearful', value: 'fearful' },
    { label: 'Confused', value: 'confused' },
    { label: 'Apathetic', value: 'apathetic' },
    { label: 'Flat', value: 'flat' },
    { label: 'Liable', value: 'liable' },
    { label: 'Inappropriate', value: 'inappropriate' },
  ];
  selectedAffect: any [] = [];

  ideationList = [
    { label: 'Thoughts of Suicide', key: 'thoughtsOfSuicide' },
    { label: 'Plan', key: 'suicidePlan' },
    { label: 'Thoughts of Homicide', key: 'thoughtsOfHomicide' },
    { label: 'Plan', key: 'homicidePlan' },
    { label: 'Delusional', key: 'delusional' },
    { label: 'Paranoid', key: 'paranoid' },
    { label: 'Hallucinations', key: 'hallucinations' },
  ];

  memoryList = [
    { label: 'Recent Memory', key: 'recentMemory' },
    { label: 'Remote Memory', key: 'remoteMemory' },
  ];
  constructor(private fb: FormBuilder, private router: Router, private service: IaPage3Service) {}

  ngOnInit(): void {
    this.initializeFormGroups();
  }

  initializeFormGroups() {
    this.ideation = this.fb.group({
      thoughtsOfSuicide: [],
      suicidePlan: [],
      thoughtsOfHomicide: [],
      homicidePlan: [],
      delusional: [],
      paranoid: [],
      hallucinations: [],
    });

    this.mentalStatusAssessment = this.fb.group({
      orientation: this.fb.group({
        date: [''],
        time: [''],
        place: [''],
        person: [''],
      }),
      generalAppearance: [this.selectedgeneralAppearance, Validators.required],
      thoughtForum: [this.selectdeThoughtForum, Validators.required],
      mood: this.fb.group({
        answeredByClient: [this.answeredByClient, Validators.required],
        observedByInterviewer: [this.observedByInterviewer, Validators.required],
      }),
      affect:[this.selectedAffect, Validators.required],
      ideation: this.ideation,
      memory: this.fb.group({
        recentMemory: [],
        remoteMemory: [],
      }),
    });
    this.medicalInformation = this.fb.group({
      primaryPhysicianName: [],
      phone: [],
      clinic: [],
      hospital: [],
      physicianSpecialist: [],
      diagnosisAndCurrentTreatment: [],
      currentMedication: [],
    });
    this.buildForm();
  }

  buildForm() {
    this.page3Form = this.fb.group({
      mentalStatusAssessment: this.mentalStatusAssessment,
      medicalInformation: this.medicalInformation,
    });
    console.log('build form', this.page3Form.get(['mentalStatusAssessment', 'ideation']));
  }

  onSubmit() {
    this.submitted = true;
    this.service
      .initialTreatmentGoalsPage3(this.page3Form.value)
      .subscribe((data) => {
        console.log('Submitted');
      });
      // this.router.navigateByUrl(
      //   'case-worker/resident-search/initial-assessment/page-4'
      // );
    console.log('page 3 values', this.page3Form.value);
  }

  next(){
    console.log('clicked next');
    if(this.submitted){
    this.router.navigateByUrl(
      'case-worker/resident-search/initial-assessment/page-4'
    );
    }
    else{
      alert("Please save first")
    }
  }

  goBack(){
    this.router.navigateByUrl(
      'case-worker/resident-search/initial-assessment/page-2'
    );  
  }

  get ideationControls() {
    return (
      this.page3Form.get(['mentalStatusAssessment', 'ideation']) as FormGroup
    ).controls;
  }

  get moodAnsweredByClient() {
    return this.page3Form.get([
      'mentalStatusAssessment',
      'mood',
      'answeredByClient',
    ]) as FormControl;
  }

  get moodObservedByInterviewer() {
    return this.page3Form.get([
      'mentalStatusAssessment',
      'mood',
      'observedByInterviewer',
    ]) as FormControl;
  }

}

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value: any) {
    return Object.keys(value);
  }
}
