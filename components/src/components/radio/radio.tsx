// import {
//   Component,
//   Element,
//   // Method,
//   // Event,
//   // EventEmitter,
//   // State,
//   // Method,
//   Prop,
//   State,
//   // Watch,
//   // Element,
//   // State,
//   // Watch,
// } from '@stencil/core';
// import _ from 'lodash';

// // import _ from 'lodash';

// /*
//  * TODO
//  * [ ] add option for images
//  * */


// @Component({
//   tag: 'eng-radio',
//   styleUrl: 'radio.scss'
// })
// export class EngCheckbox {

//   @Element() el: HTMLElement;
//   @Prop() options = [];
//   @State() checkboxes;
//   element;


//   componentDidLoad() {
//     console.log('this.options', this.options);
//     this.checkboxes = this.el.querySelectorAll('eng-checkbox');
//     this.addClickListener();
//   }

//   addClickListener() {
//     _.each(this.checkboxes, (checkbox, i) => {
//       checkbox.setAttribute("engId", 'checkbox' + (i + 1));
//       checkbox.setIcons('far fa-dot-circle', 'far fa-circle');
//       checkbox.addEventListener("click", () => {
//         _.each(this.checkboxes, (check) => {
//           if (checkbox.getAttribute('engId') !== check.getAttribute('engId')) {
//             check.setValue(false)
//           }
//         })
//       });
//     });
//   }

//   render() {
//     return (
//       <div>
//         {this.options.map(option =>
//           <div class="pb-2"><eng-checkbox label={option} /></div>
//         )}
//       </div>
//     )
//   }

// }
