import {Component, Element, Prop, Event, EventEmitter
  // , Method, Watch
} from '@stencil/core';
// import _ from 'lodash';
import {Size} from "../../types/theme";


/* TODO:
*  [ ] Added color changing to indeterminate
*  [ ] Add Crazy mode as a boolean
*  [ ] Add determinate' | 'regular' | 'graph modes (https://materializecss.com/preloader.html)
* */

@Component({
  tag: 'eng-spinner',
  styleUrl: 'spinner.scss'
})
export class EngageSpinner {

  @Prop({ context: 'config' }) config: any;
  @Element() el: HTMLElement;
  // @Prop() current: number = 50;
  // @Prop() min: number = 0;
  // @Prop() max: number = 100;
  // @Prop() showProgress: boolean = false;
  // @Prop() crazy: boolean = false;
  @Prop() context: string = 'primary';
  @Prop() size: Size | 'fit' = 'md';
  @Prop() mode: 'indeterminate' | 'determinate' | 'regular' | 'graph' = 'indeterminate';
  @Event({eventName: 'engOnComplete'}) onComplete: EventEmitter;


  componentDidLoad(): void {
  }

  processHexContext() {
    if (this.context && this.context.search('#') > -1) {
      return {
        borderColor: this.context
      }
    }
    return {};
  }

  processContext(): string {
    let classes = '';
    if (this.context && this.context.search('#') === -1) {
      classes += ' bc-' + this.context;
    }
    return classes;
  }

  renderIndeterminate() {
    return (
      <div class={`preloader-wrapper ${this.size} active`}>
        <div class={`spinner-layer ${this.processContext()}`} style={this.processHexContext()}>
          <div class="circle-clipper left">
            <div class="circle" />
          </div>
          <div class="gap-patch">
            <div class="circle" />
          </div>
          <div class="circle-clipper right">
            <div class="circle" />
          </div>
        </div>
      </div>
    );
  }

  renderDeterminate() {
    return (
      <div class={`preloader-wrapper ${this.size}`}>
        <div class={`spinner-layer ${this.processContext()}`} style={this.processHexContext()}>
          <div class="circle-clipper left">
            <div class="circle" />
          </div>
          <div class="gap-patch">
            <div class="circle" />
          </div>
          <div class="circle-clipper right">
            <div class="circle" />
          </div>
        </div>
      </div>
    );
  }

  render() {

    switch(this.mode) {
      case 'indeterminate':
        return this.renderIndeterminate();
      // case 'regular':
      //   return this.renderRegular();
      // case 'graph':
      //   return this.renderGraph();
      default:
        return this.renderDeterminate();
    }
  }
}
