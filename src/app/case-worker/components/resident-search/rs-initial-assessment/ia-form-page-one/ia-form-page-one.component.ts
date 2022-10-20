import { DatePipe } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IaPage1Service } from 'src/app/case-worker/services/ia-page1.service';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { MessageService } from 'primeng/api';
import { livingStatus } from 'src/app/veteran/app.constants';
@Component({
  selector: 'app-ia-form-page-one',
  templateUrl: './ia-form-page-one.component.html',
  styleUrls: ['./ia-form-page-one.component.scss'],
  providers: [MessageService],
})
export class IaFormPageOneComponent implements OnInit {
  selecteVetId!: number;
  ia1: boolean = true;
  hasFamMembers: boolean = false;
  greyingOut: boolean = true;
  details: any;
  livingStatus: any;
  familyDetails: any = [];
  data: any;
  age: any;
  dateofbirth: any;
  hivTestDate: any;
  stdTestDate: any;
  submitted: boolean = false;
  page1Form!: FormGroup;
  personalDetails!: FormGroup;
  incomeAndResources!: FormGroup;
  benefits!: FormGroup;
  socialAndFamilyHistory!: FormGroup;
  familyMembers!: FormGroup;
  members: any = [];
  addNewMember: boolean = false;
  famMemberId!: number;
  removeMember: any = [];
  everMarried = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  sexuallyActive = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  sexualProblemsOrConcerns = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  testedForHivOrAids = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  testedSTDs = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  hivTestDesired = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  consent = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  insuCoverages = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  substanceAbuse = [
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

  living = [
    { label: 'Living', value: true },
    { label: 'Deceased', value: false },
  ];
  sexualOrientation = [
    { label: 'Heterosexual', value: 'Heterosexual' },
    { label: 'Homosexual', value: 'Homosexual' },
    { label: 'Bisexual', value: 'Bisexual' },
    { label: 'Transexual', value: 'Transexual' },
    { label: 'Transgender', value: 'Transgender' },
    { label: 'Other', value: 'Other' },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: IaPage1Service,
    private messageService: MessageService,
    private datepipe: DatePipe,
    private cacheData: ClipBoardService
  ) {
    this.selecteVetId = this.cacheData.get('selectedResidentVeteranId');
    console.log('sel', this.selecteVetId);
    this.setForm();
    this.livingStatus = livingStatus;
  }
  ngOnInit(): void {
    this.initializeFormGroups();
    // this.getFamilyMembers();
  }

  getFamilyMembers() {
    this.familyDetails = [];
    this.service.getIAPage1FD(this.selecteVetId).subscribe((result) => {
      this.details = result;
      if(this.details.length == 0){
        this.hasFamMembers = true;
      }
      for (let i = 0; i < this.details.length; i++) {
        this.familyDetails.push(this.details[i]);
      }
      this.famMemberId = this.familyDetails.veteran_family_id;
      console.log('fam det', this.famMemberId);
      this.userArray = this.familyDetails;
      console.log('this.details', this.details);
      console.log('family details', this.familyDetails);
    });
  }
  setForm() {
    this.getFamilyMembers();
    this.service.getIAPage1(this.selecteVetId).subscribe((res) => {
      this.ia1 = false;
      this.greyingOut = false;
      this.data = res[0];
      console.log('dob', this.data.date_of_birth);

      this.dateofbirth = this.datepipe.transform(
        this.data.date_of_birth,
        'MM/dd/yyyy'
      );
      this.hivTestDate = this.datepipe.transform(
        this.data.approx_hiv_test_date,
        'MM/dd/yyyy'
      );
      this.stdTestDate = this.datepipe.transform(
        this.data.approx_std_test_date,
        'MM/dd/yyyy'
      );
      this.age = this.datepipe.transform(this.data.date_of_birth, 'yyyy-MM-dd');

      const getAge = (birthDateString: any) => {
        const today = new Date();
        const birthDate = new Date(birthDateString);
        const yearsDifference = today.getFullYear() - birthDate.getFullYear();
        if (
          today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate())
        ) {
          return yearsDifference - 1;
        }
        return yearsDifference;
      };
      const currAge = getAge(this.age);
      this.buildForm();
      if (this.data) {
        this.personalDetails.patchValue({
          firstName: this.data.first_name,
          lastName: this.data.last_name,
          middleInitial: this.data.middle_initial,
          nickName: this.data.nick_name,
          dob: this.dateofbirth,
          // dob: this.data.date_of_birth,
          placeOfBirth: this.data.place_of_birth,
          ssn: this.data.ssn,
          age: currAge,
          sex: this.data.gender,
          maritalStatus: this.data.marital_status,
          race: this.data.race,
          primaryPhone: this.data.primary_phone,
          primaryLanguage: this.data.primary_language,
          addressMain: this.data.address_main,
          addressLine2: this.data.address_line_2,
          city: this.data.city,
          country: this.data.county,
          state: this.data.state,
          zipcode: this.data.zip_code,
          contactPerson: this.data.contact_person,
          relationship: this.data.contact_person_relationship,
          contactPersonAddress: this.data.contact_person_address,
          phone: this.data.contact_person_phone,
          religiousPreferences: this.data.religious_preference,
          hobbiesInterests: this.data.hobbies,
          consent: this.data.consent_status,
        });
        this.incomeAndResources.patchValue({
          income: this.data.income,
          type: this.data.income_type,
          bankAccount: this.data.bank_account_type,
          bankName: this.data.bank_name,
          directDeposit: this.data.direct_deposit,
          otherAssets: this.data.other_assets,
          medicaid: this.data.medicaid_coverage,
          vaCoverage: this.data.va_coverage,
          medicareCoverage: this.data.medicare_coverage,
          othMedCoverage: this.data.other_med_coverage,
          cashBenefits: this.data.cash_benefits,
          nonCashBenefits: this.data.non_cash_benefits,
          receivingBenefits: this.data.current_benefits,
          applyingBenefits: this.data.needed_benefits,
        });
        this.socialAndFamilyHistory.patchValue({
          childhood: this.data.childhood,
          discipline: this.data.discipline_type,
          everMarried: this.data.ever_married,
          numberOfMarriages: this.data.times_married,
          relationShipWithParents: this.data.parent_relationship,
          relationShipWithSiblings: this.data.sibling_relationship,
          physicalAbuse: this.data.physical_abuse_hist,
          sexualAbuse: this.data.sexual_abuse_hist,
          healthProblemsInFamily:
            this.data.family_hist_mental_health_and_substance_abuse,
          substanceAbuse: this.data.substance_abuse,
          currentMaritalStatus: this.data.current_marital_status,
          sexualOrientation: this.data.sexual_orientation,
          sexuallyActive: this.data.sexually_active,
          sexualProblemsOrConcerns: this.data.sexual_concerns,
          specifySexualProblems: this.data.sexual_concern_specifics,
          testedForHivOrAids: this.data.hiv_tested,
          hivTestedDate: this.hivTestDate,
          hivTestedLocation: this.data.hiv_test_location,
          hivTestResult: this.data.hiv_test_results,
          testedSTDs: this.data.other_std_tested,
          stdTestedDate: this.stdTestDate,
          stdTestedLocation: this.data.std_test_location,
          stdTestResult: this.data.std_test_results,
          hivTestDesired: this.data.hiv_test_desired,
        });
      } else {
        this.personalDetails.patchValue({
          firstName: null,
          lastName: null,
          middleInitial: null,
          nickName: null,
          dob: null,
          // dob: this.data.date_of_birth,
          placeOfBirth: null,
          ssn: null,
          //  age:                   this.data.,
          sex: null,
          maritalStatus: null,
          race: null,
          primaryPhone: null,
          primaryLanguage: null,
          addressMain: null,
          addressLine2: null,
          city: null,
          country: null,
          state: null,
          zipcode: null,
          contactPerson: null,
          relationship: null,
          contactPersonAddress: null,
          phone: null,
          religiousPreferences: null,
          hobbiesInterests: null,
          consent: null,
        });
        this.incomeAndResources.patchValue({
          income: null,
          type: null,
          bankAccount: null,
          bankName: null,
          directDeposit: null,
          otherAssets: null,
          medicaid: null,
          vaCoverage: null,
          medicareCoverage: null,
          othMedCoverage: null,
          cashBenefits: null,
          nonCashBenefits: null,
          receivingBenefits: null,
          applyingBenefits: null,
        });
        this.socialAndFamilyHistory.patchValue({
          childhood: null,
          discipline: null,
          everMarried: null,
          numberOfMarriages: null,
          relationShipWithParents: null,
          relationShipWithSiblings: null,
          physicalAbuse: null,
          sexualAbuse: null,
          healthProblemsInFamily: null,
          substanceAbuse: null,
          currentMaritalStatus: null,
          sexualOrientation: null,
          sexuallyActive: null,
          sexualProblemsOrConcerns: null,
          specifySexualProblems: null,
          testedForHivOrAids: null,
          hivTestedDate: null,
          hivTestedLocation: null,
          hivTestResult: null,
          testedSTDs: null,
          stdTestedDate: null,
          stdTestedLocation: null,
          stdTestResult: null,
          hivTestDesired: null,
        });
      }
      console.log('daaaata', this.data);
    });
  }

