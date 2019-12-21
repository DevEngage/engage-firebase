import {Component, Element, Event, EventEmitter, Method, Prop, State} from '@stencil/core';
import {Size} from "../../types/theme";


/*
* @Requires
*  - Progress Component
*  - Spinner Component
*  - Modal Component
* */

@Component({
  tag: 'eng-loading',
  styleUrl: 'loading.scss',
})
export class EngageSocialLogin {

  @Element() element: HTMLElement;
  @Prop({ context: 'config' }) config: any;
  @Prop() context: string = 'clear';
  @Prop() text: string = 'Loading...';
  @Prop() adapter: any;
  @Prop() type: 'spinner' | 'bar' = 'bar';
  @Prop() modal: boolean = false;
  @Prop() size: Size = 'md';
  @Prop() current: number = 0;
  @Prop() min: number = 0;
  @Prop() max: number = 100;
  @Prop() mode: 'indeterminate' | 'determinate' | 'regular' = 'indeterminate';
  @Event({eventName: 'engOnStart'}) onStart: EventEmitter;
  @Event({eventName: 'engOnUpdate'}) onUpdate: EventEmitter;
  @Event({eventName: 'engOnFinish'}) onFinish: EventEmitter;
  @State() isVisible: boolean = false;
  private modalElement;

  componentDidLoad() {
    if (!this.modal) {
      this.isVisible = true;
    }
    if (this.modal) {
      this.modalElement = this.element.querySelector('eng-modal');
    }
  }

  @Method('toggle')
  toggle() {
    if (this.modalElement) {
      this.modalElement.toggle();
    }
    this.isVisible = !this.isVisible;
  }

  @Method('show')
  show() {
    if (this.modalElement) {
      this.modalElement.show();
    }
    this.isVisible = true;
  }

  @Method('hide')
  hide() {
    if (this.modalElement) {
      this.modalElement.hide();
    }
    this.isVisible = false;
  }

  renderSpinner() {
    return (<eng-spinner mode={this.mode} context={this.context} size={this.size} />);
  }

  renderBar() {
    return (<eng-progress mode={this.mode} min={this.min} max={this.max} current={this.current} context={this.context} />);
  }

  renderType() {
    if (!this.isVisible) return(null);
    switch(this.type) {
      case 'spinner':
        return this.renderSpinner();
      default:
        return this.renderBar();
    }
  }

  render() {
    switch(this.modal) {
      case true:
        return (
          <eng-modal ignoreBackdropClick={true} size="small">
            <div slot="body">
              <div class={this.type === 'bar' ? 'pt-4 mt-4' : 'pt-3 mt-3'}>
                <div class="text-center">{this.renderType()}</div>
                {this.text ? <h4 class="text-center">{this.text}</h4> : null }
              </div>
              <slot />
            </div>
          </eng-modal>
        );
      default:
        return this.renderType();
    }
  }
}
