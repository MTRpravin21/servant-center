import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    console.log('footer component');
  }
  onOpenWhatsApp(){
   window.open('https://wa.me/919445108135'); 
   //window.open('https://wa.me/'+this.phone); 
  }
}
