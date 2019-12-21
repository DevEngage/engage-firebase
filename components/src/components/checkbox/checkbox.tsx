// import {
//   Component, Element, Method,
//   Prop, State, Watch,
// } from '@stencil/core';
// import _ from 'lodash';

// /*
//  * TODO
//  * [ ] add option for images
//  * */


// @Component({
//   tag: 'eng-checkbox',
//   styleUrl: 'checkbox.scss'
// })
// export class EngCheckbox {

//   @Element() el: HTMLElement;
//   @Prop() label: string;
//   @Prop() engId: string = 'eng-checkbox-' + _.random(0, 100000000);
//   @Prop() name: string;
//   @Prop() bind: any;
//   @Prop() value: boolean = false;
//   @Prop() onLabel: string;
//   @Prop() offLabel: string;
//   @Prop() onIcon: string = 'far fa-check-square';
//   @Prop() offIcon: string = 'far fa-square';
//   @Prop() labelPosition: 'left' | 'right' = 'right';
//   @Prop() animationSpeed: number = 500;
//   @Prop() animated: boolean = false;
//   @Prop() fontSize: string = '1em';
//   @Prop() toggleSize: number = 1;
//   @Prop() onChange: (event) => any;
//   @Prop() type: 'default' | 'toggle' | 'radio' = 'default';
//   @State() _icon = 'far fa-square';
//   @State() private _value: boolean;
//   @State() _onIcon;
//   @State() _offIcon;
//   @State() _label;
//   @State() _onLabel;
//   @State() _offLabel;
//   element;
//   toggleButton;
//   toggleButtonBody;

//   componentDidLoad() {
//     this.element = this.el.querySelector('#eng-checkbox');
//     this._value = this.value;
//     this._onIcon = this.onIcon;
//     this._offIcon = this.offIcon;
//     if (this.onLabel && this.offLabel) {
//       this._onLabel = this.onLabel;
//       this._offLabel = this.offLabel;
//     } else if (this.label) {
//       this._onLabel = this.label;
//       this._offLabel = this.label;
//     }
//     if (this.type === 'toggle') {
//       this.toggleButton = this.el.querySelector('.slider');
//       this.toggleButtonBody = this.el.querySelector('.slider-body');
//       this.element.style.setProperty("--toggle-size", this.toggleSize * 10 + 'px');
//     }
//   }

//   // addAnimated() {
//   //   if (this.animated) this.element.classList.add('animated');
//   // }

//   @Method('setValue')
//   setValue(value = false) {
//     this._value = value;
//   }

//   @Method('setIcons')
//   setIcons(onIcon, offIcon) {
//     this._onIcon = onIcon;
//     this._offIcon = offIcon;
//   }

//   @Method('getName')
//   getName() {
//     return this.name;
//   }

//   @Method('getValue')
//   getValue() {
//     return this._value || false;
//   }

//   @Method('clear')
//   clear() {
//     this._value = false;
//   }

//   @Watch('value')
//   watchTrueValue() {
//     if (this.value !== undefined) {
//       this._value = this.value;
//     }
//     this.updateBinding(this._value);
//   }

//   @Watch('_value')
//   watch_value() {
//     this.updateBinding(this._value);
//     if (this.onChange) {
//       this.onChange({
//         id: this.engId,
//         value: this._value
//       });
//     }
//   }

//   updateBinding(value) {
//     if (this.bind && this.name) {
//       this.bind[this.name] = value;
//     }
//   }

//   setToggle() {
//     if (this._value) {
//       this.toggleButton.classList.add('slider-active');
//       this.toggleButtonBody.classList.add('slider-body-active');
//     } else {
//       this.toggleButton.classList.remove('slider-active');
//       this.toggleButtonBody.classList.remove('slider-body-active');
//     }
//   }

//   toggleState() {
//     this._value = !this._value;
//     if (this.type === 'toggle') this.setToggle();
//   }

//   renderIcon() {
//     if (this.type === 'default' || this.type === 'radio') {
//       return <eng-icon id="eng-checkbox" name={this._value ? this._onIcon : this._offIcon} size={this.fontSize}/>
//   } else if (this.type === 'toggle') {
//      return (
//      <span class="toggle-container">
//        <span class="toggle">
//        <span class="slider-body">
//          <span class="slider"/>
//        </span>
//       </span>
//      </span>
//      )
//    }
//   }

//   render() {
//     return (
//       <div id="eng-checkbox" class={this.type === 'toggle' ? "checkbox-wrapper" : null} onClick={() => this.toggleState()}>
//         {this.labelPosition === 'right' ? this.renderIcon() : null}
//           <span
//             style={{fontSize: this.fontSize}}
//             class={`${this.labelPosition === 'right' ? 'pl-3' : 'pr-3'}`}
//           >{this._value ? this._onLabel : this._offLabel}</span>
//         {this.labelPosition === 'left' ? this.renderIcon() : null}
//   </div>
//     )
//   }
// }