  initializeFormGroups() {
    this.personalDetails = this.fb.group({
      veteranID: [this.selecteVetId, Validators.required],
      firstName: ['', Validators.required],
      middleInitial: ['', Validators.required],
      lastName: ['', Validators.required],
      nickName: ['', Validators.required],
      dob: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      ssn: ['', Validators.required],
      age: ['', Validators.required],
      sex: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      race: ['', Validators.required],
      primaryPhone: ['', Validators.required],
      primaryLanguage: ['', Validators.required],
      addressMain: ['', Validators.required],
      addressLine2: ['', Validators.required],
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
    });
    this.incomeAndResources = this.fb.group({
      veteranID: [this.selecteVetId, Validators.required],
      income: ['', Validators.required],
      type: ['', Validators.required],
      bankAccount: ['', Validators.required],
      bankName: ['', Validators.required],
      directDeposit: ['', Validators.required],
      otherAssets: ['', Validators.required],
      medicaid: ['', Validators.required],
      vaCoverage: ['', Validators.required],
      medicareCoverage: ['', Validators.required],
      othMedCoverage: ['', Validators.required],
      otherBenefits: ['', Validators.required],
      cashBenefits: ['', Validators.required],
      nonCashBenefits: ['', Validators.required],
      receivingBenefits: ['', Validators.required],
      applyingBenefits: ['', Validators.required],
    });
    this.socialAndFamilyHistory = this.fb.group({
      veteranID: [this.selecteVetId, Validators.required],
      mothersFullName: ['', Validators.required],
      motherAge: [],
      motherLocation: [],
      motherStatus: ['', Validators.required],
      fathersFullName: ['', Validators.required],
      fatherAge: [],
      fatherLocation: [],
      fatherStatus: ['', Validators.required],
      siblings: new FormArray([]),
      everMarried: ['', Validators.required],
      numberOfMarriages: ['', Validators.required],
      spouseOrSignificantOther: ['', Validators.required],
      children: new FormArray([]),
      childhood: ['', Validators.required],
      relationShipWithParents: ['', Validators.required],
      relationShipWithSiblings: ['', Validators.required],
      discipline: ['', Validators.required],
      physicalAbuse: ['', Validators.required],
      sexualAbuse: ['', Validators.required],
      healthProblemsInFamily: ['', Validators.required],
      currentMaritalStatus: ['', Validators.required],
      sexualOrientation: ['', Validators.required],
      sexuallyActive: ['', Validators.required],
      sexualProblemsOrConcerns: ['', Validators.required],
      specifySexualProblems: ['', Validators.required],
      testedForHivOrAids: ['', Validators.required],
      hivTestedDate: ['', Validators.required],
      hivTestedLocation: ['', Validators.required],
      hivTestResult: ['', Validators.required],
      testedSTDs: ['', Validators.required],
      stdTestedDate: ['', Validators.required],
      stdTestedLocation: ['', Validators.required],
      stdTestResult: ['', Validators.required],
      hivTestDesired: ['', Validators.required],
      substanceAbuse: ['', Validators.required],
    });
    this.familyMembers = this.fb.group({
      veteranId: [this.selecteVetId],
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      age: ['', Validators.required],
      location: ['', Validators.required],
      living: ['', Validators.required],
    });
  }

