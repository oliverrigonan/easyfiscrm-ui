import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { FileAttachmentModel } from './attachment.model';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient) { }

  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };
  public defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;

  public documentTypeSubject = new Subject<ObservableArray>();
  public documentTypeObservable = this.documentTypeSubject.asObservable();

  public listAttachmenttSubject = new Subject<ObservableArray>();
  public listAttachmentObservable = this.listAttachmenttSubject.asObservable();
  public addAttachmentSubject = new Subject<string[]>();
  public addAttachmentObservable = this.addAttachmentSubject.asObservable();
  public saveAttachmentSubject = new Subject<string[]>();
  public saveAttachmentObservable = this.saveAttachmentSubject.asObservable();
  public deleteAttachmentSubject = new Subject<string[]>();
  public deleteAttachmentObservable = this.deleteAttachmentSubject.asObservable();


  public listDocumentType(): void {
    let groupObservableArray = new ObservableArray();
    this.documentTypeSubject.next(groupObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/attachment/list/doctype", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            groupObservableArray.push({ DocumentType: results[i].DocumentType });
          }
        }
        this.documentTypeSubject.next(groupObservableArray);
      }
    );
  }

  public listAttachment(sPId: number): void {
    let listAttachmentObservableArray = new ObservableArray();
    this.listAttachmenttSubject.next(listAttachmentObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/attachment/list/" + sPId, this.options).subscribe(
      response => {
        let results = response;
        if (results["length"] > 0) {
          for (let i = 0; i <= results["length"] - 1; i++) {
            listAttachmentObservableArray.push({
              Id: results[i].Id,
              SPId: results[i].SPId,
              Attachment: results[i].Attachment,
              AttachmentURL: results[i].AttachmentURL,
              AttachmentType: results[i].AttachmentType,
              Particulars: results[i].Particulars
            });
          }
        }
        this.listAttachmenttSubject.next(listAttachmentObservableArray);
      }
    );
  }

  public saveAttachment(objAttachment: FileAttachmentModel): void {
    console.log("Support: ", objAttachment.SPId);
    if (objAttachment.Id == 0) {
      this.httpClient.post(this.defaultAPIURLHost + "/api/crm/trn/support/attachment/add/", JSON.stringify(objAttachment), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveAttachmentSubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveAttachmentSubject.next(errorResults);
        }
      )
    } else {
      this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/support/attachment/update/" + objAttachment.Id, JSON.stringify(objAttachment), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveAttachmentSubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveAttachmentSubject.next(errorResults);
        }
      )
    }
  }

  public addAttachment(objAttachment: FileAttachmentModel): void {
    console.log("Support: ", objAttachment.SPId);
    this.httpClient.post(this.defaultAPIURLHost + "/api/crm/trn/support/attachment/add/", JSON.stringify(objAttachment), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", response.toString()];
        this.addAttachmentSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.addAttachmentSubject.next(errorResults);
      }
    )
  }

  public deleteAttachment(id: number): void {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/trn/support/attachment/delete/" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteAttachmentSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteAttachmentSubject.next(errorResults);
      }
    )
  }

  public uploadFileSubject = new Subject<string[]>();
  public uploadFileObservable = this.uploadFileSubject.asObservable();

  public uploadFile(file: File, fileType: string, fileName: string): void {

    let options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };

    var formData: FormData = new FormData();
    formData.append(fileType, file, fileName);

    console.log(formData);

    this.httpClient.post(this.defaultAPIURLHost + "/api/crm/trn/support/attachment/uploadFile/", formData, options).subscribe(
      response => {
        let responseResults: string[] = ["success", response.toString()];
        this.uploadFileSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.uploadFileSubject.next(errorResults);
      }
    );
  }
}
