// import {
//   Component,
//   Event,
//   EventEmitter,
//   Method,
//   Prop,
//   Element, State, Watch,
// } from '@stencil/core';
// import _ from 'lodash';
// import {InputLabelPosition, InputType} from "../../types/theme";

// /*
// * TODO:
// *  [ ] large and small sizes
// *  [X] Icon left and right side
// *  [ ] Disable
// *  [ ] Auto sizing
// *  [ ] Clear icon on left (for search and select)
// *  [X] Textarea
// *  [ ] Fix auto grow on textarea
// *  [ ] Help Text
// *  [ ] More validation -password - number -url -tel
// *  [ ] Mask -tel -custom - date -time -color
// *  [ ] Add different component for -checkbox -radio -range -switch -file
// * */

// @Component({
//   tag: 'eng-input',
//   styleUrl: 'input.scss'
// })
// export class EngInput {

//   @Prop({ context: 'config' }) config: any;
//   @Element() element: HTMLElement;
//   @Prop() value: any;
//   @Prop() bind: any;
//   @Prop() name: string;
//   @Prop() placeholder: string;
//   @Prop() context: string = 'primary';
//   @Prop() label: string;
//   @Prop() labelId: string = 'eng-input-' + _.random(0, 100000000);
//   @Prop() labelPosition: InputLabelPosition = 'float';
//   @Prop() type: InputType = 'text';
//   @Prop() adapter: object;
//   @Prop() bindSelector = '[eng-bind]';
//   @Prop() errorSelector = '[eng-error]';
//   @Prop() manualMsg: boolean = false;
//   @Prop() disabled: boolean = false;
//   @Prop() errorMsg: string = '';
//   @Prop() successMsg: string = '';
//   @Prop() iconRight: string = '';
//   @Prop() iconLeft: string = '';
//   @Prop() revealInput: boolean = false;
//   @Prop() autoExpand: boolean = true;
//   @Prop() onBlur: (e?) => any;
//   @Prop() onFocus: (e?) => any;
//   @Prop() preventIconClickDefault: boolean = false;
//   @Event({eventName: 'engInputBlur'}) onInputBlur: EventEmitter;
//   @Event({eventName: 'engInputFocus'}) onInputFocus: EventEmitter;
//   @Event({eventName: 'engIconClick'}) onIconClick: EventEmitter;
//   @Event({eventName: 'engInputClick'}) onInputClick: EventEmitter;
//   @Event() change: EventEmitter;
//   @State() private _value: any;
//   @State() _revealInput: boolean = false;
//   @State() private defaultLabelStyle ={
//     pos: null,
//     fontSize: null,
//     color: null,
//     bottomColor: null,
//   };

//   componentDidLoad() {
//     this.init();
//     this.watchTrueValue();
//     if (this.revealInput) {
//       this._revealInput = this.revealInput;
//     }
//   }

//   @Method('setValue')
//   setValue(value = '') {
//     this._value = value;
//   }

//   @Method('getName')
//   getName() {
//     return this.name;
//   }

//   @Method('getValue')
//   getValue() {
//     return this._value;
//   }

//   @Method('clear')
//   clear() {
//     this._value = '';
//   }

//   @Watch('value')
//   watchTrueValue() {
//     if (this.value !== undefined) {
//       this._value = this.value;
//     }
//   }

//   @Watch('_value')
//   watchValue() {
//     this.setBottomBorderColor(true);
//     if (!_.isUndefined(this._value) || _.isString(this._value) && this._value && this._value.length < 1) {
//       this.floatLabel();
//     }
//     this.updateBinding(this._value);
//     this.change.emit(this._value);
//   }

//   init() {
//     switch (this.labelPosition) {
//       case 'float':
//         if (!_.isEmpty(this.placeholder)) {
//           this.floatLabel(true);
//         }
//         break;
//     }
//   }

//   updateBinding(value) {
//     if (this.bind && this.name) {
//       this.bind[this.name] = value;
//     }
//   }

//   updateValue(event) {
//     if (event && event.target && !_.isEmpty(event.target.value)) {
//       this._value = event.target.value;
//       this.change.emit(this._value);
//     } else {
//       this._value = '';
//       this.change.emit(this._value);
//     }
//   }