  buildForm() {
    this.page1Form = this.fb.group({
      personalDetails: this.personalDetails,
      incomeAndResources: this.incomeAndResources,
      socialAndFamilyHistory: this.socialAndFamilyHistory,
      familyMembers: this.familyMembers,
    });
  }

  get iaPage1PD() {
    return this.personalDetails.controls;
  }
  get iaPage1IR() {
    return this.incomeAndResources.controls;
  }

  onSubmit() {
    this.ia1 = true;
    this.greyingOut = true;
    let jobType = this.incomeAndResources.value.type;
    this.incomeAndResources.value.type = '{' + jobType + '}';
    let neededBeni = this.incomeAndResources.value.applyingBenefits;
    let othMedBenifits = this.incomeAndResources.value.othMedCoverage;
    this.incomeAndResources.value.applyingBenefits = '{' + neededBeni + '}';
    this.incomeAndResources.value.othMedCoverage = '{' + othMedBenifits + '}';
    let incType = this.incomeAndResources.value.type;
    let accType = this.incomeAndResources.value.bankAccount;
    let othAssets = this.incomeAndResources.value.otherAssets;
    let currBenefits = this.incomeAndResources.value.receivingBenefits;
    let cashBeni = this.incomeAndResources.value.cashBenefits;
    let nonCashBeni = this.incomeAndResources.value.nonCashBenefits;
    this.incomeAndResources.value.type = '{' + incType + '}';
    this.incomeAndResources.value.bankAccount = '{' + accType + '}';
    this.incomeAndResources.value.otherAssets = '{' + othAssets + '}';
    this.incomeAndResources.value.receivingBenefits = '{' + currBenefits + '}';
    this.incomeAndResources.value.cashBenefits = '{' + cashBeni + '}';
    this.incomeAndResources.value.nonCashBenefits = '{' + nonCashBeni + '}';
    this.submitted = true;
    this.service
      .initialTreatmentGoalsPage1(this.page1Form.value)
      .subscribe((data) => {
        if (data.responseStatus === 'SUCCESS') {
          this.ia1 = false;
          this.greyingOut = false;
          this.successMessage();
          this.setForm();
        } else if (data.responseStatus === 'FAILURE') {
          this.errorMessage();
        }

        console.log('Submitted');
      });
    // this.router.navigateByUrl(
    //   'case-worker/resident-search/initial-assessment/page-2'
    // );
    console.log('page 1 values', this.page1Form.value);
  }
  next() {
    console.log('clicked next');
    if (!this.page1Form.touched) {
      this.router.navigateByUrl(
        'case-worker/resident-search/initial-assessment/page-2'
      );
    } else {
      this.infoMessage();
    }
  }

