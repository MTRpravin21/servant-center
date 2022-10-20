import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VeteranprofileService } from 'src/app/veteran/services/veteranprofile.service';
import { MessageService } from 'primeng/api';

import {
  genders,
  states,
  statuses,
  relations,
} from '../../../veteran/app.constants';
import { VeteranProfileResponse } from '../../models/VeteranProfileResponse';
import { ClipBoardService } from '../../services/clip-board.service';
import { DomSanitizer } from '@angular/platform-browser';

interface DropDown {
  name: string;
}

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  providers: [MessageService],
})
export class ProfileFormComponent implements OnInit {
  public profileDetails: any;
  public profileForm!: FormGroup;
  public veteran: any;
  public states!: DropDown[];
  public maritalStatus!: DropDown[];
  public relations!: DropDown[];
  public imageObj!: File;
  public imageUrl!: any;
  public selectedState!: DropDown;
  public selectedGender: any = null;
  public selectedMaritalStatus!: DropDown;
  public customPatterns = { '0': { pattern: new RegExp('[a-zA-Z]') } };
  public genders!: DropDown[];
  public selectedRelationship: any;
  maxDateValue!: Date;
  @Input() isShowFields!: boolean;
  veteranId!: number;
  showSpinner: boolean = true;
  showOverlay: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private service: VeteranprofileService,
    private cacheData: ClipBoardService,
    private messageService: MessageService,
    private sanitization: DomSanitizer
  ) {
    this.veteranId = this.cacheData.get('veteranId');
    this.setForm();
    this.states = states;
    this.genders = genders;
    this.maritalStatus = statuses;
    this.relations = relations;
    this.maxDateValue = new Date(new Date().getTime());
  }

  ngOnInit(): void {
    this.selectedState = this.states[1];
    this.selectedGender = this.genders[1];
    this.selectedMaritalStatus = this.maritalStatus[1];
    this.selectedRelationship = this.relations[1];
    this.buildForm();
  }

  setForm() {
    this.service
      .getProfileData(this.veteranId)
      .subscribe((data: VeteranProfileResponse) => {
        this.profileDetails = data;
        this.veteran = this.profileDetails.data[0];
        if (this.veteran) {
          this.showSpinner = false;
          this.showOverlay = false;
        }
        console.log('Profile API Data--->', data);
        if (this.veteran.place_of_birth === 'x') {
          this.veteran.place_of_birth = '';
        }
        if (this.veteran.ssn === 1234) {
          this.veteran.ssn = '';
        }
        if (this.veteran.address_main === 'x') {
          this.veteran.address_main = '';
        }
        if (this.veteran.city === 'x') {
          this.veteran.city = '';
        }
        if (this.veteran.zip_code === 1234) {
          this.veteran.zip_code = '';
        }
        if (this.veteran.contact_person === 'x') {
          this.veteran.contact_person = '';
        }
        if (this.veteran.contact_person_phone === '1234') {
          this.veteran.contact_person_phone = '';
        }
        if (this.veteran.primary_language === 'x') {
          this.veteran.primary_language = '';
        }
        if (this.veteran.religious_preference === 'x') {
          this.veteran.religious_preference = '';
        }
        if (this.veteran.race === 'x') {
          this.veteran.race = '';
        }
        let dateOfBirth = new Date(
          new Date(this.veteran.date_of_birth).toUTCString()
        );
        let veteranDateOfBirth =
          dateOfBirth.getMonth() +
          1 +
          '/' +
          dateOfBirth.getDate() +
          '/' +
          dateOfBirth.getFullYear();
        if (veteranDateOfBirth === '9/15/1777') {
          veteranDateOfBirth = '';
        }
        // this.displayImage();
        this.profileForm.patchValue({
          firstName: this.veteran.first_name,
          middleName: this.veteran.middle_initial,
          lastName: this.veteran.last_name,
          nickName: this.veteran.nick_name,
          DOB: veteranDateOfBirth,
          POB: this.veteran.place_of_birth,
          SSNNumber: this.veteran.ssn,
          hmisIdNo: this.veteran.hmis_id,
          selectedGenders: this.veteran.gender,
          selectedState: this.veteran.state,
          selectedMaritalStatus: this.veteran.marital_status,
          phoneNumber: this.veteran.primary_phone,
          address1: this.veteran.address_main,
          city: this.veteran.city,
          country: this.veteran.county,
          address2: this.veteran.address_line_2,
          zipCode: this.veteran.zip_code,
          hobbies: this.veteran.hobbies,
          primaryLanguage: this.veteran.primary_language,
          relegion: this.veteran.religious_preference,
          race: this.veteran.race,
          cfirstName: this.veteran.contact_person,
          selectedRelationship: this.veteran.contact_person_relationship,
          cPhoneNumber: this.veteran.contact_person_phone,
          cHouseNumber: this.veteran.contact_person_address,
          maxDateValue: new Date(new Date().getTime()),
        });
      });
  }

  buildForm() {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      nickName: ['', [Validators.required]],
      DOB: ['', Validators.required],
      POB: ['', [Validators.required]],
      phoneNumber: ['', Validators.required],
      cfirstName: ['', [Validators.required]],
      hobbies: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      city: ['', [Validators.required]],
      selectedState: ['', Validators.required],
      selectedRelationship: ['', Validators.required],
      country: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.minLength(5)]],
      selectedGenders: ['', Validators.required],
      selectedMaritalStatus: ['', Validators.required],
      SSNNumber: ['', [Validators.required]],
      hmisIdNo: ['', [Validators.required]],
      race: ['', Validators.required],
      primaryLanguage: ['', Validators.required],
      relegion: ['', Validators.required],
      cHouseNumber: ['', [Validators.required]],
      cPhoneNumber: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get getControl() {
    return this.profileForm.controls;
  }

  onSubmit() {
    this.showOverlay = true;
    this.showSpinner = true;
    console.log('Profile Form submitted value', this.profileForm.value);
    let profileDetails = this.profileForm.value;
    this.service
      .updateProfile(this.veteranId, profileDetails)
      .subscribe((response) => {
        if (response.responseStatus == 'SUCCESS') {
          this.setForm();
          this.sucessMessage();
        } else if (response.responseStatus == 'FAILURE') {
          this.errorMessage();
        }
      });
  }

  sucessMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated sucessfully',
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Profile not updated',
    });
  }

  resetMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile reset completed',
    });
  }

  resetForm() {
    this.showOverlay = true;
    this.buildForm();
    this.showSpinner = true;
    this.setForm();
    this.resetMessage();
  }

}
