import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})

@Injectable()
export class BackendComponent{

  constructor(public http: HttpClient) {}

  public async fetchSourceItems() {
    /*
    let res = {'results': [
      {'source_items': 'Test_1'}, 
      {'source_items': 'Test_2'}, 
      {'source_items': 'Test_3'}, 
      {'source_items': 'Test_4'}, 
      {'source_items': 'Test_5'}
    ]}*/
    let sourceItems: string[] = [];

    let endPagination = false;
    let nextEndpoint: string = 'http://127.0.0.1:8000/sourceItems';

    while (endPagination === false) {
      let data = await this.getValueFromObservable(nextEndpoint).then((data: any)=> {return data});
      for (var i = 0; i < data['results'].length; i++) {
        sourceItems.push(data['results'][i]['source_items'])
      }
      if (data['next']){
        nextEndpoint = data['next'] 
      }
      else {
        endPagination = true
      }
    }

    return sourceItems
  }
  
  getValueFromObservable(endPoint: string) {
    return new Promise(resolve=>{
        this.http.get(endPoint).pipe(
           take(1) //useful if you need the data once and don't want to manually cancel the subscription again
         )
         .subscribe(
            (data:any) => {
                //console.log(data);
                resolve(data);
         })
    })
  }

}
