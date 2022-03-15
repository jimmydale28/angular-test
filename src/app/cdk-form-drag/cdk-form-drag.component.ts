import { Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, FormArray, FormControl} from '@angular/forms';


@Component({
  selector: 'app-cdk-form-drag',
  templateUrl: './cdk-form-drag.component.html',
  styleUrls: ['./cdk-form-drag.component.scss']
})


export class CdkFormDragComponent{
  source = ['Test_1', 'Test_2', 'Test_3', 'Test_4', 'Test_5'];
  mapped = ['Transaction_ID'];

  // Forms
  sourceForm: FormGroup;
  mappedForm: FormGroup;

  // Source Form Properties
  sourceFormItemGroup: FormArray;
  sourceFormItems: FormArray;
  sourceFormItemValues: string[];

  // Source Form Properties
  mappedFormItemGroup: FormArray;
  mappedFormItems: FormArray;
  mappedFormItemValues: string[];
  mappedFormItemNotes: string[];

  constructor(private formBuilder: FormBuilder) {

    // Source Form
    this.sourceFormItemGroup = new FormArray([]);
    for (let i = 0; i < this.source.length; i++) {
      this.sourceFormItemGroup.push(this.formBuilder.group({
        name: this.formBuilder.control(this.source[i]),
        note: this.formBuilder.control('')
      }))
    }

    this.sourceForm = this.formBuilder.group({
      title: ['title'],
      items: this.sourceFormItemGroup
    })

    this.sourceFormItems = (<FormArray>this.sourceForm.get('items'));
    this.sourceFormItemValues = this.getControlNames('source');


    // Mapped Form
    this.mappedFormItemGroup = new FormArray([]);
    for (let i = 0; i < this.mapped.length; i++) {
      this.mappedFormItemGroup.push(this.formBuilder.group({
        name: this.formBuilder.control(this.mapped[i]),
        note: this.formBuilder.control('')
      }))
    }

    this.mappedForm = this.formBuilder.group({
      title: ['title'],
      items: this.mappedFormItemGroup
    })

    this.mappedFormItems = (<FormArray>this.mappedForm.get('items'));
    this.mappedFormItemValues = this.getControlNames('mapped');
    this.mappedFormItemNotes = this.getControlNotes('mapped');
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      if (event.container.id  == 'source') {
        moveItemInArray((<FormArray>this.sourceForm.get('items')).controls, event.previousIndex, event.currentIndex);
        moveItemInArray((<FormArray>this.sourceForm.get('items')).value, event.previousIndex, event.currentIndex);
      } else if (event.container.id == 'mapped') {
        moveItemInArray((<FormArray>this.mappedForm.get('items')).controls, event.previousIndex, event.currentIndex);
        moveItemInArray((<FormArray>this.mappedForm.get('items')).value, event.previousIndex, event.currentIndex);
      }
    } else {
      if (event.previousContainer.id == 'source') {
        transferArrayItem(
          (<FormArray>this.sourceForm.get('items')).controls,
          (<FormArray>this.mappedForm.get('items')).controls,
          event.previousIndex,
          event.currentIndex,
        )
        transferArrayItem(
          (<FormArray>this.sourceForm.get('items')).value,
          (<FormArray>this.mappedForm.get('items')).value,
          event.previousIndex,
          event.currentIndex,
        )
      } else {
        transferArrayItem(
          (<FormArray>this.mappedForm.get('items')).controls,
          (<FormArray>this.sourceForm.get('items')).controls,
          event.previousIndex,
          event.currentIndex,
        )
        transferArrayItem(
          (<FormArray>this.mappedForm.get('items')).value,
          (<FormArray>this.sourceForm.get('items')).value,
          event.previousIndex,
          event.currentIndex,
        )
      }
    };

    // Update index of labels
    this.sourceFormItemValues = this.getControlNames('source');
    this.mappedFormItemValues = this.getControlNames('mapped');
    this.mappedFormItemNotes = this.getControlNotes('mapped');
  }

  getControlNames(formName: string){
    let names = new Array;
    if (formName == 'source'){
      for (var i = 0; i < (<FormArray>this.sourceForm.get('items')).controls.length; i++){
        names.push((<FormControl>(<FormArray>this.sourceForm.get('items')).controls[i].get('name')).value)
      }
    } else if (formName == 'mapped') {
      for (var i = 0; i < (<FormArray>this.mappedForm.get('items')).controls.length; i++){
        names.push((<FormControl>(<FormArray>this.mappedForm.get('items')).controls[i].get('name')).value)
      }
    }
    return names

  }

  getControlNotes(formName: string) {
    let notes = new Array;
    if (formName == 'mapped') {
      for (var i = 0; i < (<FormArray>this.mappedForm.get('items')).controls.length; i++){
        notes.push((<FormControl>(<FormArray>this.mappedForm.get('items')).controls[i].get('note')).value)
      }
    }

    return notes
  }

  logger() {
    let mappedFormItems = <FormArray>this.mappedForm.get('items')
    for (var i = 0; i < mappedFormItems.length; i++) {
      let currentItemName = mappedFormItems.controls[i].value.name;
      let str : string = (<HTMLInputElement>document.getElementById(currentItemName)).value;
      console.log(str)
    }
  }

  addNote(currentItemName: string, index: number){
    let inputValue : string = (<HTMLInputElement>document.getElementById(currentItemName)).value;
    (<FormControl>(<FormArray>this.mappedForm.get('items')).controls[index].get('note')).setValue(inputValue);
  }

  //activeNote: string;
  activeNote: any;

  enter(i: number) {
    this.activeNote = (<FormControl>(<FormArray>this.sourceForm.get('items')).controls[i].get('note')).value

  }

}
