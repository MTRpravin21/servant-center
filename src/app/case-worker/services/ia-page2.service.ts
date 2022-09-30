import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { RestClientService } from 'src/app/shared/services/rest-client.service';
import { environment } from 'src/environments/environment';
import { environment as env } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class IaPage2Service {
  constructor(private restcs: RestClientService, private http: HttpClient) { }
  private commonUrl = environment.localUrl;
  private isDev = isDevMode();
  private getIAPage2Details = env.serviceUrl.getIAPage2Details;
  private postIAPage2Details = env.serviceUrl.postIAPage2Details;
  public getIAPage2(vetID:number): Observable<any> {
    if (this.isDev){
    return this.restcs.get(this.commonUrl+'initialAssessment/page-2/'+ vetID);
    } else{
      return this.restcs.get(this.getIAPage2Details+vetID);
    }
  }

  public initialTreatmentGoalsPage2(data: any): Observable<any> {
    if (this.isDev) {
      return this.restcs.post(
        this.commonUrl + 'initialAssessment/page-2',
        data
      );
    } else {
      return this.restcs.post(this.postIAPage2Details, data);
    }
  }
}
