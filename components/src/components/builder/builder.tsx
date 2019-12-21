// import {
//   Component,
//   Event,
//   EventEmitter,
//   Method,
//   Prop,
//   Element,
// } from '@stencil/core';
// import {EngageIInput, EngageIUpload} from "../../types/components";
// // import _ from 'lodash';


// /*
// * TODO:
// * */

// @Component({
//   tag: 'eng-form-builder',
//   styleUrl: 'builder.scss'
// })
// export class EngFormBuilder {

//   @Prop({ context: 'config' }) config: any;
//   @Element() element: HTMLElement;
//   @Prop() values: (EngageIInput | EngageIUpload)[] = [];
//   @Prop() adapter: any;
//   @Prop() type: 'save' | 'update' | 'set' | 'custom' = 'save';
//   @Prop() refresh = false;
//   @Prop() path = ''; // path to send data
//   @Prop() engId: string | number = null; // on the object
//   @Prop() handleUpload: boolean = true;
//   @Prop() uploadSelector: string = 'eng-upload';
//   @Prop() inputSelector: string = `
//     input[type=text], 
//     input[type=email], 
//     input[type=number], 
//     input[type=time], 
//     input[type=tel], 
//     input[type=date], 
//     input[type=url], 
//     input[type=week], 
//     input[type=month], 
//     input[type=datetime-local], 
//     input[type=range], 
//     input[type=radio] checked, 
//     input[type=checkbox] checked, 
//     input[type=color]
//   `;
//   @Prop() bindSelector = '[eng-bind]';
//   @Prop() propertyNameAttribute = 'name';
//   @Prop() errorSelector = '[eng-error]';
//   @Event() onSubmit: EventEmitter;
//   formElement;

//   componentDidLoad() {
//     this.formElement = this.element.querySelector('eng-form');
//   }

//   @Method('setValue')
//   setValue(inputId, value) {
//     if (!inputId) return;
//     this.formElement.querySelector(inputId).setValue(value);
//   }

//   @Method('submit')
//   submit() {
//     this.formElement.submit();
//   }

//   @Method('reset')
//   reset() {
//     this.formElement.reset();
//   }

//   @Method('getValues')
//   getValues(): object {
//     return this.formElement.getValues();
//   }

//   render() {
//     return (
//       <eng-form
//         adapter={this.adapter}
//         type={this.type}
//         refresh={this.refresh}
//         path={this.path}
//         engId={this.engId}
//         handleUpload={this.handleUpload}
//         uploadSelector={this.uploadSelector}
//         inputSelector={this.inputSelector}
//         bindSelector={this.bindSelector}
//         propertyNameAttribute={this.propertyNameAttribute}
//         errorSelector={this.errorSelector}
//       >

//         {this.values.map((input: any) =>
//           input.type === 'upload' || input.type === 'image' ?
//             <eng-input
//               name={input.name}
//               context={input.context}
//               value={input.value}
//               bind={input.bind}
//               placeholder={input.placeholder}
//               label={input.label}
//               labelId={input.labelId}
//               labelPosition={input.labelPosition}
//               type={input.type}
//               manualMsg={input.manualMsg}
//               errorMsg={input.errorMsg}
//               successMsg={input.successMsg}
//               iconRight={input.iconRight}
//               iconLeft={input.iconLeft}
//               revealInput={input.revealInput}
//             /> :
//             <eng-upload
//               name={input.name}
//               context={input.context}
//               value={input.value}
//               placeholder={input.placeholder}
//               engId={input.engId}
//               type={input.type}
//               adapter={input.adapter}
//               method={input.method}
//               preview={input.preview}
//               multiple={input.multiple}
//               mainImage={input.mainImage}
//               uploadOnSelect={input.uploadOnSelect}
//               errorMsg={input.errorMsg}
//               successMsg={input.successMsg}
//               bindSelector={input.bindSelector}
//               errorSelector={input.errorSelector}
//               accept={input.accept}
//             />

//         )}
//       </eng-form>
//     )
//   }
// }
