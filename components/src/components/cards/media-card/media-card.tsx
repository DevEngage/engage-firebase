import {Component, Method, Prop, Element, Event, EventEmitter} from '@stencil/core';
import {Size, Context, HeaderStyle} from "../../../types/theme";
// import {EngageITab} from "../../../components/tabs/tabs";
import _ from 'lodash';
import {EngageITab} from "../../../components/tabs/tabs";
import {EngageUtil} from "../../../helpers/util";
import {EngageColor} from "../../../global/color";


export interface EngageIMedia {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  repeat?: string;
  remember?: boolean;
}


/*
* TODO:
* [ ] Work on overlay style
* */

@Component({
  tag: 'eng-media-card',
  styleUrl: 'media-card.scss'
})
export class EngageMediaCard {

  @Prop({ context: 'config' }) config: any;
  @Prop({ context: 'engageColor' }) engColor: EngageColor;
  @Element() element;
  @Prop() type: 'static' | 'flip' | 'pass' = 'static';
  @Prop() cardType: 'basic' | '' | '' | '' | '' = 'basic';
  @Prop({ attr: 'engId' }) id: string = 'eng-card-' + _.random(0, 100000000);
  @Prop() size: Size = 'md';
  @Prop() context: Context = 'primary';
  @Prop() dark: boolean = true;
  @Prop() ripple: boolean = false;
  @Prop() disableHeader: boolean = false;
  @Prop() disableFooter: boolean = false;
  @Prop() fab: string;
  @Prop() simple: boolean = false;
  @Prop() cardBg: string;

  /* Header  */
  @Prop() headerStyle: HeaderStyle = 'regular';
  @Prop() headerReverse: boolean = false;
  @Prop() headerImage: string;
  @Prop() headerBg: string = '';
  @Prop() headerContext: string = '';
  @Prop() titleButton: string;
  @Prop() headerTitle: string;
  @Prop() headerSubTitle: string;
  @Prop() profileSize: Size = 'md';
  @Prop() profileIcon: string;
  @Prop() profileBg: string = 'white';
  @Prop() headerTabs: EngageITab[];
  /*         */

  /* Body */
  @Prop() title: string;
  @Prop() subTitle: string;
  @Prop() titleBorder: boolean = false;
  @Prop() body: string;
  @Prop() bodyBg: string;
  @Prop() align: 'left' | 'center' | 'right' = 'left';
  /*         */

  /* footer */
  @Prop() footerBorder: boolean = false;
  @Prop() readMore: boolean = false;
  /*         */

  /* Social */
  @Prop() social: boolean = false;
  @Prop() facebook: boolean = false;
  @Prop() google: boolean = false;
  @Prop() twitter: boolean = false;
  @Prop() linkedin: boolean = false;
  @Prop() github: boolean = false;
  /*        */

  @Event({eventName: 'engOnAction'}) onAction: EventEmitter;
  @Event({eventName: 'engOnFabClick'}) onFabClick: EventEmitter;
  @Event({eventName: 'engOnTitleClick'}) onTitleClick: EventEmitter;
  @Event({eventName: 'engOnHeaderClick'}) onHeaderClick: EventEmitter;


  componentDidLoad() {
  }

  @Method('login')
  login() {

  }


  // @Listen('onTabSelected')
  // onTabSelected(event) {
  //   switch(event.detail.index) {
  //     case 0:
  //       this._type = 'login';
  //       break;
  //     case 1:
  //       this._type = 'create';
  //       break;
  //   }
  //   console.log(event.detail)
  // }

  getHeaderStyle() {
    let style = {};
    style = {
      ...style,
      ...EngageUtil.handleContext(this.headerBg, 'style')
    };
    if (this.headerStyle === 'profile') {
      style = {
        ...style,
        minHeight: '120px',
      }
    }
    return style;
  }

  getHeaderClasses() {
    let classes = 'eng-media-header';
    if ((this.headerStyle || this.headerBg) && this.headerStyle !== 'basic' ) {
      classes = 'eng-media-header-cascading eng-media-header-cascading-' + this.headerStyle;
    }
    if(this.headerTabs && this.headerTabs.length) {
      classes += ' eng-header-tabs'
    }
    if (this.headerBg) {
      const headerBgClass = EngageUtil.handleContext(this.headerBg, 'class');
      classes += ` eng-media-header-bg ${headerBgClass && headerBgClass.length ? 'bg-' + headerBgClass : ''}`;
    }
    if (this.dark) {
      classes += ' eng-header-dark';
    }
    if (this.headerStyle === 'profile') {
      classes += ' eng-media-header-profile eng-media-header-profile-' + this.profileSize;
    }
    return classes;
  }