//   floatLabel(open = true) {
//     const labelElement = this.element.querySelector('label');
//     const inputElement: any = this.element.querySelector('input, textarea');
//     if (open) {
//       if (_.isNull(this.defaultLabelStyle.pos)) {
//         this.defaultLabelStyle.pos = labelElement.style.top;
//       }
//       if (_.isNull(this.defaultLabelStyle.fontSize)) {
//         if (!labelElement.style.fontSize) {
//           labelElement.style.fontSize = '14px';
//         }
//         this.defaultLabelStyle.fontSize = labelElement.style.fontSize;
//       }
//       if (_.isNull(this.defaultLabelStyle.color)) {
//         this.defaultLabelStyle.color = labelElement.style.color;
//       }
//       if (_.isNull(this.defaultLabelStyle.bottomColor)) {
//         this.defaultLabelStyle.bottomColor = labelElement.style.borderBottomColor;
//       }
//       const fontSize = parseInt(this.defaultLabelStyle.fontSize) * .9 + 'px';
//       labelElement.style.top = '-20px';
//       labelElement.style.fontSize = fontSize;
//       labelElement.style.color = `var(--${this.context})`;
//       inputElement.style.borderBottomWidth = `2px`;
//       inputElement.style.marginBottom = `-1px`;
//       this.setBottomBorderColor(true);
//     } else if (_.isEmpty(this._value) && _.isEmpty(this.placeholder)) {
//       labelElement.style.top = this.defaultLabelStyle.pos;
//       labelElement.style.fontSize = this.defaultLabelStyle.fontSize;
//     }

//     if (!open) {
//       labelElement.style.color = this.defaultLabelStyle.color;
//       // inputElement.style.borderBottomColor = this.defaultLabelStyle.bottomColor;
//       inputElement.style.borderBottomWidth = `1px`;
//       inputElement.style.marginBottom = `0`;
//       this.setBottomBorderColor();
//       this.handleBlur(null);
//     }
//   }

//   handleBlur(event) {
//     if (!this._value && this.revealInput) {
//       const inputElement: any = this.element.querySelector('input, textarea');
//       inputElement.classList.add('animated', 'fadeOut');
//       setTimeout(() => {
//         inputElement.classList.remove('animated', 'fadeOut');
//       this._revealInput = true;
//       }, 500);
//     }
//     this.onInputBlur.emit({
//       value: this._value,
//       id: this.labelId,
//       event: event
//     });
//     if (this.onBlur) {
//       this.onBlur({
//         value: this._value,
//         id: this.labelId,
//         event: event
//       });
//     }
//   }

//   handleFocus(event) {
//     this.onInputFocus.emit({
//       value: this._value,
//       id: this.labelId,
//       event: event
//     });
//     if (this.onFocus) {
//       this.onFocus({
//         value: this._value,
//         id: this.labelId,
//         event: event
//       });
//     }
//   }

//   handleIconClick(event, side) {
//     this.onIconClick.emit({
//       value: this._value,
//       id: this.labelId,
//       event,
//       side
//     });
//     this._revealInput = false;
//     if(this.preventIconClickDefault) return;
//     setTimeout(() => {
//       const inputElement: any = this.element.querySelector('input, textarea');
//       inputElement.focus();
//     }, 300);
//   }

//   setBottomBorderColor(focused = false) {
//     const color = this.getValidColor(focused);
//     const inputElement: any = this.element.querySelector('input, textarea');
//     inputElement.style.borderBottomColor = color;
//   }

//   buildInputClasses() {
//     let classes = (this.iconLeft && this.iconLeft.length) ||
//     (this.iconRight && this.iconRight.length) ? 'eng-input-icon' : '';
//     if (this.iconLeft && this.iconLeft.length) {
//       classes += ' eng-icon-input-left';
//     }
//     if (this.iconRight && this.iconRight.length) {
//       classes += ' eng-icon-input-right';
//     }
//     if (this.iconLeft && this.iconLeft.length &&
//       this.iconRight && this.iconRight.length) {
//       classes += ' eng-icon-left-and-right';
//     }
//     return classes;
//   }

//   defaultInputRender() {
//     return (
//       <input
//         type={this.type}
//         class={`form-control ${this.revealInput ? 'animated fadeIn' : ''}`}
//         onInput={e => this.updateValue(e)}
//         onBlur={e => this.handleBlur(e)}
//         onFocus={e => this.handleFocus(e)}
//         disabled={this.disabled}
//         onClick={e => this.onInputClick.emit({event: e, value: this._value})}
//         value={this._value}
//       />
//     );
//   }

//   labelInputRender() {
//     return [
//       <label htmlFor={this.labelId}>{this.label}</label>,
//       <input
//         type={this.type}
//         id={this.labelId}
//         class={`form-control ${this.revealInput ? 'animated fadeIn' : ''}`}
//         onInput={e => this.updateValue(e)}
//         placeholder={this.placeholder}
//         onBlur={e => this.handleBlur(e)}
//         onFocus={e => this.handleFocus(e)}
//         disabled={this.disabled}
//         onClick={e => this.onInputClick.emit({event: e, value: this._value})}
//         value={this._value}
//       />
//     ];
//   }

