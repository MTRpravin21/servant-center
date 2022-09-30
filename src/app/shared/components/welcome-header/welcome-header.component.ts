import { Component, Input, OnInit } from '@angular/core';
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
  @Input() public name: any;
  @Input() public image: any;
  imageObj!: File;
  veteranId!: number;
  imageUrl!: any;
  userGroup!: string;
  caseWorkerId!: number;
  loginId!: number;
  imageFileName!: string;

  constructor(
    private profileservice: VeteranprofileService,
    private cacheData: ClipBoardService,
    private messageService: MessageService,
    private sanitization: DomSanitizer,
    private service: DataService
  ) {}

  ngOnInit(): void {
    console.log('welcome header component');
    this.userGroup=this.cacheData.get('userGroup');
    if (this.userGroup.toUpperCase() === 'VETERAN') {
      this.loginId = this.cacheData.get('veteranId');
    } else if (this.userGroup.toUpperCase() === 'CASEWORKER') {
      this.loginId = this.cacheData.get('caseworkerId');
    }
    this.displayImage();
  }

  changePhoto(imageInput: HTMLInputElement) {
    console.log('imageInput.files![0]', imageInput.files![0]);
    const imageFile: File = imageInput.files![0];
    this.imageObj = imageFile;
    let imageForm = new FormData();
    const regex = new RegExp('[^.]+$');
    let extension = this.imageObj.name.match(regex);
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
        .profileimageUpload(imageForm,this.loginId)
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
  }

  displayImage() {
    console.log('user group', this.userGroup);
    console.log('login id', this.loginId);
    if (this.userGroup.toUpperCase() === 'VETERAN') {
      this.profileservice.getProfileData(this.loginId).subscribe((data) => {
        let veteranDetails = data;
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
      var imageSrc =
        'data:application/octet-stream;base64,' + response.data;
      this.imageUrl = this.sanitization.bypassSecurityTrustUrl(imageSrc);
      console.log('image', this.imageUrl);
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
}
