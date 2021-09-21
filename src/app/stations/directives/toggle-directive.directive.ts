import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appToggle]'
})
export class ToggleDirective implements OnInit {

    constructor(private el: ElementRef) { }

    ngOnInit(): void {

        const toggleEl = this.el.nativeElement.querySelector('.toggle');

        toggleEl.addEventListener('click', function() {
            
            if(toggleEl.className.indexOf('right') !== -1) toggleEl.className = 'toggle'
            else toggleEl.className = 'toggle right'
        });

    }
}