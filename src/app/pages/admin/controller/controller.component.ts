import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Controller } from '../../../models/controller.interace';
import { CourseService } from '../../../services/course.service';
import { ControllerService } from './../../../services/controller.service';
import { MessageServicePrimeNG } from './../../../services/message.service';
import { UtilsService } from './../../../services/utils.service';
import { Course } from 'app/models/course.interface';

@Component({
  selector: 'aka-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit {

  @ViewChild('inputFocus') focusIn: ElementRef;
  button = 'Adicionar';
  controllerForm: FormGroup;
  controller: Controller;
  controllers$: Observable<Controller[]>;
  courses$: Observable<Course[]>;

  colleges;

  constructor(
    private _controllerFormBuilder: FormBuilder,
    private _controllerService: ControllerService,
    private _courseService: CourseService,
    public _messageService: MessageServicePrimeNG,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.courses$ = this._courseService.get();
    this.controllers$ = this._controllerService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();

    this.colleges = this._utilsService.getColleges('unif');
    this.colleges = this.colleges.items;
  }

  buildForm() {
    this.controllerForm = this._controllerFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, [
        Validators.required,
        Validators.pattern('[a-zA-ZÀ-ú ]*'),
        Validators.maxLength(20)
      ]],
      course: [null, Validators.required]
    });
  }

  searchCollege(search) {
    this.colleges = this._utilsService.getColleges(search);
    this.colleges = this.colleges.items;
  }

  save() {
    if (!this.controllerForm.get('uid').value) {
      this._controllerService.post(this.controllerForm.value);
    } else {
      this._controllerService.put(this.controller.uid, this.controllerForm.value);
    }
    this.controllerForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

  edit(obj) {
    this.controllerForm.patchValue({ uid: obj.uid, name: obj.name, course: obj.course });
    this.controller = obj;
    this.button = 'Atualizar';
    this.focusIn.nativeElement.focus();
  }

  remove() {
    this._controllerService.delete(this.controller.uid);
    this.controllerForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
    this._messageService.close();
  }

  compareCourse(obj1, obj2) {
    return obj1 && obj2 ? (obj1.uid === obj2.uid) : obj1 === obj2;
  }

  confirmRemove(obj) {
    this.controller = obj;
    this._messageService.messageConfirm('remove', true, 'warn', '', `Deseja realmente excluir '${obj.name}' ?`);
  }

}
