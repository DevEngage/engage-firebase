// import {
//   Component,
//   Event,
//   EventEmitter,
//   Method,
//   Prop,
//   Element,
//   Listen, State, Watch,
// } from '@stencil/core';
// import _ from 'lodash';

// /*
// * TODO:
// * [ ] Add modal search results
// * */

// @Component({
//   tag: 'eng-search',
//   styleUrl: 'search.scss'
// })
// export class EngSearch {

//   @Prop({ context: 'config' }) config: any;
//   @Element() element: HTMLElement;
//   @Prop() value: any;
//   @Prop() bind: any;
//   @Prop() name: string;
//   @Prop() placeholder: string = 'Search...';
//   @Prop() context: string = 'primary';
//   @Prop() label: string;
//   @Prop() labelId: string = 'eng-search-' + _.random(0, 100000000);
//   @Prop() labelPosition: 'above' | 'inline' | 'float' | '' = 'float';
//   @Prop() type: 'text' | 'email' | 'number' |
//     'time' | 'tel' | 'date' | 'url' | 'week' |
//     'month' | 'datetime-local' | 'range' | 'radio' | 'checkbox' | 'color' | 'password' = 'text';
//   @Prop() adapter: object;
//   @Prop() bindSelector = '[eng-bind]';
//   @Prop() errorSelector = '[eng-error]';
//   @Prop() manualMsg: boolean = false;
//   @Prop() revealInput: boolean = false;
//   @Prop() iconLeft: string = '';
//   @Prop() iconRight: string = 'fas fa-search';
//   @Prop() errorMsg: string = '';
//   @Prop() successMsg: string = '';
//   @Event({eventName: 'engOnSearchChange'}) onSearchChange: EventEmitter;
//   @State() _iconOnly = false;
//   @State() _value: string;
//   private searchElement;
//   defaultIcon = 'fas fa-search';

//   componentDidLoad() {
//     this.searchElement = this.element.querySelector('eng-input');
//     this.onWatch();
//   }

//   @Watch('value')
//   onWatch() {
//     this._value = this.value;
//   }

//   @Listen('onChange')
//   onChange(event) {
//     this.onSearchChange.emit(event.detail);
//   }

//   @Method('setValue')
//   setValue(value = '') {
//     this.searchElement.setValue(value);
//   }

//   @Method('getName')
//   getName() {
//     return this.searchElement.getName();
//   }

//   @Method('getValue')
//   getValue() {
//     return this.searchElement.getValue();
//   }

//   @Method('clear')
//   clear() {
//     this.searchElement.clear();
//   }

//   @Listen('engOnInputBlur')
//   onInputBlur() {
//     // if (event && event.detail && event.detail.id === this.labelId && !event.detail.value && this.iconOnly) {
//     //   this._iconOnly = true;
//     // }
//   }

//   handleIconClick() {
//     if (this.defaultIcon === this.iconRight && this._value) {
//       this.clear();
//     }
//   }

//   renderInput() {
//     return (
//       <div class="eng-search-container">
//         <eng-input
//           label={this.label}
//           labelId={this.labelId}
//           labelPosition={this.labelPosition}
//           name={this.name}
//           value={this._value}
//           placeholder={this.placeholder}
//           type={this.type}
//           bind={this.bind}
//           iconLeft={this.iconLeft}
//           iconRight={this.defaultIcon === this.iconRight ?
//             !this._value ? this.iconRight : 'fas fa-times'
//             : this.iconRight
//           }
//           revealInput={this.revealInput}
//           context={this.context}
//           adapter={this.adapter}
//           onChange={e => {
//             if (e && e.detail !== undefined) {
//               this._value = e.detail;
//             }
//           }}
//           onEngIconClick={() => this.handleIconClick()}
//         />
//       </div>
//     );
//   }

//   render() {
//     return this.renderInput();
//   }
// }
