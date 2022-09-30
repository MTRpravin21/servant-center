import { Component, Input, OnInit } from '@angular/core';
import { VeteranprofileService } from 'src/app/veteran/services/veteranprofile.service';
import { VeteranProfileResponse } from '../../models/VeteranProfileResponse';
import { ClipBoardService } from '../../services/clip-board.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public veteranData: any;
  veteran_id!:number;
  public phone: any;
  constructor(
    private service: VeteranprofileService,
    private cacheData: ClipBoardService,

  ) {}

  ngOnInit(): void {
    this.veteran_id = this.cacheData.get("veteranId")
    // this.service
    // .getProfileData(this.veteran_id)
    // .subscribe((data: VeteranProfileResponse) => {
    //   this.veteranData = data;
    //   this.phone = this.veteranData.data[0].contact_person_phone
    //   console.log("Phone--"+ this.phone);
    // })

    console.log('footer component');
  }
  onOpenWhatsApp(){
   window.open('https://wa.me/919445108135'); 
   //window.open('https://wa.me/'+this.phone); 
  }
}
