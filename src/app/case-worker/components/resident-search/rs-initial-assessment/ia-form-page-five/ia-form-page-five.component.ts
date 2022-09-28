import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IaPage5Service } from "src/app/case-worker/services/ia-page5.service";
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';

@Component({
  selector: 'app-ia-form-page-five',
  templateUrl: './ia-form-page-five.component.html',
  styleUrls: ['./ia-form-page-five.component.scss'],
})
export class IaFormPageFiveComponent implements OnInit {
  page5Form!: FormGroup;
  preliminaryTreatmentGoals!: FormGroup;
  progressNote: any;
  selectedVetId!: number;
  shortTerm:any;
  data: any;

  constructor(
    private fb: FormBuilder,
     private router: Router,
      private service: IaPage5Service,
      private cacheData: ClipBoardService
       )
     {
    this.selectedVetId = this.cacheData.get('selectedResidentVeteranId');
    this.setForm();
     }

  ngOnInit(): void {
    this.initializeFormGroups();
  }

  initializeFormGroups() {
    this.preliminaryTreatmentGoals = this.fb.group({
      hppenedInMyLifeLastYear: ['', Validators.required],
      shortTermGoals: ['', Validators.required],
      longTermGoals: ['', Validators.required],
      strengthAndResources: ['', Validators.required],
      preferences: ['', Validators.required],
      needs: ['', Validators.required],
      supports: ['', Validators.required],
      additionalComments: ['', Validators.required]
    });
  //  this.buildForm();
  }
  setForm(){
    this.service.getInitialTreatmentGoalsPage5(this.selectedVetId).subscribe((res)=>{
      this.data= res[0];
      console.log("PG 5 -",this.data);
      
      this.buildForm();
      this.preliminaryTreatmentGoals.patchValue(
        {
          shortTermGoals:this.data.goal_plan_short_term,
          longTermGoals:this.data.goal_plan_long_term,
          strengthAndResources:this.data.strengths,
          supports: this.data.supports,
          additionalComments: this.data.notes,
        }
      )
      console.log("page 5 Data:",this.data);
      
    }
    );
      
  }

  buildForm() {
    this.page5Form = this.fb.group({
      preliminaryTreatmentGoals: this.preliminaryTreatmentGoals
    });
  }

  onSubmit() {
    this.service.initialTreatmentGoalsPage5(this.page5Form.value).subscribe((data) => {
      console.log('Submitted');
    });
    console.log('page 5 values', this.page5Form.value);
  }

  goBack() {
    this.router.navigateByUrl(
      'case-worker/resident-search/initial-assessment/page-4'
    );
  }
}