  reset() {
    this.ia1 = true;
    this.greyingOut = true;
    this.setForm();
  }

  getFamilyDetailFormGroup() {
    return this.fb.group({
      name: ['test', Validators.required],
      age: ['tage', Validators.required],
      location: ['tloc', Validators.required],
    });
  }

  addSibling() {
    const siblingsFormArray = this.siblings;
    siblingsFormArray.push(this.getFamilyDetailFormGroup());
  }

  removeSibling(index: number) {
    const siblingsFormArray = this.siblings;
    siblingsFormArray.removeAt(index);
  }

  get siblings() {
    return this.page1Form.get([
      'socialAndFamilyHistory',
      'siblings',
    ]) as FormArray;
  }

  addChildren() {
    const childrenFormArray = this.children;
    childrenFormArray.push(this.getFamilyDetailFormGroup());
  }

  removeChildren(index: number) {
    const childrenFormArray = this.children;
    childrenFormArray.removeAt(index);
  }

  get children() {
    return this.page1Form.get([
      'socialAndFamilyHistory',
      'children',
    ]) as FormArray;
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
  warnMessage() {
    this.messageService.add({
      severity: 'warn',
      summary: 'please fill!',
      detail: 'Please fill the required fields!',
    });
  }

  userArray: any;

  onEdit(item: any) {
    this.userArray.forEach((element: { isEdit: boolean }) => {
      element.isEdit = false;
    });
    item.isEdit = true;
  }
  deleteMember(vetId: number, memId: number) {
    this.ia1 = true;
    this.greyingOut = true;
    this.removeMember = {
      memId,
    };
    if (confirm('Selected Member will be Removed from the Family List') === true) {
      this.service.deleteMember(this.selecteVetId, memId).subscribe((data) => {
        if (data.responseStatus === 'SUCCESS') {
          this.ia1 = false;
          this.greyingOut = false;
          console.log(
            'deleted member id is',
            this.removeMember,
            'for veteran',
            this.selecteVetId
          );
          this.deletedFamMember();
          this.getFamilyMembers();
        } else if (data.responseStatus === 'FAILURE') {
          this.ia1 = false;
          this.greyingOut = false;
          this.errorMessage();
        }
      });
    } else{
      this.ia1 = false;
      this.greyingOut = false;
    }
  }

  addNew() {
    this.addNewMember = true;
  }
  clearFields() {
    this.familyMembers.controls['name'].reset();
    this.familyMembers.controls['age'].reset();
    this.familyMembers.controls['relationship'].reset();
    this.familyMembers.controls['living'].reset();
    this.familyMembers.controls['location'].reset();
  }
  saveNewMember() {
    this.ia1 = true;
    this.greyingOut = true;
    this.service.addMember(this.familyMembers.value).subscribe((data) => {
      if (data.responseStatus === 'SUCCESS') {
        this.ia1 = false;
        this.greyingOut = false;
        this.addNewMember = false;
        this.addedNewFamMember();
        this.getFamilyMembers();
        this.clearFields();
        this.hasFamMembers = false;
      } else if (data.responseStatus === 'FAILURE') {
        this.errorMessage();
        this.ia1 = false;
        this.greyingOut = false;
      }
    });
  }
  cancelNewMember() {
    this.addNewMember = false;
  }

  updateFamMembersDetails(vetId: number, memId: number) {
    console.log('update member', this.familyMembers.value);
    console.log(vetId, memId);
    this.ia1 = true;
    this.greyingOut = true;
    this.service
      .updateMemberDetails(this.selecteVetId, memId, this.familyMembers.value)
      .subscribe((data) => {
        console.log('update femily details', this.familyMembers.value);
        if (data.responseStatus === 'SUCCESS') {
          this.ia1 = false;
          this.greyingOut = false;
          this.updateMemberDetails();
          this.getFamilyMembers();
        } else if (data.responseStatus === 'FAILURE') {
          this.ia1 = false;
          this.greyingOut = false;
          this.errorMessage();
        }
      });
  }

  deletedFamMember() {
    this.messageService.add({
      severity: 'success',
      summary: 'Successfull',
      detail: 'Successfully Deleted the Member',
    });
  }

  addedNewFamMember() {
    this.messageService.add({
      severity: 'success',
      summary: 'Successfull',
      detail: 'Successfully Added New Family Member',
    });
  }

  updateMemberDetails() {
    this.messageService.add({
      severity: 'success',
      summary: 'Successfull',
      detail: 'Successfully Updates Family Member Details',
    });
  }
}

@Pipe({ name: 'livingStatus' })
export class livingPipe implements PipeTransform {
  transform(value: any) {
    if (value === true) {
      return 'Living';
    }
    if (value === false) {
      return 'Deceased';
    }
    return value;
  }
}
