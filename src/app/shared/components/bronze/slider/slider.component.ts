import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as Hammer from 'hammerjs';


@Component({
  selector: 'mss-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input() value: number;
  @Output() valueChange = new EventEmitter<number>();

  @Input() min = 0;
  @Input() max = 100;

  @ViewChild('sliderButton') sliderButton: ElementRef;
  @ViewChild('sliderContainer') sliderContainer: ElementRef;
  @ViewChild('sliderBase') sliderBase: ElementRef;

  isMouseDown = false;

  private sliderButtonSize = 22;
  private buttonOffset = 0;

  get position(): number {
    return (this.value - this.min) / (this.max - this.min) * 100;
  }

  set position(newPos: number) {
    this.valueChange.emit(newPos);
  }

  get buttonPosition(): string {
    return `calc(${this.position}% - ${this.sliderButtonSize / 2}px)`;
  }

  get filledBarWidth(): string {
    return `${this.position}%`;
  }

  onPanEnd(): void {
    this.isMouseDown = false;
    this.buttonOffset = this.sliderButton.nativeElement.offsetLeft;
  }

  onButtonMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.isMouseDown = true;
  }

  onSliderMouseDown(event: MouseEvent): void {
    const padding = +window.getComputedStyle(this.sliderContainer.nativeElement, null).paddingLeft.split('px')[0];
    let pos = (event.offsetX - padding) / (this.sliderBase.nativeElement.scrollWidth / 100);
    pos = pos < 0 ? 0 : pos > 100 ? 100 : pos;
    this.position = Math.floor(((this.max - this.min) / 100) * pos) + this.min;
  }

  ngOnInit(): void {
    this.sliderButtonSize = this.sliderButton.nativeElement.scrollWidth;
    const width = this.sliderBase.nativeElement.scrollWidth;
    this.buttonOffset = this.sliderButton.nativeElement.offsetLeft;

    const hammerButton = new Hammer(this.sliderButton.nativeElement);
    hammerButton.get('pan').set({direction: Hammer.DIRECTION_HORIZONTAL});

    hammerButton.on('panmove', (event: HammerInput) => {
      let pos = (event.deltaX + this.buttonOffset + (this.sliderButtonSize / 2)) / (width / 100);
      pos = pos < 0 ? 0 : pos > 100 ? 100 : pos;
      this.position = Math.floor(((this.max - this.min) / 100) * pos) + this.min;
    });

    hammerButton.on('panend', () => this.onPanEnd());
  }
}
