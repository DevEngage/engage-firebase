import {Component, Element, Prop, Event, EventEmitter, State, Watch, Method} from '@stencil/core';
import _ from "lodash";


export interface EngIChip {
  id?: string;
  text?: string;
  image?: string;
  icon?: string;
  context?: string;
  dark?: string;
  stencil?: string;
  action?();
}

/**/

@Component({
  tag: 'eng-chips',
  styleUrl: 'chips.scss'
})
export class EngageIcon {

  @Prop({ context: 'config' }) config: any;
  @Element() el: HTMLElement;
  @Prop() context: string;
  @Prop() dark: boolean = false;
  @Prop() stencil: string;
  @Prop() showClose: boolean = true;
  @Prop() chip: EngIChip;
  @Prop() chips: EngIChip[] = [];
  @State() _chips: EngIChip[] = [];
  @Event({eventName: 'engOnClose'}) onClose: EventEmitter;
  @Event({eventName: 'engOnClick'}) onClick: EventEmitter;


  componentDidLoad(): void {
    this.watchChips();
  }

  @Watch('chips')
  watchChips() {
    this._chips = this.chips;
  }

  @Method('getChips')
  getChips() {
    return this._chips;
  }

  handleClose(event, chip, index) {
    event.preventDefault();
    event.stopPropagation();
    if (index > -1 && this._chips) {
      this._chips = [
      ..._.filter(this._chips, (val, i) => i !== index && val)
      ];
    }

    this.onClose.emit({
      event,
      chip
    });
  }

  handleAction(event, chip) {
    console.log(chip)
    if (_.isFunction(chip.action)) {
      chip.action({
        event,
        chip
      });
    }

    this.onClick.emit({
      event,
      chip
    });
  }

  getStyle(chip) {
    let style = {};
    if (this.context && (this.context.search('#') > -1 || chip.context.search('#') > -1)) {
      style = {
        ...style,
        backgroundColor: chip.context || this.context
      }
    }
    return style;
  }

  getClasses(chip) {
    let classes = 'chip';
    if (this.context && (this.context.search('#') === -1 || chip.context.search('#') === -1)) {
      classes += ` bg-${chip.context || this.context}`;
    }
    if ((this.dark && !chip.context) || chip.dark) {
      classes += ` chip-bg-dark`;
    }
    return classes;
  }

  renderChip(chip, index?) {
    return (
      <div
        class={this.getClasses(chip)}
        style={this.getStyle(chip)}
        onClick={(e) => this.handleAction(e, chip)}
      >
        {chip.image ? <img src={chip.image} /> : null }
        {chip.icon ? <eng-icon class="left-icon" name={chip.icon} /> : null }
        {chip.text}
        {this.showClose ? <eng-icon class="close" name="fas fa-times" onClick={(e) => this.handleClose(e, chip, index)} /> : null }
      </div>
    );
  }


  render() {
    return [
      this.chip && !this.stencil ? this.renderChip(this.chip) : null,
      this._chips && !this.stencil ? this._chips.map((chip, i) =>
        chip && chip.stencil ?
          <stencil-route-link url={chip.stencil}>{this.renderChip(chip, i)}</stencil-route-link>
          :
          this.renderChip(chip, i)
      ) : null,
      this.chip && this.stencil ? <stencil-route-link url={this.stencil}>
        {this.renderChip(this.chip)}
      </stencil-route-link> : null,
      this._chips && this.stencil ? this._chips.map((chip, i) =>
        <stencil-route-link url={this.stencil}>{this.renderChip(chip, i)}</stencil-route-link>
      ) : null,
    ]
  }
}