//   textRender() {
//     switch (this.labelPosition) {
//       case 'float':
//         return this.floatTextRender();
//       case 'above':
//         return this.labelInputRender();
//       default:
//         return this.defaultInputRender();
//     }
//   }

//   validate(requireMsg = true) {
//     if ((requireMsg && !this.errorMsg) || _.isEmpty(this._value)) return null;
//     switch (this.type) {
//       case 'email':
//         const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//         return re.test(String(this._value).toLowerCase());
//     }

//   }

//   getValidColor(focused = false) {
//     switch (this.validate()) {
//       case true:
//         return `var(--success)`;
//       case false:
//         return `var(--danger)`;
//       default:
//         if (focused) {
//           return `var(--${this.context})`;
//         }
//         return this.defaultLabelStyle.bottomColor;
//     }
//   }

//   getMessage() {
//     if (_.isEmpty(this._value) && !this.manualMsg) return null;
//     if (!this.validate() && this.errorMsg) {
//       return <div class="text-danger">{this.errorMsg}</div>;
//     } else if (this.successMsg) {
//       return <div class="text-success">{this.successMsg}</div>;
//     }
//   }

//   floatTextRender() {
//     return (
//       <div class={`eng-float-text-input ${this.errorMsg || this.successMsg ? 'msg-padding' : ''}`}>
//         <input
//           type={this.type}
//           id={this.labelId}
//           onInput={e => this.updateValue(e)}
//           class={`form-control eng-input-exclude ${this.revealInput ? 'animated fadeIn' : ''}`}
//           onFocus={e => {this.floatLabel(); this.handleFocus(e)}}
//           onBlur={e => {this.floatLabel(false); this.handleBlur(e)}}
//           placeholder={this.placeholder}
//           value={this._value}
//           onClick={e => this.onInputClick.emit({event: e, value: this._value})}
//           disabled={this.disabled}
//         />
//         <label htmlFor={this.labelId}>{this.label}</label>
//         {this.getMessage()}
//       </div>
//     );
//   }

//   floatTextareaRender() {
//     const textareaElement = this.element.querySelector('textarea');
//     const handleTextAdjust = () => {
//       if (!this.autoExpand) return;
//       textareaElement.style.height = '1px';
//       textareaElement.style.height = textareaElement.scrollHeight + 'px';
//     };
//     return (
//       <div class={`eng-float-text-input ${this.errorMsg || this.successMsg ? 'msg-padding' : ''}`}>
//         <textarea
//           id={this.labelId}
//           onInput={e => this.updateValue(e)}
//           onKeyUp={() => handleTextAdjust()}
//           class={`form-control eng-input-exclude md-textarea ${this.revealInput ? 'animated fadeIn' : ''}`}
//           onFocus={e => {this.floatLabel(); this.handleFocus(e)}}
//           onBlur={e => {this.floatLabel(false); this.handleBlur(e)}}
//           placeholder={this.placeholder}
//           value={this._value}
//           onClick={e => this.onInputClick.emit({event: e, value: this._value})}
//           disabled={this.disabled}
//         />
//         <label htmlFor={this.labelId}>{this.label}</label>
//         {this.getMessage()}
//       </div>
//     );
//   }

//   render() {
//     switch (this.type) {
//       // case 'text' || 'number':
//       //   return this.textRender();
//       case 'textarea':
//         return [
//           <div
//             class={this.buildInputClasses()}
//           >
//             {!this._revealInput ? this.floatTextareaRender() : null}
//             {this.iconLeft && this.iconLeft.length ? <eng-icon
//               class="eng-icon-left"
//               onClick={(e) => this.handleIconClick(e, 'left')}
//               name={this.iconLeft}
//             /> : null}
//             {this.iconRight && this.iconRight.length ? <eng-icon
//               class="eng-icon-right"
//               onClick={(e) => this.handleIconClick(e, 'right')}
//               name={this.iconRight}
//             /> : null}
//           </div>
//         ];
//       default:
//         return [
//           <div
//             class={this.buildInputClasses()}
//           >
//             {!this._revealInput ? this.textRender() : null}
//             {this.iconLeft && this.iconLeft.length ? <eng-icon
//               class="eng-icon-left"
//               onClick={(e) => this.handleIconClick(e, 'left')}
//               name={this.iconLeft}
//             /> : null}
//             {this.iconRight && this.iconRight.length ? <eng-icon
//               class="eng-icon-right"
//               onClick={(e) => this.handleIconClick(e, 'right')}
//               name={this.iconRight}
//             /> : null}
//           </div>
//         ];
//     }
//   }
// }
