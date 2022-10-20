import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IaPage4Service } from 'src/app/case-worker/services/ia-page4.service';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-ia-form-page-four',
  templateUrl: './ia-form-page-four.component.html',
  styleUrls: ['./ia-form-page-four.component.scss'],
  providers: [MessageService],
})
export class IaFormPageFourComponent implements OnInit {
  public ia4: boolean = true;
  public greyingOut: boolean = true;
  submitted!: boolean;
  selecteVetId!: number;
  page4Form!: FormGroup;
  data: any;
  substanceAbuseHistory!: FormGroup;
  legalHistoryOrIssues!: FormGroup;
  currentlyConsumesAlcohol = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  currentlyConsumesDrugs = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  currentlyConsumesTobacco = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  currentlyConsumesCaffeine = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  withdrawalHistory = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];
  everArrested = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  everConvicted = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  currentPendingCharges = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  outstandingWarrants = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  onProbationOrParole = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private service: IaPage4Service,
    private cacheData: ClipBoardService
  ) {
    this.selecteVetId = this.cacheData.get('selectedResidentVeteranId');
    console.log('sel', this.selecteVetId);
    this.setForm();
  }

  ngOnInit(): void {
    this.initializeFormGroups();
  }

  setForm() {
    this.service.getIAPage4(this.selecteVetId).subscribe((res) => {
      this.ia4 = false;
      this.greyingOut = false;
      this.data = res[0];
      this.buildForm();
      if (this.data) {
        this.substanceAbuseHistory.patchValue({
          histOfAlcohol: this.data.alcohol_history,
          currentlyConsumesAlcohol: this.data.currently_consumes_alcohol,
          currentAlcoholIntakeFreq: this.data.current_alcohol_intake_freq,
          histOfDrugs: this.data.drug_use_history,
          currentlyConsumesDrugs: this.data.currently_uses_drugs,
          currentDrugIntakeFreq: this.data.current_drug_use_freq,
          lastUseOfDrugAlcohol: this.data.drug_alcohol_last_use,
          currentDrugAlcoholTreatment: this.data.current_drug_alcohol_treatment,
          withdrawalHistory: this.data.withdrawal_history,
          histOfTobacco: this.data.tobacco_use_history,
          currentlyConsumesTobacco: this.data.currently_uses_tobacco,
          currentTobaccoIntakeFreq: this.data.current_tobacco_use_freq,
          histOfCaffeine: this.data.caffeine_use_history,
          currentlyConsumesCaffeine: this.data.currently_uses_caffeine,
          currentCaffeineIntakeFreq: this.data.current_caffeine_use_freq,
          treatmentPrograms: this.data.treatment_programs,
        });
        this.legalHistoryOrIssues.patchValue({
          everArrested: this.data.ever_arrested,
          arrestedReason: this.data.arrest_reason,
          everConvicted: this.data.ever_convicted,
          convictedReason: this.data.conviction_reason,
          currentPendingCharges: this.data.current_pending_charges,
          charges: this.data.charges,
          outstandingWarrants: this.data.outstanding_warrants,
          warrantReason: this.data.warrant_reason,
          onProbationOrParole: this.data.on_probation_or_parole,
          officerName: this.data.officer_name,
          officerAddress: this.data.officer_address,
          probationOrParoleTerms: this.data.probation_or_parole_terms,
        });
      } else {
        this.substanceAbuseHistory.patchValue({
          histOfAlcohol: null,
          currentlyConsumesAlcohol: null,
          currentAlcoholIntakeFreq: null,
          histOfDrugs: null,
          currentlyConsumesDrugs: null,
          currentDrugIntakeFreq: null,
          lastUseOfDrugAlcohol: null,
          currentDrugAlcoholTreatment: null,
          withdrawalHistory: null,
          histOfTobacco: null,
          currentlyConsumesTobacco: null,
          currentTobaccoIntakeFreq: null,
          histOfCaffeine: null,
          currentlyConsumesCaffeine: null,
          currentCaffeineIntakeFreq: null,
          treatmentPrograms: null,
        });
        this.legalHistoryOrIssues.patchValue({
          everArrested: null,
          arrestedReason: null,
          everConvicted: null,
          convictedReason: null,
          currentPendingCharges: null,
          charges: null,
          outstandingWarrants: null,
          warrantReason: null,
          onProbationOrParole: null,
          officerName: null,
          officerAddress: null,
          probationOrParoleTerms: null,
        });
      }
    });
  }

  initializeFormGroups() {
    this.substanceAbuseHistory = this.fb.group({
      veteranId: [this.selecteVetId, Validators.required],
      histOfAlcohol: ['', Validators.required],
      currentlyConsumesAlcohol: ['', Validators.required],
      currentAlcoholIntakeFreq: ['', Validators.required],
      histOfDrugs: ['', Validators.required],
      currentlyConsumesDrugs: ['', Validators.required],
      currentDrugIntakeFreq: ['', Validators.required],
      lastUseOfDrugAlcohol: ['', Validators.required],
      currentDrugAlcoholTreatment: ['', Validators.required],
      withdrawalHistory: ['', Validators.required],
      histOfTobacco: ['', Validators.required],
      currentlyConsumesTobacco: ['', Validators.required],
      currentTobaccoIntakeFreq: ['', Validators.required],
      histOfCaffeine: ['', Validators.required],
      currentlyConsumesCaffeine: ['', Validators.required],
      currentCaffeineIntakeFreq: ['', Validators.required],
      treatmentPrograms: ['', Validators.required],
    });

    this.legalHistoryOrIssues = this.fb.group({
      veteranId: [this.selecteVetId, Validators.required],
      everArrested: ['', Validators.required],
      arrestedReason: ['', Validators.required],
      everConvicted: ['', Validators.required],
      convictedReason: ['', Validators.required],
      currentPendingCharges: ['', Validators.required],
      charges: ['', Validators.required],
      outstandingWarrants: ['', Validators.required],
      warrantReason: ['', Validators.required],
      onProbationOrParole: ['', Validators.required],
      officerName: ['', Validators.required],
      officerAddress: ['', Validators.required],
      probationOrParoleTerms: ['', Validators.required],
    });
  }

  buildForm() {
    this.page4Form = this.fb.group({
      substanceAbuseHistory: this.substanceAbuseHistory,
      legalHistoryOrIssues: this.legalHistoryOrIssues,
    });
  }

  onSubmit() {
    this.ia4 = true;
    this.greyingOut = true;
    let chargesLegal = this.legalHistoryOrIssues.value.charges;
    this.legalHistoryOrIssues.value.charges = '{' + chargesLegal + '}';
    this.submitted = true;

    this.service
      .initialTreatmentGoalsPage4(this.page4Form.value)
      .subscribe((data) => {
        if (data.responseStatus === 'SUCCESS') {
          this.ia4 = false;
          this.greyingOut = false;
          this.successMessage();
          this.setForm();
          // alert("success");
        } else if (data.responseStatus === 'FAILURE') {
          this.errorMessage();
        }
        console.log('Submitted');
      });

    // this.router.navigateByUrl(
    //   'case-worker/resident-search/initial-assessment/page-5'
    // );

    console.log('page 4 values', this.page4Form.value);
  }
  next() {
    console.log('clicked next');
    if (!this.page4Form.touched) {
      this.router.navigateByUrl(
        'case-worker/resident-search/initial-assessment/page-5'
      );
    } else {
      this.infoMessage();
    }
  }

  goBack() {
    if (!this.page4Form.touched) {
      this.router.navigateByUrl(
        'case-worker/resident-search/initial-assessment/page-3'
      );
    } else {
      this.infoMessage();
    }
  }

  reset() {
    this.ia4 = true;
    this.greyingOut = true;
    this.setForm();
  }

  successMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully Updated Details',
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Failed',
      detail: 'Something Went Wrong!',
    });
  }

  infoMessage() {
    this.messageService.add({
      severity: 'info',
      summary: 'Save!',
      detail: 'Please Save the Details Before Going to next Step',
    });
  }
}
