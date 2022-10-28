import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { RestClientService } from 'src/app/shared/services/rest-client.service';
import { environment } from 'src/environments/environment';
import { environment as env } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class IaPage1Service {
  private getIAPage1Details = env.serviceUrl.getIAPage1Details;
  private postIAPage1Details = env.serviceUrl.postIAPage1Details;
  private getFamilyMembersDetails = env.serviceUrl.getFamilyMembersDetails;
  private postFamilyMembersDetails = env.serviceUrl.postFamilyMembersDetails;
  private updateFamilyMembersDetails =
    env.serviceUrl.updateFamilyMembersDetails;
  private deleteFamilyMembersDetails =
    env.serviceUrl.deleteFamilyMembersDetails;
  constructor(private restcs: RestClientService, private http: HttpClient) {}
  private commonUrl = environment.localUrl;
  private isDev = isDevMode();

  public getIAPage1(vetID: number): Observable<any> {
    if (this.isDev) {
      return this.restcs.get(
        this.commonUrl + 'initialAssessment/page-1/' + vetID
      );
    } else {
      return this.restcs.get(this.getIAPage1Details + vetID);
    }
  }

  public getIAPage1FD(vetID: number): Observable<any> {
    if (this.isDev) {
      return this.restcs.get(
        this.commonUrl + 'initialAssessment/page-1FD/' + vetID
      );
    } else {
      return this.restcs.get(this.getFamilyMembersDetails + vetID);
    }
  }

  public initialTreatmentGoalsPage1(data: any): Observable<any> {
    if (this.isDev) {
      return this.http.post(this.commonUrl + 'initialAssessment/page-1', data);
    } else {
      return this.http.post(this.postIAPage1Details, data);
    }
  }

  //delete family member
  public deleteMember(vetId: number, memId: number): Observable<any> {
    if (this.isDev) {
      console.log('service data');
      return this.http.delete(
        this.commonUrl + 'initialAssessment/page-1FD/' + vetId + '/' + memId
      );
    } else {
      return this.http.delete(
        this.deleteFamilyMembersDetails + vetId + '/' + memId
      );
    }
  }

  // add member
  public addMember(data: any): Observable<any> {
    if (this.isDev) {
      console.log('service data', data);
      return this.http.post(
        this.commonUrl + 'initialAssessment/page-1FD/',
        data
      );
    } else {
      return this.http.post(this.postFamilyMembersDetails, data);
    }
  }

  public updateMemberDetails(
    vetId: number,
    memId: number,
    data: any
  ): Observable<any> {
    if (this.isDev) {
      return this.http.put(
        this.commonUrl + 'initialAssessment/page-1FD/' + vetId + '/' + memId,
        data
      );
    } else {
      return this.http.put(
        this.updateFamilyMembersDetails + vetId + '/' + memId,
        data
      );
    }
  }
}
