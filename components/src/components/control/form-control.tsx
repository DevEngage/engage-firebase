import {
  Component,
  Event,
  EventEmitter,
  // State,
  Method,
  Prop,
  Element, Watch,
} from '@stencil/core';
import _ from 'lodash';


/*
* TODO:
*  [ ] Test with firebase adapter
*  [ ] Test reset
*  [ ] Populate fields from value
*  [ ] Handle error and different types
*  [ ] File upload
* */

@Component({
  tag: 'eng-form',
  styleUrl: 'form-control.scss'
})
export class EngFormControl {

  @Prop({ context: 'config' }) config: any;
  @Element() element: HTMLElement;
  @Prop() value: object;
  @Prop() adapter: any;
  @Prop() type: 'save' | 'update' | 'set' | 'custom' = 'save';
  @Prop() refresh = false;
  @Prop() path = ''; // path to send data
  @Prop() engId: string | number = null; // on the object
  @Prop() handleUpload: boolean = true;
  @Prop() uploadSelector: string = 'eng-upload';
  @Prop() inputSelector: string = `
    input[type=text], 
    input[type=email], 
    input[type=number], 
    input[type=time], 
    input[type=tel], 
    input[type=date], 
    input[type=url], 
    input[type=week], 
    input[type=month], 
    input[type=datetime-local], 
    input[type=range], 
    input[type=radio] checked, 
    input[type=checkbox] checked, 
    input[type=color]
  `;
  @Prop() bindSelector = '[eng-bind]';
  @Prop() propertyNameAttribute = 'name';
  @Prop() errorSelector = '[eng-error]';
  @Prop() allowUndefined: boolean = false;
  @Event() onSubmit: EventEmitter;
  private engInputSelector: string = `eng-input, eng-checkbox, eng-select`;
  private values: object = {};

  componentDidLoad() {
    this.watchValue();
  }

  getForm() {
    return this.element.querySelector('form');
  }

  getFormSubmitButton(): HTMLButtonElement {
    return this.element.querySelector('.eng-form-submit-button');
  }

  getInputs(): any {
    return this.element.querySelectorAll(this.inputSelector);
  }

  getEngInputs(): any {
    return this.element.querySelectorAll(this.engInputSelector);
  }


  getEngUploads(): any {
    return this.element.querySelectorAll(this.uploadSelector);
  }

  bindValues() {
    this.getForm().querySelectorAll(this.bindSelector);
  }

  @Watch('value')
  watchValue() {
    this.setValue();
  }

  @Method('setValue')
  setValue(value = this.value) {
    if (_.isObject(value)) {
      this.values = {
        ...this.values,
        ...value,
      }

    }
    for (let valuesKey in this.values) {
      const val = this.values[valuesKey];
      this.getInputs().forEach((item: HTMLInputElement) => {
        if (!item.classList.contains('eng-input-exclude')) {
          if (item.getAttribute(this.propertyNameAttribute) === valuesKey) {
            item.value = val;
          }
        }
      });
      this.getEngInputs().forEach((item: HTMLEngInputElement) => {
        if (item.getName() === valuesKey) {
          item.setValue(val);
        }
      });
    }
  }

  @Method('submit')
  submit() {
    const element = this.getFormSubmitButton();
    element.click();
    // this.onSubmit.emit(this.value);
  }

  @Method('reset')
  reset() {
    const element = this.getForm();
    element.reset();
    // this.onSubmit.emit(this.value);
  }

  @Method('getValues')
  getValues(): object {
    this.getInputs().forEach((item: HTMLInputElement) => {
      if (!item.classList.contains('eng-input-exclude') && !item.classList.contains('eng-exclude')) {
        this.values[item.getAttribute(this.propertyNameAttribute)] = item.value || (this.allowUndefined ? undefined : '');
      }
    });
    this.getEngInputs().forEach((item: HTMLEngInputElement) => {
      this.values[item.getName()] = item.getValue() || (this.allowUndefined ? undefined : '');
    });
    return this.values;
  }

  handleFileUpload(adapter = this.adapter) {
    const promises = [];
    let files: any[] = [];
    if (!this.handleUpload) return;
    this.getEngUploads().forEach((item: HTMLEngUploadElement) => {
      if (!item.classList.contains('eng-exclude')) {
        item.setAdapter(adapter);
        let itemPromise = item.start();
        itemPromise.then(_files => files = files.concat(_files));
        promises.push(itemPromise);
      }
    });
    return Promise.all(promises).then(() => files);
  }

  private async _onSubmit(event) {
    event.preventDefault();
    let files = [];
    this.getValues();
    console.log(this.values);
    if (this.path) {
      this.adapter.path = this.path;
    }
    if (this.adapter && this.type && this.adapter[this.type] && this.type !== 'custom') {
      const newValue = await this.adapter[this.type](this.values);
      files = await this.handleFileUpload(newValue);
      this.setValue(newValue);
    }
    this.onSubmit.emit({
      type: this.type,
      values: this.values,
      id: this.engId,
      files: files
    });
  }

  render() {
    return (
      <form onSubmit={(e) => this._onSubmit(e)}>
        <slot />
        <button type="submit" class="d-none eng-form-submit-button" />
      </form>
    )
  }
}
