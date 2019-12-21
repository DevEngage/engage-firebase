
// declare let document;

// /* TODO:
//     [ ] Get inputs in a class group
//     [ ] Set inputs in a class group
//     [ ] handle file uploads
// */
// export default class EngageForm {
//     element;
//     value: object;
//     adapter;
//     type: 'save' | 'update' | 'set' | 'custom' = 'save';
//     refresh = false;
//     path = ''; // path to send data
//     engId: string | number = null; // on the object
//     handleUpload: boolean = true;
//     uploadSelector: string = 'eng-upload';
//     inputSelector: string = `
//         input[type=text], 
//         input[type=email], 
//         input[type=number], 
//         input[type=time], 
//         input[type=tel], 
//         input[type=date], 
//         input[type=url], 
//         input[type=week], 
//         input[type=month], 
//         input[type=datetime-local], 
//         input[type=range], 
//         input[type=radio] checked, 
//         input[type=checkbox] checked, 
//         input[type=color]
//     `;
//     bindSelector = '[eng-bind]';
//     propertyNameAttribute = 'name';
//     errorSelector = '[eng-error]';
//     allowUndefined: boolean = false;
//     private engInputSelector: string = `eng-input, eng-checkbox, eng-select`;
//     private values: object = {};

//     constructor(
//         formGroup = 'form',
//         value?,
//         options?
//     ) {
//         const { adapter, type, path, engId, handleUpload, uploadSelector } = options;
//         this.adapter = adapter;
//         this.type = type;
//         this.path = path;
//         this.engId = engId;
//         this.handleUpload = handleUpload;
//         this.uploadSelector = uploadSelector;
//         this.element = document.querySelectorAll(formGroup);
//     }

//     getValuesArray() {
//         if (!this.element) {
//             throw 'No Elements Found!';
//         }
//         const inputs = this.element.querySelectorAll('input');
//         return inputs.reduce((item, list) => item ? list.push(item.value) : list, []);
//     }

//     setValues(values) {
        
//     }


//     getForm() {
//         return this.element.querySelector('form');
//     }

//     getFormSubmitButton(query = '.eon-form-submit-button'): HTMLButtonElement {
//         return this.element.querySelector(query);
//     }

//     getInputs(): any {
//         return this.element.querySelectorAll(this.inputSelector);
//     }

//     getEngInputs(): any {
//         return this.element.querySelectorAll(this.engInputSelector);
//     }


//     getEngUploads(): any {
//         return this.element.querySelectorAll(this.uploadSelector);
//     }

//     bindValues() {
//         this.getForm().querySelectorAll(this.bindSelector);
//     }

//     setValue(value = this.value) {
//         if (typeof value === 'object') {
//             this.values = {
//                 ...this.values,
//                 ...value,
//             }

//         }
//         for (let valuesKey in this.values) {
//             const val = this.values[valuesKey];
//             this.getInputs().forEach((item: HTMLInputElement) => {
//                 if (!item.classList.contains('eng-input-exclude')) {
//                     if (item.getAttribute(this.propertyNameAttribute) === valuesKey) {
//                         item.value = val;
//                     }
//                 }
//             });
//             this.getEngInputs().forEach((item: HTMLEngInputElement) => {
//                 if (item.getName() === valuesKey) {
//                     item.setValue(val);
//                 }
//             });
//         }
//     }

//     @Method('submit')
//     submit() {
//         const element = this.getFormSubmitButton();
//         element.click();
//         // this.onSubmit.emit(this.value);
//     }

//     @Method('reset')
//     reset() {
//         const element = this.getForm();
//         element.reset();
//         // this.onSubmit.emit(this.value);
//     }

//     @Method('getValues')
//     getValues(): object {
//         this.getInputs().forEach((item: HTMLInputElement) => {
//             if (!item.classList.contains('eng-input-exclude') && !item.classList.contains('eng-exclude')) {
//                 this.values[item.getAttribute(this.propertyNameAttribute)] = item.value || (this.allowUndefined ? undefined : '');
//             }
//         });
//         this.getEngInputs().forEach((item: HTMLEngInputElement) => {
//             this.values[item.getName()] = item.getValue() || (this.allowUndefined ? undefined : '');
//         });
//         return this.values;
//     }

//     onSubmit() {

//     }

//     handleFileUpload(adapter = this.adapter) {
//         const promises = [];
//         let files: any[] = [];
//         if (!this.handleUpload) return;
//         this.getEngUploads().forEach((item: HTMLEngUploadElement) => {
//             if (!item.classList.contains('eng-exclude')) {
//                 item.setAdapter(adapter);
//                 let itemPromise = item.start();
//                 itemPromise.then(_files => files = files.concat(_files));
//                 promises.push(itemPromise);
//             }
//         });
//         return Promise.all(promises).then(() => files);
//     }

//     private async _onSubmit(event) {
//         event.preventDefault();
//         let files = [];
//         this.getValues();
//         console.log(this.values);
//         if (this.path) {
//             this.adapter.path = this.path;
//         }
//         if (this.adapter && this.type && this.adapter[this.type] && this.type !== 'custom') {
//             const newValue = await this.adapter[this.type](this.values);
//             files = await this.handleFileUpload(newValue);
//             this.setValue(newValue);
//         }
//         this.onSubmit.emit({
//             type: this.type,
//             values: this.values,
//             id: this.engId,
//             files: files
//         });
//     }

// }