import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';

@Component({
  selector: 'app-dragndrop',
  templateUrl: './dragndrop.component.html',
  styleUrls: ['./dragndrop.component.scss'],

})


export class DragndropComponent {
    source = ['Test_1', 'Test_2', 'Test_3', 'Test_4', 'Test_5'];

    form = ['Transaction_ID'];

    //functions[:string] = [];
    //var functions:string[];

    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        //this.functions.push('Add new function');
        console.log(this.form);
      }
    }
}
