import { Component, HostListener, isDevMode, OnInit } from '@angular/core';

import { Auth } from '@aws-amplify/auth';
import { MenuItem } from 'primeng/api';
import { VeteranProfileResponse } from '../shared/models/VeteranProfileResponse';

import { ClipBoardService } from '../shared/services/clip-board.service';
import { VeteranDashboardService } from './services/veteran-dashboard.service';
import { VeteranprofileService } from './services/veteranprofile.service';

@Component({
  selector: 'app-veteran',
  templateUrl: './veteran.component.html',
  styleUrls: ['./veteran.component.scss'],
})
export class VeteranComponent implements OnInit {
  public name: any;
  public data: any;
  public image: any;
  public userInfo: any;

  username!: string;
  veteranId!: number;
  private isDev = isDevMode();
  nickName!: string;
  isShowComponent: boolean = false;
  userGroup!: string;
  email!: string;
  firstName!:string;
  lastName!:string;
  party_id!:number;


  constructor(
    private profileService: VeteranprofileService,
    private service: VeteranDashboardService,
    private cacheData: ClipBoardService
  ) {
  }

  public displayMenu = true;

  @HostListener('window:resize')
  onWindowResize() {
    this.displayMenu = window.innerWidth > 768;
  }

  public items: MenuItem[] = [
    {
      label: 'DASHBOARD',
      icon: 'fa fa-tachometer-alt',
      styleClass: 'menu-items--text menu-item--1',
      routerLink: ['/veteran/'],
    },
    {
      label: 'ASSESSMENT',
      icon: 'fa fa-file-alt',
      styleClass: 'menu-items--text menu-item--2',
      routerLink: ['/veteran/assessment'],
    },
    {
      label: 'TREATMENT PLAN',
      icon: 'pi pi-star',
      styleClass: 'menu-items--text menu-item--3',
      routerLink: ['/veteran/treatment-plan'],
    },
    {
      label: 'HEALTH TRACKER',
      icon: 'fa fa-heartbeat',
      styleClass: 'menu-items--text menu-item--4',
      routerLink: ['/veteran/health-tracker'],
    },
    {
      label: 'PROFILE',
      icon: 'fa fa-user-circle',
      styleClass: 'menu-items--text menu-item--5',
      routerLink: ['/veteran/profile'],
    },
    {
      label: 'LOGOUT',
      icon: 'fas fa-sign-out-alt',
      styleClass: 'menu-items--text menu-item--6',
      command: () => this.onLogoutClick(),
    },
  ];

  ngOnInit(): void {
   // document.getElementById("overlay")!.style.display="block";
    console.log('veteran component');
    this.getLoginId()
    if (window.innerWidth < 768) this.displayMenu = false;

    const userData = this.cacheData.get('userData');

    console.log('veteran component::userData:', userData);
  }

  getLoginId(){
    if (this.isDev) {
      this.username = 'mt_veteran';
      this.getUserId();
    } else {
      Auth.currentAuthenticatedUser().then((user) => {
        console.log('Authenticated User Details', user);
        const userPayloadObject = user?.signInUserSession;
        this.userGroup =
          userPayloadObject.accessToken?.payload['cognito:groups']?.[0];
        this.username = userPayloadObject?.accessToken?.payload?.username;
        this.email = userPayloadObject?.idToken?.payload?.email;
        this.firstName = userPayloadObject?.idToken?.payload?.given_name;
        this.lastName = userPayloadObject?.idToken?.payload?.family_name;
        this.nickName = userPayloadObject?.idToken?.payload?.nickname;
        this.cacheData.set('userGroup',this.userGroup)
        console.log('Authenticated UserName', this.username);
        console.log('Authenticated email', this.email);
        console.log('Authenticated firstName', this.firstName);
        console.log('Authenticated lastName', this.lastName);
        console.log('Authenticated nickName', this.nickName);
        this.service
          .getVeteranIdByUsername(this.username)
          .subscribe((response) => {
            console.log(response)
            if (response.responseStatus == 'SUCCESS') {
              if (response.data.length === 1) {
                this.veteranId = response.data[0].party_id;
                this.cacheData.set('veteranId', this.veteranId);
                this.cacheData.set('loginId', this.veteranId);
                if (this.veteranId) {
                  this.isShowComponent = true;
                  this.displayWelcomeData();
                }
              } else if (response.data.length === 0) {
                 console.log('username is not present')
                 this.party_id=Math.floor(100000 + Math.random() * 900000);
                 console.log("generated party Id",this.party_id);
                 if(this.userGroup.toUpperCase()==='VETERAN'){
                  this.userGroup="veteran"
                 }
                const userDetails={
                  "userName": this.username,
                  "userGroup": this.userGroup,
                  "partyId": this.party_id
                };
                this.service.addUser(userDetails).subscribe((response)=>{
                  if (response.responseStatus == 'SUCCESS') {
                      console.log(response);
                      if(this.userGroup.toUpperCase()==='VETERAN'){
                        const veteranDetails={
                          "veteranId": this.party_id,
                          "firstName": this.firstName,
                          "lastName": this.lastName,
                          "nickName":this.nickName,
                          "email":this.email
                        };
                        this.service.addVeteran(veteranDetails).subscribe((response)=>{
                          if (response.responseStatus == 'SUCCESS') {
                            console.log(response);
                          }
                        })
                      }
                      this.getUserId();
                  }
                })
              }
            }
          });
      });
    }
    }

    getUserId() {
      this.service.getVeteranIdByUsername(this.username).subscribe((response) => {
        if (response.responseStatus == 'SUCCESS') {
          this.veteranId = response.data[0].party_id;
          this.cacheData.set('veteranId', this.veteranId);
          this.cacheData.set('loginId', this.veteranId);
          console.log('web_party_id', this.veteranId);
          if (this.veteranId) {
            this.isShowComponent = true;
            this.displayWelcomeData();
          }
        }
      });
    }
  

  toggleMenu(): void {
    this.displayMenu = !this.displayMenu;
  }
  activeMenu(event: any) {
    if (window.innerWidth < 768) this.displayMenu = !this.displayMenu;
  }
  onLogoutClick() {
    Auth.signOut();
  }

  displayWelcomeData(){
    this.veteranId = this.cacheData.get("veteranId");
    this.profileService.getProfileData(this.veteranId).subscribe((data) => { 
      this.userInfo = data;
      this.name = this.userInfo.data[0].nick_name;
      this.image = this.userInfo.data[0].photo;
      if (this.image === null) {
        this.image = '../assets/images/user-profile.jpg';
      }
      //document.getElementById("overlay")!.style.display="none"
    });
  }
}
