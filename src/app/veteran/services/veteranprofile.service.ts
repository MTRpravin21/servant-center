import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { RestClientService } from 'src/app/shared/services/rest-client.service';
import { environment} from 'src/environments/environment.prod';
import { environment as env } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VeteranprofileService {
  constructor(private restcs: RestClientService,private http:HttpClient) {}

  private isDev = isDevMode();
  private veteranProfileAPI = environment.serviceUrl.veteranProfileGetUser;
  private saveTransportationFormAPI = environment.serviceUrl.saveTransportationForm;

  private commonUrl=env.localUrl;
  private veteranProfileUpdateAPI=environment.serviceUrl.veteranProfileUpdateUser;
  private profileImgUpdateAPI=environment.serviceUrl.updateProfileImage;
  private profileGetImgAPI=environment.serviceUrl.getProfileImage;

  public getProfileData(
    endPoint: number
  ): Observable<any> {
    if (this.isDev) {  
      return this.restcs.get(this.commonUrl+'userProfile/getUserDetails/'+endPoint);
    } else {
      return this.restcs.get(this.veteranProfileAPI + endPoint);
    }
  }

  public updateProfile(endpoint:number,payload={}):Observable<any>{
    if(this.isDev){
      return this.http.put(this.commonUrl+'userProfile/updateUserDetails/'+endpoint,payload);
    } else {
      return this.http.put(this.veteranProfileUpdateAPI+endpoint,payload);
    }
  }
  //Transportation start
  public saveTransportationForm(data:any): Observable<any> {
    if (this.isDev) {
      return this.http.post(this.commonUrl+'transportationForm/saveTransportationRequest/', data);
    } else {
      return this.http.post(this.saveTransportationFormAPI, data);
    }  
  } 
  //Transportation End

  profileimageUpload(imageForm: FormData,endPoint:number): Observable<any> {
    if (this.isDev) {
      return this.http.post(this.commonUrl+'uploadImage/'+endPoint, imageForm);
    } else {
      return this.http.post(this.profileImgUpdateAPI+endPoint, imageForm);
    }  
   }

   getProfileImage(imageName:string): Observable<any> {
    if (this.isDev) {
      return this.restcs.get(this.commonUrl+'profileImage/'+imageName);
    } else {
      return this.restcs.get(this.profileGetImgAPI+imageName);
    }  
   }
}
