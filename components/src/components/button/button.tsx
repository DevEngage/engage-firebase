import {Component, Event, EventEmitter, Listen, Method, Prop, State, Watch} from '@stencil/core';
import {Size} from "../../types/theme";
import _ from 'lodash';


/*
* TODO:
* [ ] Make sure button looks good in other themes
* [X] Add eng-icon support when ready
* [ ] add gradient support
* [ ] add floating support
* [ ] add Fixed support
* [ ] add Size support
* [ ] add Radio support
* */

/*
* @Requires
*  - Loading Component
*  - Icon Component
* */

@Component({
  tag: 'eng-button',
  styleUrl: 'button.scss'
})
export class EngageButton {
  @Prop({ context: 'config' }) config: any;

  @Prop() type: 'default' | 'a' | 'submit' | '' = 'default';
  @Prop() disabled = false;
  @Prop() theme = 'material'; // flat, material, dark
  @Prop() context: string = 'primary';
  @Prop() icon: string; // leftIcon
  @Prop() rightIcon: string;
  @Prop() textColor: string;
  @Prop() block = false;
  @Prop() allCaps = true;
  @Prop() outline = false;
  @Prop() clear = false;
  @Prop() rounded = false;
  @Prop() fab = false;
  @Prop() fabList = [];
  @Prop() fabDirection = 'down';
  @Prop() fabOpen = false;
  @Prop() loading = false;
  @Prop() loadingCurrent;
  @Prop() loadingContext;
  @Prop() loadingMin;
  @Prop() loadingMax;
  /* TOOLTIP */
  @Prop() tooltip: string;
  @Prop() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  // @Prop() loadingContext = ;
  @Prop() loadingType: 'bar' | 'spinner' | 'full' | 'center' = 'bar';
  @Prop() dropdown = false;
  @Prop() preventDefault = false;
  @Prop() stopPropagation = false;
  @Prop() stop = false;
  @Prop() size: Size = '';
  @Prop() fontSize: string;
  @Prop() enableToggle = false;
  @Prop() href: string;
  @Prop() target: string = '_blank';
  @Prop() ripple: boolean | 'center' = null;
  @Prop() onClick: (event) => any;
  @State() _ripple: boolean | 'center' = null;
  @State() _toggleState: boolean = false;
  @State() _loading: boolean = false;
  @State() _loadingCurrent;
  @State() _fabOpen = false;
  @Event() engOnAction: EventEmitter;

  componentWillLoad() {
    switch (this.theme)  {
      case 'material':
        if (_.isNull(this.ripple)) {
          this._ripple = true;
        }
    }
    this.watchLoading();
    this.watchLoadingCurrent();
  }

  @Watch('fabOpen')
  onFabOpen() {
    this._fabOpen = this.fabOpen;
  }

  @Watch('ripple')
  onRipple() {
    this._ripple = this.ripple;
  }

  @Watch('loadingCurrent')
  watchLoadingCurrent() {
    this._loadingCurrent = this.loadingCurrent;
  }

  @Watch('loading')
  watchLoading() {
    this._loading = this.loading;
  }

  @Method('toggle')
  toggle() {
    this._toggleState = !this._toggleState;
  }

  @Method('toggleLoading')
  toggleLoading() {
    this._toggleState = !this._toggleState;
  }

  @Method('startLoading')
  startLoading() {
    this._toggleState = true;
  }

  @Method('endLoading')
  endLoading() {
    this._toggleState = false;
  }

  @Method('setLoadingCurrent')
  setLoadingCurrent(loadingCurrent) {
    this._loadingCurrent = loadingCurrent;
  }

  @Listen('click')
  onParentClick(event) {
    if (this.preventDefault) {
      event.preventDefault();
    }
    if (this.stopPropagation) {
      event.stopPropagation();
    }
    if (this.onClick) {
      this.onClick(event);
    }
    if(this.fab) this._fabOpen = !this._fabOpen;
    return event;
  }

  buildBtnClasses() {
    let styleClasses = '';

    if (this.outline) {
      styleClasses += 'btn-' +  'outline-'+ this.context;
    } else if (this.clear) {
      styleClasses += 'btn-clear';
    } else {
      styleClasses += 'btn-' + this.context;
      if (this.context.search('#') === -1) {
        if (this.loading && this.loadingType === 'center') {
          styleClasses += ' text-' + this.context;
        }
      }
    }

    if (this.rounded) {
      styleClasses += ' btn-rounded';
    }

    if (this.block) {
      styleClasses += ' btn-block';
    }

    if (this.size) {
      styleClasses += ' btn-' + this.size;
    }

    if (this._toggleState) {
      styleClasses += ' active';
    }

    if (this.dropdown) {
      styleClasses += ' dropdown-toggle';
    }

    if (this.fab) {
      styleClasses += ' eng-btn-fab';
    }

    if (!this.allCaps) {
      styleClasses += ' eng-btn-ignore-case';
    }

    return styleClasses;
  }

