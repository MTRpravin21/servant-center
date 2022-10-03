import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
// import { env } from 'process';
import { Observable } from 'rxjs';
import { RestClientService } from 'src/app/shared/services/rest-client.service';
import { environment } from 'src/environments/environment';
import { environment as env } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IaPage3Service {
  constructor(private restcs: RestClientService, private http: HttpClient) { }
  private commonUrl = environment.localUrl;
  private getIAPage3Details = env.serviceUrl.getIAPage3Details;
  private postIAPag34Details = env.serviceUrl.postIAPag34Details;
  private isDev = isDevMode();


  public getIAPage3(vetId: number): Observable<any> {
    if (this.isDev){
    return this.restcs.get(this.commonUrl+'initialAssessment/page-3/'+vetId);
    } else{
      //env api goes here
      return this.restcs.get(this.getIAPage3Details+vetId);
    }
}

  public initialTreatmentGoalsPage3(data: any): Observable<any> {
    if (this.isDev) {
      return this.restcs.post(
        this.commonUrl + 'initialAssessment/page-3',
        data
      );
    } else {
      //env api goes here
      return this.restcs.post(this.postIAPag34Details, data);
    }
  }
}
