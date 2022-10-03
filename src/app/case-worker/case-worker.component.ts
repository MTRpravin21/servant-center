import { Component, HostListener, isDevMode, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Auth } from '@aws-amplify/auth';

import { DataService } from './services/data.service';
import { ClipBoardService } from '../shared/services/clip-board.service';
import { VeteranDashboardService } from '../veteran/services/veteran-dashboard.service';

@Component({
  selector: 'app-case-worker',
  templateUrl: './case-worker.component.html',
  styleUrls: ['./case-worker.component.scss'],
})
export class CaseWorkerComponent implements OnInit {
  displayMenu: boolean = true;
  public msgCount!: number;
  public msgData: any;
  items!: MenuItem[];

  username!: string;
  caseWorkerId!: number;
  private isDev = isDevMode();
  nickName!: string;
  isShowComponent: boolean = false;
  userGroup!: string;
  email!: string;
  firstName!:string;
  lastName!:string;
  party_id!:number;

  @HostListener('window:resize')
  onWindowResize() {
    this.displayMenu = window.innerWidth > 768;
  }

  constructor(private service: DataService,
    private dashboarDservice: VeteranDashboardService,
    private cacheData: ClipBoardService) {
    this.service.getMsgCount().subscribe(
      (data: any) => {
        this.msgData = data;
        this.msgCount = this.msgData.length;
        this.itemChange(this.msgCount);
      },
      (err: any) => {
        this.itemChange(0);
      }
    );
  }
  itemChange(msgs: number) {
    this.items = [
      {
        label: 'DASHBOARD',
        icon: 'fa fa-tachometer-alt',
        styleClass: 'menu-items--text menu-item--1',
        routerLink: ['/case-worker/'],
      },
      {
        label: `REQUESTS (${msgs})+`,
        icon: 'fa fa-bell',
        styleClass: 'menu-items--text menu-item--2',
        routerLink: ['/case-worker/messages'],
      },
      {
        label: 'RESIDENT SEARCH',
        icon: 'fa fa-search',
        styleClass: 'menu-items--text menu-item--3',
        routerLink: ['/case-worker/resident-search'],
      },
      // {
      //   label: 'PROFILE',
      //   icon: 'fa fa-user-circle',
      //   styleClass: 'menu-items--text menu-item--5',
      //   routerLink: ['/case-worker/profile'],
      // },
      {
        label: 'LOGOUT',
        icon: 'fas fa-sign-out-alt',
        styleClass: 'menu-items--text menu-item--6',
        command: () => this.onLogoutClick(),
      },
    ];
  }

  ngOnInit(): void {
   // document.getElementById("overlay")!.style.display="block";
    console.log('case worker component');
    this.getLoginId();
    if (window.innerWidth < 768) this.displayMenu = false;
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
        this.dashboarDservice
          .getVeteranIdByUsername(this.username)
          .subscribe((response) => {
            console.log(response)
            if (response.responseStatus == 'SUCCESS') {
              if (response.data.length === 1) {
                this.caseWorkerId = response.data[0].party_id;
                this.cacheData.set('caseworkerId', this.caseWorkerId);
                if (this.caseWorkerId) {
                  this.isShowComponent = true;
                }
              } else if (response.data.length === 0) {
                 console.log('username is not present')
                 this.party_id=Math.floor(100000 + Math.random() * 900000);
                 console.log("generated party Id",this.party_id);
                 if(this.userGroup.toUpperCase()==='CASEWORKER'){
                  this.userGroup="case worker"
                 }
                const userDetails={
                  "userName": this.username,
                  "userGroup": this.userGroup,
                  "partyId": this.party_id
                };
                this.dashboarDservice.addUser(userDetails).subscribe((response)=>{
                  if (response.responseStatus == 'SUCCESS') {
                      console.log(response);
                       if(this.userGroup.toUpperCase()==='CASE WORKER'){
                        const caseWorkerDetails={
                          "caseWorkerId": this.party_id,
                          "nickName":this.nickName,
                          "email":this.email
                        };
                        this.dashboarDservice.addCaseWorker(caseWorkerDetails).subscribe((response)=>{
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
      this.dashboarDservice.getVeteranIdByUsername(this.username).subscribe((response) => {
        if (response.responseStatus == 'SUCCESS') {
          this.caseWorkerId = response.data[0].party_id;
          this.cacheData.set('caseworkerId', this.caseWorkerId);
          console.log('web_party_id', this.caseWorkerId);
          if (this.caseWorkerId) {
            this.isShowComponent = true;
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
    console.log('Logout Clicked');

    Auth.signOut();
  }

}
