import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, FormArray, FormControl} from '@angular/forms';

// interface
import { BackendComponent } from '../backend/backend.component';

@Component({
  selector: 'app-cdk-form-drag',
  templateUrl: './cdk-form-drag.component.html',
  styleUrls: ['./cdk-form-drag.component.scss'],
})

export class CdkFormDragComponent implements OnInit{
  source: string[];
  mapped: string[];

  // Source Form Properties
  sourceMap: {
    Form: FormGroup,
    FormItemGroup: FormArray,
    FormItems: FormArray,
    FormItemValues: string[]
  };

  // Mapping Form Properties
  mappedMap: {
    Form: FormGroup,
    FormItemGroup: FormArray,
    FormItems: FormArray,
    FormItemValues: string[],
    FormItemNotes: string[],
    FormItemAlias: string[],
    FormItemWhere: string[],
    FormItemCase: string[],
  }

  constructor(private formBuilder: FormBuilder, public backend: BackendComponent) {
    this.source = new Array;
    this.mapped = ['Transaction_ID']

    // Source Form
    this.sourceMap = {
      Form: new FormGroup({}),
      FormItemGroup: new FormArray([]),
      FormItems: new FormArray([]),
      FormItemValues: []
    };

    // Mapped Form
    this.mappedMap = {
      Form: new FormGroup({}),
      FormItemGroup: new FormArray([]),
      FormItems: new FormArray([]),
      FormItemValues: [],
      FormItemNotes: [],
      FormItemAlias: [],
      FormItemWhere: [],
      FormItemCase: []
    };
  }

  async ngOnInit(): Promise<void> {
    this.source = await this.getSourceItems().then(result => {return result})

    for (let i = 0; i < this.source.length; i++) {
      this.sourceMap['FormItemGroup'].push(
        this.formBuilder.group({
          name: this.formBuilder.control(this.source[i]),
          note: this.formBuilder.control(''),
          alias: this.formBuilder.control(''),
          where: this.formBuilder.control(''),
          case: this.formBuilder.control('')
        })
      )
    }

    this.sourceMap['Form'] = this.formBuilder.group({
      title: 'SOURCE',
      items: this.sourceMap['FormItemGroup']
    })

    this.sourceMap['FormItems'] = (<FormArray>this.sourceMap['Form'].get('items'));
    this.sourceMap['FormItemValues'] = this.getControls('source', 'name');


    for (let i = 0; i < this.mapped.length; i++) {
      this.mappedMap['FormItemGroup'].push(
        this.formBuilder.group({
          name: this.formBuilder.control(this.mapped[i]),
          note: this.formBuilder.control(''),
          alias: this.formBuilder.control(''),
          where: this.formBuilder.control(''),
          case: this.formBuilder.control('')
        })
      )
    }

    this.mappedMap['Form'] = this.formBuilder.group({
      title: 'MAPPED',
      items: this.mappedMap['FormItemGroup']
    })

    this.mappedMap['FormItems'] = (<FormArray>this.mappedMap['Form'].get('items'));
    this.mappedMap['FormItemValues'] = this.getControls('mapped', 'name');
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      if (event.container.id  == 'source') {
        moveItemInArray((<FormArray>this.sourceMap['Form'].get('items')).controls, event.previousIndex, event.currentIndex);
        moveItemInArray((<FormArray>this.sourceMap['Form'].get('items')).value, event.previousIndex, event.currentIndex);
      } else if (event.container.id == 'mapped') {
        moveItemInArray((<FormArray>this.mappedMap['Form'].get('items')).controls, event.previousIndex, event.currentIndex);
        moveItemInArray((<FormArray>this.mappedMap['Form'].get('items')).value, event.previousIndex, event.currentIndex);
      }
    } else {
      if (event.previousContainer.id == 'source') {
        transferArrayItem(
          (<FormArray>this.sourceMap['Form'].get('items')).controls,
          (<FormArray>this.mappedMap['Form'].get('items')).controls,
          event.previousIndex,
          event.currentIndex,
        )
        transferArrayItem(
          (<FormArray>this.sourceMap['Form'].get('items')).value,
          (<FormArray>this.mappedMap['Form'].get('items')).value,
          event.previousIndex,
          event.currentIndex,
        )
      } else {
        transferArrayItem(
          (<FormArray>this.mappedMap['Form'].get('items')).controls,
          (<FormArray>this.sourceMap['Form'].get('items')).controls,
          event.previousIndex,
          event.currentIndex,
        )
        transferArrayItem(
          (<FormArray>this.mappedMap['Form'].get('items')).value,
          (<FormArray>this.sourceMap['Form'].get('items')).value,
          event.previousIndex,
          event.currentIndex,
        )
      }
    };

    // Update index of labels
    this.updateConrols();
  }

  updateForms() {
    this.mappedMap['Form'] = this.formBuilder.group({
      title: 'MAPPED',
      items: this.mappedMap['FormItemGroup']
    })
  }

  updateConrols() {
    this.sourceMap['FormItemValues'] = this.getControls('source', 'name');
    this.mappedMap['FormItemValues'] = this.getControls('mapped', 'name');
    this.mappedMap['FormItemNotes'] = this.getControls('mapped', 'note');
    this.mappedMap['FormItemAlias'] = this.getControls('mapped', 'alias');
    this.mappedMap['FormItemWhere'] = this.getControls('mapped', 'where');
    this.mappedMap['FormItemCase'] = this.getControls('mapped', 'case');
  }

  getControls(formName: string, controlName: string) {
    let currentForm = new FormGroup({});
    let currentFormArray = new FormArray([]);
    let controlValues = new Array;

    if (formName == 'source') {
      currentForm = this.sourceMap['Form'];
    } 
    else if (formName == 'mapped') {
      currentForm = this.mappedMap['Form'];
    }

    currentFormArray = (<FormArray>currentForm.get('items'))

    for (var i = 0; i < currentFormArray.controls.length; i++) {
      controlValues.push((<FormControl>currentFormArray.controls[i].get(controlName)).value)
    };

    return controlValues;

  }

  saveState(currentItemName: string, index: number){
    let inputs = ['alias', 'where', 'case'];
    let newIndex = this.mappedMap['FormItemValues'].indexOf(currentItemName)
    
    for (var i = 0; i < inputs.length; i++) {
      let inputValue : string = (<HTMLInputElement>document.getElementById(`${currentItemName}_${inputs[i]}`)).value;

      (<FormControl>(<FormArray>this.mappedMap['Form'].get('items')).controls[newIndex].get(inputs[i])).setValue(inputValue);

      this.updateConrols();
      this.updateForms();
    };
  }

  async getSourceItems() {
    let sourceItems = await this.backend.fetchSourceItems()
    return sourceItems
  }

}
