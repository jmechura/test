import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mss-upload-input',
  templateUrl: './upload-input.component.html',
  styleUrls: ['./upload-input.component.scss']
})
export class UploadInputComponent {

  /**
   * sets accepted file types to see more visit: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
   * @type {string}
   */
  @Input() acceptFiles: string;
  /**
   * show label before input
   * @type {string]
   */
  @Input() label: string;
  /**
   * switch between looks of input
   * @type {string}
   */
  @Input() type: 'button' | 'input' = 'button';
  /**
   * output chosen file
   * @type {EventEmitter<File>}
   */
  @Output() file = new EventEmitter<File>();

  fileName: string;
  id = Math.random().toString().substr(2);

  onFileChange(event: Event): void {
    const inputEvent = <HTMLInputElement>event.target;
    if (this.isInputInvalid(inputEvent.files[0])) {
      return;
    }
    this.fileName = inputEvent.files[0].name;
    this.file.emit(inputEvent.files[0]);
  }

  isInputInvalid(file: File): boolean {
    // TODO: add validation of files
    return false;
  }
}
