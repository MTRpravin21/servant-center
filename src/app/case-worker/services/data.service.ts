import { Injectable, isDevMode } from '@angular/core';
import {Observable, of} from 'rxjs';
import { environment} from 'src/environments/environment.prod';
import { environment as env } from 'src/environments/environment';;
import { RestClientService } from 'src/app/shared/services/rest-client.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private serviceUrl=env.localUrl
  private getMsgCountAPI = environment.serviceUrl.getTransportRequestFormData;

  constructor(private http: HttpClient, private restcs: RestClientService) {}

  private isDev = isDevMode();
  private caseWorkerApi = environment.serviceUrl.caseWorkerUser;
  private getTreatmentPlanRSAPI = environment.serviceUrl.getTreatmentPlanRS;
  private updateTreatmentPlanAPI = environment.serviceUrl.updateTreatmentPlan;
  public responseCache = new Map();

  
  public getUserData( endPoint: number): Observable<any> {
    // const dataFromCache = this.responseCache.get(URL);
      if (this.isDev) {
    //   if (dataFromCache) {
    //   return of (dataFromCache)
    // } 
    // const response = this.http.get(this.serviceUrl+'uiLayout/getCaseWorkerDetails/3');
    // response.subscribe(data => this.responseCache.set(URL, data));
    // return response;

    return this.restcs.get(this.serviceUrl+'uiLayout/getCaseWorkerDetails/'+ endPoint); 
    } else {
       return this.restcs.get(this.caseWorkerApi + endPoint);
    } 
  }

  public getMsgCount(payload = {}): Observable<any> { 
    if (this.isDev) {
      return this.http.get(this.serviceUrl+'transportationForm/getTransportationRequests/');
    } else {
      return this.http.get(this.getMsgCountAPI);
    }  
  } 

  getTreatmentPlanData(vetID:number): Observable<any> {
    if (this.isDev){
    return this.restcs.get(this.serviceUrl+'residentSearch/getTreatmentPlanDetails/'+ vetID);
    } else{
      return this.restcs.get(this.getTreatmentPlanRSAPI+vetID);
    }
  }
  public updateTreatmentPlanData(vetID:number,data:any): Observable<any>{
    if (this.isDev){
    return this.http.put(this.serviceUrl+'updateTreatmentPlanDetails/save/'+vetID,data);
    } else {
      return this.http.put(this.updateTreatmentPlanAPI+vetID,data);
    }
  } 
  imageUpload(imageForm: FormData) {
    console.log('image uploading',imageForm);
    return this.http.post('http://localhost:3000/api/v1/upload', imageForm);
   }
}
