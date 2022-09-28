import { Component, Input, OnInit } from '@angular/core';
import { ClipBoardService } from 'src/app/shared/services/clip-board.service';
import { DataService } from '../../services/data.service';
import { Auth } from '@aws-amplify/auth';
import { VeteranDashboardService } from 'src/app/veteran/services/veteran-dashboard.service';

@Component({
  selector: 'app-case-worker-profile',
  templateUrl: './case-worker-profile.component.html',
  styleUrls: ['./case-worker-profile.component.scss'],
})
export class CaseWorkerProfileComponent {
  public caseWorker: any;
  public userInfo: any;
  username!: string;
  public imageObj!: File;
  public imageUrl!: string;
  @Input() public profilePic!: string;
  caseWorkerId: any;
  @Input() public nickName!: string;
  @Input() public firstName!: string;
  @Input() public lastName!: string;
  public isShowSpinner:boolean=true;
  userGroup!: string;

  constructor(
    private service: DataService,
    private cacheData: ClipBoardService,
    private dashboarDservice: VeteranDashboardService,
  ) {
    Auth.currentAuthenticatedUser().then((user) => {
      console.log('Authenticated User Details', user);
      const userPayloadObject = user?.signInUserSession;
      this.userGroup =
        userPayloadObject.accessToken?.payload['cognito:groups']?.[0];
      this.firstName = userPayloadObject?.idToken?.payload?.given_name;
      this.lastName = userPayloadObject?.idToken?.payload?.family_name;
      this.nickName = userPayloadObject?.idToken?.payload?.nickname;
      // this.profilePic = userPayloadObject?.idToken?.payload?.photo;
      // if (this.profilePic === null) {
      //   this.profilePic = 'assets/images/profile.svg';
      // }
      console.log('CaseWorker firstName', this.firstName);
      console.log('CaseWorker lastName', this.lastName);
      console.log('CaseWorker nickName', this.nickName);
      this.dashboarDservice
        .getVeteranIdByUsername(this.username)
        .subscribe((response) => {
          console.log(response)
          if (response.responseStatus == 'SUCCESS') {
            if (response.data.length === 1) {
              this.caseWorkerId = response.data[0].party_id;
              this.cacheData.set('caseworkerId', this.caseWorkerId);
              this.caseWorkerId = this.cacheData.get('caseWorkerId');
              console.log("case Id is:", this.caseWorkerId);

              this.service.getUserData(this.caseWorkerId).subscribe((data) => {
                this.userInfo = data;
                console.log("Case Profile Info:", this.userInfo);
                this.profilePic = this.userInfo[0]?.photo;
                if (this.profilePic === null) {
                  this.profilePic = 'assets/images/profile.svg';
                }
              });
            }
          }
          this.isShowSpinner=false;
          document.getElementById("overlay")!.style.display="none"
        });
    });
  }
  ngOnInit():void{
    document.getElementById("overlay")!.style.display="block";
  }
  onImagePicked(imageInput: HTMLInputElement): void {
    console.log('image upload ******', imageInput.files![0]);
    const FILE:File = imageInput.files![0];
    this.imageObj = FILE;
  }

  onImageUpload() {
    let imageForm = new FormData();
    imageForm.append('image', this.imageObj);
    this.service.imageUpload(imageForm).subscribe((res) => {
      //this.imageUrl = res['image'];
      console.log('uploaded successfully');
    });
  }
}
