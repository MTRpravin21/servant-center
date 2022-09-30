import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import {Observable, of} from 'rxjs';
import { environment} from 'src/environments/environment.prod';
import { environment as env } from 'src/environments/environment';;
@Injectable({
  providedIn: 'root',
})
export class TransportService {
  private isDev = isDevMode();
  private serviceUrl=env.localUrl
  private getTransportRequestFormDataAPI = environment.serviceUrl.getTransportRequestFormData;
  private approveTransportationFormAPI = environment.serviceUrl.approveTransportationForm;
  public responseCache = new Map();


  constructor(private http: HttpClient) {}

  public getTransportRequestFormData(payload = {}): Observable<any> {
    const dataFromCache = this.responseCache.get(URL);
    if (this.isDev) {
      return this.http.get(this.serviceUrl+'transportationForm/getTransportationRequests/');
    } else {
      return this.http.get(this.getTransportRequestFormDataAPI);
    }  

    // if (dataFromCache) {
    //   return of (dataFromCache)
    // } 
    // const response = this.http.get(this.getTransportRequestFormDataAPI);
    // response.subscribe(data => this.responseCache.set(URL, data));
    // console.log("URL-----",URL);
    
    // return response;
  }

  public approveTransportationForm(data:any): Observable<any> {
    if (this.isDev) {
      return this.http.post(this.serviceUrl+'transportationForm/approveTransportationRequests', data);
    } else {
      return this.http.post(this.approveTransportationFormAPI,data);
    }  
  } 
}
