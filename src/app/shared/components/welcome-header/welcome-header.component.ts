import { Component, isDevMode, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/case-worker/services/data.service';
import { VeteranprofileService } from 'src/app/veteran/services/veteranprofile.service';
import { ClipBoardService } from '../../services/clip-board.service';

@Component({
  selector: 'app-welcome-header',
  templateUrl: './welcome-header.component.html',
  styleUrls: ['./welcome-header.component.scss'],
  providers: [MessageService],
})
export class WelcomeHeaderComponent implements OnInit {
  nickName: any;
  imageObj!: File;
  veteranId!: number;
  imageUrl!: any;
  userGroup!: string;
  caseWorkerId!: number;
  loginId!: number;
  imageFileName!: string;
  private isDev = isDevMode();

  constructor(
    private profileservice: VeteranprofileService,
    private cacheData: ClipBoardService,
    private messageService: MessageService,
    private sanitization: DomSanitizer,
    private service: DataService
  ) {}

  ngOnInit(): void {
    console.log('welcome header component');
    if (this.isDev) {
      this.userGroup = 'VETERAN';
    } else {
      this.userGroup = this.cacheData.get('userGroup');
    }
    if (this.userGroup.toUpperCase() === 'VETERAN') {
      this.loginId = this.cacheData.get('veteranId');
    } else if (this.userGroup.toUpperCase() === 'CASEWORKER') {
      this.loginId = this.cacheData.get('caseworkerId');
    }
    this.displayImage();
  }

  changePhoto(imageInput: HTMLInputElement) {
    console.log('imageInput.files![0]', imageInput.files![0]);
    this.imageObj = imageInput.files![0];
    console.log(this.imageObj.size);
    if (this.imageObj.size > 5242880) {
      this.photoMaxSizeErrorMessage();
    } else {
      if (
        this.imageObj.type === 'image/jpeg' ||
        this.imageObj.type === 'image/png'
      ) {
        let sanitizedFileName = this.sanitization.sanitize(
          SecurityContext.HTML,
          this.imageObj.name
        );
        let imageForm = new FormData();
        const regex = new RegExp('[^.]+$');
        let extension = sanitizedFileName?.match(regex);
        let imageType = extension?.[0];
        let currentDate = new Date();
        let todayDate =
          currentDate.getDate() +
          '-' +
          (currentDate.getMonth() + 1) +
          '-' +
          currentDate.getFullYear();
        let fileName = this.loginId + '_' + todayDate + '.' + imageType;
        imageForm.append('image', this.imageObj);
        imageForm.append('imageName', fileName);
        imageForm.append('userGroup', this.userGroup);

        if (this.loginId) {
          this.profileservice
            .profileimageUpload(imageForm, this.loginId)
            .subscribe((response) => {
              console.log(response);
              if (response.responseStatus == 'SUCCESS') {
                this.sucessMessage();
                this.displayImage();
              } else if (response.responseStatus == 'FAILURE') {
                this.errorMessage();
              }
            });
        }
      } else {
        this.photoTypeErrorMessage();
      }
    }
  }

  displayImage() {
    console.log('user group', this.userGroup);
    console.log('login id', this.loginId);
    if (this.userGroup.toUpperCase() === 'VETERAN') {
      this.profileservice.getProfileData(this.loginId).subscribe((data) => {
        let veteranDetails = data;
        this.nickName = veteranDetails.data[0].nick_name;
        let veteranImageName = veteranDetails.data[0].photo;
        console.log('veteran db photo name', veteranImageName);
        if (veteranImageName === null) {
          this.imageUrl = '../assets/images/user-profile.jpg';
        } else {
          this.displayImageFromAWS(veteranImageName);
        }
      });
    } else if (this.userGroup.toUpperCase() === 'CASEWORKER') {
      this.service.getUserData(this.loginId).subscribe((data) => {
        let caseWorkerInfo = data;
        this.nickName = caseWorkerInfo?.nick_name;
        let caseWorkerImageName = caseWorkerInfo[0]?.photo;
        console.log('caseworker db photo name', caseWorkerImageName);
        if (caseWorkerImageName === null) {
          this.imageUrl = '../assets/images/user-profile.jpg';
        } else {
          this.displayImageFromAWS(caseWorkerImageName);
        }
      });
    }
  }

  displayImageFromAWS(fileName: string) {
    this.profileservice.getProfileImage(fileName).subscribe((response: any) => {
      console.log(response);
      if (response.responseStatus == 'SUCCESS') {
        var imageSrc =
          'data:application/' +
          response.data.contentType +
          ';base64,' +
          response.data.imageBody;
        this.imageUrl = this.sanitization.bypassSecurityTrustUrl(imageSrc);
      }
    });
  }

  sucessMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Photo updated sucessfully',
    });
  }

  errorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Photo not updated',
    });
  }

  photoMaxSizeErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Photo upload max 5MB size allowed',
    });
  }

  photoTypeErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Wrong file type, only file type JPEG, JPG and PNG are allowed',
    });
  }
}
