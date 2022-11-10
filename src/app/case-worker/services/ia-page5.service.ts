import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { progressNoteResponse } from 'src/app/shared/models/progressNotes_model';
import { RestClientService } from 'src/app/shared/services/rest-client.service';
import { environment } from 'src/environments/environment';
import { environment as env } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IaPage5Service {

  constructor(private restcs: RestClientService,private http:HttpClient) {}
  private commonUrl=environment.localUrl;
  private getInitialTreatmentPage = env.serviceUrl.getInitialTreatmentPage;
  private postInitialTreatmentPage = env.serviceUrl.postIAPage5Details;
  private isDev = isDevMode();

  public getInitialTreatmentGoalsPage5( endPoint: number): Observable<any> {
    if (this.isDev){
    return this.restcs.get(this.commonUrl+'initialAssessment/page-5/'+endPoint);
    } else{
      //env api goes here
      return this.restcs.get(this.getInitialTreatmentPage+endPoint);
    }
}

  public initialTreatmentGoalsPage5(data:any): Observable<any> {
    if (this.isDev){
      return this.restcs.post(this.commonUrl+'initialAssessment/page-5/',data);
    } else{
      //env api goes here
      return this.restcs.post(this.postInitialTreatmentPage,data);
    }
}
}
