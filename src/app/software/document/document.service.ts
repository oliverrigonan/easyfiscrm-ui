import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { DocumentModel } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

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
  
  public listDocumentSubject = new Subject<ObservableArray>();
  public listDocumentObservable = this.listDocumentSubject.asObservable();
  public saveDocumentSubject = new Subject<string[]>();
  public saveDocumentObservable = this.saveDocumentSubject.asObservable();
  public deleteDocumentSubject = new Subject<string[]>();
  public deleteDocumentObservable = this.deleteDocumentSubject.asObservable();

  public listDocumentType(): void {
    let groupObservableArray = new ObservableArray();
    this.documentTypeSubject.next(groupObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/mst/document/list/doctype", this.options).subscribe(
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

  public listDocument(document: string): void {
    let listDocumentObservableArray = new ObservableArray();
    this.listDocumentSubject.next(listDocumentObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/mst/document/list/" + document, this.options).subscribe(
      response => {
        let results = response;
        if (results["length"] > 0) {
          for (let i = 0; i <= results["length"] - 1; i++) {
            listDocumentObservableArray.push({
              Id: results[i].Id,
              DocumentName: results[i].DocumentName,
              DocumentType: results[i].DocumentType,
              DocumentURL: results[i].DocumentURL,
              DocumentGroup: results[i].DocumentGroup,
              DateUploaded: results[i].DateUploaded,
              Particulars: results[i].Particulars,
              CreatedByUserId: results[i].CreatedByUserId,
              CreatedByUser: results[i].CreatedByUser,
              CreatedDateTime: results[i].CreatedDateTime,
              UpdatedByUserId: results[i].UpdatedByUserId,
              UpdatedByUser: results[i].UpdatedByUser,
              UpdatedDateTime: results[i].UpdatedDateTime,
            });
          }
        }
        console.log(listDocumentObservableArray);
        this.listDocumentSubject.next(listDocumentObservableArray);
      }
    );
  }

  public saveDocument(objDocument: DocumentModel, objGroup: string): void {
    if (objDocument.Id == 0) {
      this.httpClient.post(this.defaultAPIURLHost + "/api/crm/mst/document/add/" + objGroup, JSON.stringify(objDocument), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveDocumentSubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveDocumentSubject.next(errorResults);
        }
      )
    } else {
      this.httpClient.put(this.defaultAPIURLHost + "/api/crm/mst/document/update/" + objDocument.Id, JSON.stringify(objDocument), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveDocumentSubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveDocumentSubject.next(errorResults);
        }
      )
    }
  }

  public deleteDocument(id: number): void {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/mst/document/delete/" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteDocumentSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteDocumentSubject.next(errorResults);
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
