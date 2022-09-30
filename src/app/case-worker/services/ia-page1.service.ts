import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { RestClientService } from 'src/app/shared/services/rest-client.service';
import { environment } from 'src/environments/environment';
import { environment as env} from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IaPage1Service {
  private getIAPage1Details = env.serviceUrl.getIAPage1Details;
  private postIAPage1Details = env.serviceUrl.postIAPage1Details;
  constructor(private restcs: RestClientService,private http:HttpClient) {}
  private commonUrl=environment.localUrl;
  private isDev = isDevMode();

  public getIAPage1(vetID:number): Observable<any> {
    if (this.isDev){
    return this.restcs.get(this.commonUrl+'initialAssessment/page-1/'+ vetID);
    } else{
      return this.restcs.get(this.getIAPage1Details+vetID);
    }
  }
    

  public initialTreatmentGoalsPage1(data:any): Observable<any> {
    if (this.isDev){
    return this.http.post(this.commonUrl+'initialAssessment/page-1',data);
    } else{
      return this.http.post(this.postIAPage1Details,data);
    }
}

}
