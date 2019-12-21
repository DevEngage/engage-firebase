import {Component, Element, Prop, Event, EventEmitter, Method, Watch} from '@stencil/core';
import _ from 'lodash';
import {EngageColor} from "../../global/color";

export interface EngageIProgress {
  text?: string;
  min?: number;
  max?: number;
  current: number;
  classes?: string;
}

@Component({
  tag: 'eng-progress',
  styleUrl: 'progress.scss'
})
export class EngageProgress {

  @Prop({ context: 'config' }) config: any;
  @Prop({ context: 'engageColor' }) color: EngageColor;
  @Element() el: HTMLElement;
  @Prop() current: number | EngageIProgress | EngageIProgress[] = 0;
  @Prop() min: number = 0;
  @Prop() max: number = 100;
  @Prop() text: string = '';
  @Prop() classes: string = '';
  @Prop() context: string = 'primary';
  @Prop() mode: 'indeterminate' | 'determinate' | 'regular' = 'determinate';
  @Event({eventName: 'engOnComplete'}) onComplete: EventEmitter;


  componentDidLoad(): void {
  }

  @Watch('current')
  watchCurrent() {
    let completed = false;
    let progress: number | EngageIProgress | EngageIProgress[] = 0;
    if (_.isNumber(this.current) || _.isString(this.current)) {
      progress = this.current;
      if (parseInt(this.current + '') >= 100) {
        completed = true;
      }
    } else if (this.current && this.current['current']) {
      progress = this.current['current'];
      if (parseInt(this.current['current']) >= 100) {
        completed = true;
      }
    }
    this.onComplete.emit({
      current: this.current,
      progress,
      completed,
    });
  }

  @Method('getProgress')
  getProgress() {
    return this.current;
  }

  convertToInt(str): number {
    str = str + '';
    str = str.replace('$', '');
    str = str.replace(',', '');
    str = str.replace('*', '');
    return parseInt(str);
  }

  calcProgress(bar: any) {
    let valueInt = this.convertToInt(bar.current);
    let maxInt = this.convertToInt(bar.max || this.max);
    return (valueInt / maxInt) * 100;
  }

  renderBar(bar: EngageIProgress | any) {
    const calculated = this.calcProgress(bar);
    return (
      <div
        class={`progress-bar ${bar.classes || ''}`}
        role="progressbar"
        style={{width: `${calculated}%`}}
        aria-valuenow={bar.current}
        aria-valuemin={bar.min || this.min}
        aria-valuemax={bar.max || this.max}
      >{bar.text || ''}</div>
    );
  }

  renderRegular() {
    if (typeof this.current === 'number') {
      return this.renderBar({
        text: this.text,
        current: this.current,
        min: this.min,
        max: this.max,
        classes: this.classes
      });
    } else if (typeof this.current === 'object' && this.current['length']) {
      const bars = [];
      for (let index in this.current) {
        const bar = this.current[index];
        bars.push(this.renderBar(bar));
      }
      return bars;
    } else if (typeof this.current === 'object') {
      return this.renderBar(this.current);
    }
  }

  renderIndeterminate() {
    // console.log(this.color.classContextBg)
    console.log(this.color.classContextBg(this.context, true));

    return (
      <div
        class={`progress-md ${this.color.classContextBg(this.context, true)}`}
        style={{...this.color.hexContextBg(this.context, true)}}
      >
        <div
          class={`indeterminate ${this.color.classContextBg(this.context)}`}
          style={{...this.color.hexContextBg(this.context)}}
        />
      </div>
    );
  }

  renderDeterminate() {
    console.log(this.color.classContextBg(this.context, true));
    const calculated = this.calcProgress(
      _.isObject(this.current) ? this.current : { current: parseInt(this['current'] + '') }
      );
    return (
      <div
        class={`progress-md ${this.color.classContextBg(this.context, true)}`}
        style={{...this.color.hexContextBg(this.context, true)}}
      >
        <div
          class={`determinate ${this.color.classContextBg(this.context)}`}
          style={{width: calculated + '%', ...this.color.hexContextBg(this.context)}}
        />
      </div>
    );
  }

  render() {

    switch(this.mode) {
      case 'indeterminate':
        return this.renderIndeterminate();
      case 'regular':
        return (<div class="progress"> {this.renderRegular()} </div>);
      default:
        return this.renderDeterminate();
    }
  }
}
