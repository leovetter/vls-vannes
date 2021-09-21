import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightInput]'
})
export class HighlightInputDirective implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    
    const input = this.el.nativeElement.querySelector('input');
    const label = this.el.nativeElement.parentNode.querySelector(`.search-name-label`);

    input.addEventListener('focus', () => {

      this.el.nativeElement.className = 'input-block focus';
      label.style.visibility = 'visible';
    });

    input.addEventListener('focusout', () => {

      this.el.nativeElement.className = 'input-block';
      if(input.value.length === 0) label.style.visibility = 'hidden';
    });
    
  }

}