  getCardClasses() {
    let classes = '';
    if (this.headerStyle && this.headerStyle !== 'basic') {
      classes += ' eng-media-card-raise';
    }
    if (this.align) {
      classes += ' text-' + this.align;
    }
    return classes;
  }

  handleHeaderFabME(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleClick(event, type = 'none') {
    event.preventDefault();
    event.stopPropagation();
    const action = {
      id: this.id,
      event,
      type
    };
    this.onAction.emit(action);
    switch(type) {
      case 'fab':
        this.onFabClick.emit(action);
        break;
      case 'title':
        this.onTitleClick.emit(action);
        break;
      case 'header':
        this.onHeaderClick.emit(action);
        break;
    }
  }

  headerImgStyle() {
    let style = {};
    if (this.headerStyle === 'profile') {
      style = {
        ...style,
        backgroundImage: `url(${this.headerImage})`,
      }
    }
    if (this.profileBg.search('#') > -1) {
      style = {
        ...style,
        backgroundColor: this.profileBg,
      }
    }
    return style;
  }

  render() {
    return [
      <eng-card
        class={this.getCardClasses()}
        disableHeader={this.disableHeader}
        disableFooter={this.disableFooter}
        cardBg={this.cardBg}
        type={this.type}
        simple={this.simple}
      >

        <div
          slot="card-header"
          class={this.getHeaderClasses()}
          style={this.getHeaderStyle()}
          onClick={(e) => this.handleClick(e, 'header')}
        >
          {this.headerTabs ? <eng-tabs tabs={this.headerTabs} type="bg-pill" size="sm"/> : null}
          {this.headerTitle ? <h3 class="card-title">{this.headerTitle}</h3> : null}
          {this.headerSubTitle ? <h5 class="card-subtitle">{this.headerSubTitle}</h5> : null}
          <slot name="media-header" />
          {this.headerImage || this.profileIcon ?
            <div
              class={`eng-media-header-img eng-profile-img-${this.profileSize} ${this.profileBg.search('#') === -1 ? 'bg-' + this.profileBg : ''}`}
              style={this.headerImgStyle()}
            >
              {this.headerStyle !== 'profile' ? <img class="img-fluid" src={this.headerImage} alt=""/> :
                this.profileIcon ? <eng-icon name={this.profileIcon} /> : null
              }
            </div> : null
          }
          {this.fab ? <eng-button
            class="eng-media-header-fab"
            context={this.context}
            fab={true}
            icon={this.fab}
            onMouseEnter={(e) => this.handleHeaderFabME(e)}
            onClick={(e) => this.handleClick(e, 'fab')}
          /> : null}
        </div>


        <div slot="card-body"
             class={this.engColor.classContextBg(this.bodyBg)}
             style={{...this.engColor.hexContextBg(this.bodyBg)}}
        >
          {this.titleButton ? <eng-button
            class="float-right"
            context="clear"
            fab={true}
            icon={this.titleButton}
            onMouseEnter={(e) => this.handleHeaderFabME(e)}
            onClick={(e) => this.handleClick(e, 'title')}
          /> : null}
          {this.title ? <h4 class="card-title">{this.title}</h4> : null}
          {this.subTitle ? <h5 class="text-primary card-subtitle">{this.subTitle}</h5> : null}
          {this.titleBorder ? <hr/> : null}

          {this.body ? <p class="mt-2">{this.body}</p> : null}
          <slot name="media-body" />
        </div>


        <div slot="card-footer">
          {this.footerBorder ? <hr/> : null}
          <slot name="media-footer" />
          {this.readMore ?
            <div class="d-flex justify-content-end">
              <eng-button
                rightIcon="fas fa-chevron-right"
                context="clear"
                size="sm"
                fontSize="24px"
                allCaps={false}
                onClick={(e) => this.handleClick(e, 'read-more')}
              >Read more</eng-button>
            </div>
            : null
          }
        </div>

      </eng-card>
    ];
  }
}
