import {Component} from '@angular/core';

@Component({
  selector: 'fountain-template-content',
  template: require('./template.html')
})

export class TemplateComponent {
   public fileImg : string;
   public fileRight : string;
   public fileWrong : string;
   constructor() {
     this.fileImg = './images/file.png';
     this.fileRight = './images/file_tick.png';
     this.fileWrong = './images/file_wrong.png';
   }
}
