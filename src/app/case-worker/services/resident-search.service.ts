import { HttpClient } from '@angular/common/http';
import { Injectable,isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { RestClientService } from 'src/app/shared/services/rest-client.service';
import { environment } from 'src/environments/environment';
import { environment as env} from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ResidentSearchService {
  private isDev = isDevMode();
  constructor(private http: HttpClient, private restcs:RestClientService) {}
  private commonUrl=environment.localUrl;
  private getCwNicknameDetails = env.serviceUrl.getCwNicknameDetails;
  private getCwUserNameDetails = env.serviceUrl.getCwUserNameDetails;
  private postAddNewVeteran = env.serviceUrl.addNewVeteranRS;
  private residentSearchAPI= env.serviceUrl.getResidentSearchData;

  getResidentSearchData() {
    if(this.isDev){
    return this.restcs.get(this.commonUrl+'residentSearch/getAll');
    } else {
      return this.restcs.get(this.residentSearchAPI);
    }

  }

  public getCwNickName(): Observable<any>{
    if(this.isDev){
    return this.restcs.get(this.commonUrl+ 'getCaseWorkerNickname');
  } else {
    return this.restcs.get(this.getCwNicknameDetails);
  }
}

public getCwUsername(): Observable<any>{
   if(this.isDev){
    return this.restcs.get(this.commonUrl+ 'getWebpartyUsername');
   } else {
    return this.restcs.get(this.getCwUserNameDetails);
  }
}

public addnewVeteran(data: any): Observable<any> {
  if (this.isDev) {
    return this.restcs.post(this.commonUrl + 'addNewVeteran/', data);
  } else {
    return this.restcs.post(this.postAddNewVeteran, data);
  }
}
}