  rippleEffect(e, target = e.target) {
    if(target) {
      let rect = target.getBoundingClientRect(),
        ripple = target.querySelector('.eng-ripple-effect');
      if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'eng-ripple-effect';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
      } else {
        ripple.className = 'eng-ripple-effect';
      }
      switch (this.ripple) {
        case 'center':
          ripple.style.top = (rect.height / 2 - ripple.offsetHeight / 2 ) + 'px';
          ripple.style.left = (rect.width / 2 - ripple.offsetWidth / 2) + 'px';
          break;
        default:
          ripple.style.top = ((e.pageY || e.targetTouches[0].pageY) - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop) + 'px';
          ripple.style.left = ((e.pageX || e.targetTouches[0].pageX) - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft) + 'px';
      }
      ripple.className = 'eng-ripple-effect eng-z-active';
      setTimeout(() => target.removeChild(ripple), 800);
      return false;
    }
  }

  handleClick(event) {
    if (this.disabled) return;
    if (this._ripple) {
      this.rippleEffect(event)
    }

    if (this.enableToggle) {
      this._toggleState = !this._toggleState;
    }
  }

  getStyle() {
    let style = {};
    if (this.context.search('#') > -1) {
      style = {
        ...style,
        backgroundColor: this.context
      };

      if (this.loading && this.loadingType === 'center') {
        style = {
          ...style,
          color: this.context
        };
      }
    }
    if (this.textColor) {
      style = {
        ...style,
        color: this.textColor
      }
    }
    if (this.fontSize) {
      style = {
        ...style,
        fontSize: this.fontSize
      }
    }
    return style;
  }

  renderLoading() {
    return [
      <eng-loading
        class={`button-loading-${this.loadingType}`}
        type={this.loadingType === 'bar' ? 'bar' : 'spinner'}
        mode={this._loadingCurrent > -1 ?  'determinate' : 'indeterminate'}
        context={this.loadingContext ? this.loadingContext : this.context}
        size="xs"
        current={this._loadingCurrent}
        min={this.loadingMin}
        max={this.loadingMax}
      />
    ];
  }

  renderInner() {
    return [
      this.icon ? <eng-icon name={this.icon} size={this.fontSize} /> : null,
      <slot/>,
      this.rightIcon ? <eng-icon name={this.rightIcon} size={this.fontSize} /> : null,
      this._loading ? this.renderLoading() : null
    ];
  }

  renderFabArea(){
    if (!this.fab || !this.fabList.length) return null;
    let classes = '';
    if (this.fabDirection === 'left' || this.fabDirection === 'right'){
      classes += 'd-flex flex-row'
    }

    return(
    <div class={
      'eng-fab-list ' + 'direction-' + this.fabDirection + ' ' +
      (this._fabOpen ? 'd-inline-block': 'd-none') +
        ' ' + classes
    }>
      {this.fabList.map(fab =>
        <eng-button fab={true}
                    context={fab.context}
                    size={fab.size}
                    icon={fab.icon}
                    preventDefault={fab.preventDefault}
                    stopPropagation={fab.stopPropagation}
                    onClick={fab.action}
        >{fab.name || fab.title}</eng-button>
      )}
      <slot name="fabList"/>
    </div>
    )
  }

  renderButton() {
    return (
      <button
        disabled={this.disabled}
        type={this.type && this.type === 'submit' ? this.type : null}
        class={`btn ${this.buildBtnClasses()} ${this._fabOpen ? 'button-allow-overflow' :''}`}
        onClick={e => this.handleClick(e)}
        style={this.getStyle()}
      >
        {this.renderInner()}
        {this.renderFabArea()}
      </button>
    );
  }

  renderATag() {
    return (
      <a
        class={`btn ${this.buildBtnClasses()} ${this._fabOpen ? 'button-allow-overflow' :''}`}
        onClick={e => this.handleClick(e)}
        href={this.href}
        target={this.target}
        style={this.getStyle()}
      >
        {this.renderInner()}
        {this.renderFabArea()}
      </a>
    );
  }

  // renderTooltip() {
  //   return (
  //     <eng-tooltip
  //       engPlacement={this.tooltipPosition}
  //       engBody={this.tooltip}
  //     >
  //       {this.type === 'a' || this.href ?
  //         this.renderATag()
  //         :
  //         this.renderButton()
  //       }
  //     </eng-tooltip>
  //   )
  // }


  render() {
    // if (this.tooltip) {
    //   return this.renderTooltip();
    // } else {
      return this.type === 'a' || this.href ?
        this.renderATag()
        :
        this.renderButton()
    }
  // }
}

