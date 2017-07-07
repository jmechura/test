import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonComponent } from './button/button.component';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';
import { UploadInputComponent } from './upload-input/upload-input.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CircularLoaderComponent } from './circular-loader/circular-loader.component';
import { SliderComponent } from './slider/slider.component';
import { ModalWindowComponent } from './modal-window/modal-window.component';
import { ToggleComponent } from './toggle/toggle.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioButtonGroupComponent } from './radio-button-group/radio-button-group.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AvatarComponent,
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    SelectComponent,
    UploadInputComponent,
    ProgressBarComponent,
    CircularLoaderComponent,
    SliderComponent,
    ModalWindowComponent,
    ToggleComponent,
    CheckboxComponent,
    RadioButtonGroupComponent,
    ToolbarComponent,
    DatePickerComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule
  ],
  exports: [
    AvatarComponent,
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    SelectComponent,
    UploadInputComponent,
    ProgressBarComponent,
    CircularLoaderComponent,
    SliderComponent,
    ModalWindowComponent,
    ToggleComponent,
    CheckboxComponent,
    RadioButtonGroupComponent,
    ToolbarComponent,
    DatePickerComponent,
    ListComponent
  ],
  providers: [],
})
export class BronzeComponentsModule {
}
