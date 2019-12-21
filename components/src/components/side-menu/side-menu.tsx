import {Component, Event, EventEmitter, Element, Method, Prop, State, Watch, Listen} from '@stencil/core';
import _ from 'lodash';

export interface EngISideMenuItem {
  name?: string;
  icon?: string;
  image?: string;
  action?(event?);
  divider?: string | boolean;
  label?: string | number;
  closes?: boolean;
  stencil?: string;
  open?: boolean;
  action?();
  link?: string;
  children?: EngISideMenuItem[]
}

/*
* TODO:
* [ ] item count (right side)
* [ ] menu item open allows for menu items to be open on render
**/

@Component({
  tag: 'eng-side-menu',
  styleUrl: 'side-menu.scss'
})
export class EngageSideMenu {

  private backdrop = null;
  body: HTMLElement = document.body;
  @Element() element: HTMLElement;
  @Prop() menuId: string = '';
  @Prop() isVisible: boolean = false;
  @Prop() closeOnAction: boolean = null;
  @Prop() brandTitle: string = '';
  @Prop() brandImage: string = '';
  @Prop() containerSelector: string | HTMLElement;
  @Prop() mode: 'static' | 'push' | 'partial' | 'overlay' | 'offset' = 'push'; // overlay, partial, push
  @Prop() enableBackdrop: boolean = false;
  @Prop() ignoreBackdropClick: boolean = false;
  @Prop() side: 'left' | 'right' = 'left'; // left, right
  @Prop() size: string = '220px';
  @Prop() hideAt: string = '750px';
  @Prop() overlayAt: string = '750px';
  @Prop() position: string = 'fixed';
  @Prop() backgroundImage: string = '/assets/img/side-menu/side-menu-background.png';
  @Prop() backgroundImagePosition: string = 'bottom';
  @Prop() backgroundColor: string = '#5c1296';
  @Prop() menu: EngISideMenuItem[] = [];
  @Prop() labels = [];
  @Prop() progress = [];
  @Prop() hideClose: boolean = false;
  @Prop() animation = {
    duration: '500ms',
    timingFunction: 'ease'
  };
  @Prop() enableSearch: boolean = false;
  @Prop() search = {
    placeholder: 'search',
    value: '',
    strategy: 'menu'
  };
  @State() _isVisible: boolean = false;
  @State() _visibility: 'hidden' | 'visible' = 'hidden';
  @State() _menuId: string = '';
  @State() selectedMenuItems = [];
  @Event() onShow: EventEmitter;
  @Event() onHide: EventEmitter;
  @Event() onMenuSearch: EventEmitter;
  @Event() onBrandAction: EventEmitter;
  documentBackDropClickHandler;
  windowSizeChangeHandler;
  scrollBarElement;

  private offsetDefaultCss = {
    position: '',
    width: ''
  };

  componentWillLoad() {
  }

  componentDidLoad() {
    if (this.menuId) {
      this._menuId = this.menuId;
    } else if (this.element.id) {
      this._menuId = this.element.id;
    } else {
      this._menuId = _.random(0, 10000000) + '';
    }
    this.watchIsVisible();
    this.setupMode();

    if (this.hideAt) {
      this.checkAndHideAt();
      this.windowSizeChangeHandler = ()=> {
        this.checkAndHideAt();
      };
      window.addEventListener('resize', this.windowSizeChangeHandler);
    }
    this.scrollBarElement = this.element.querySelector('eng-scroll');
  }

  componentDidUnload(): void {
    this.body.classList.remove('eng-menu-backdrop');
    if (this.documentBackDropClickHandler) {
      document.removeEventListener('mouseup', this.documentBackDropClickHandler);
    }
    if (this.windowSizeChangeHandler) {
      window.removeEventListener('resize', this.windowSizeChangeHandler);
    }
  }

  checkAndHideAt() {
    if (this.scrollBarElement) this.scrollBarElement.update();
    if (window.innerWidth < parseInt(this.hideAt)) {
      if (this._isVisible) {
        this.hide();
      }
    } else {
      if (!this._isVisible)  {
        this.show();
      }
    }
  }

  @Watch('isVisible')
  watchIsVisible() {
    this._isVisible = this.isVisible;
  }

  @Watch('_isVisible')
  watch_IsVisible() {
    if (this._isVisible) {
      this._visibility = 'visible';
    } else {
      setTimeout(() => {
        this._visibility = 'hidden';
      }, parseInt(this.animation.duration))
    }
  }

  @Method('toggle')
  toggle() {
    if (this._isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  @Method('show')
  show() {
    this._isVisible = true;
    this.setupMode();
  }

  @Method('hide')
  hide() {
    this._isVisible = false;
    this.setupMode();
    if (this.documentBackDropClickHandler) {
      document.removeEventListener('mouseup', this.documentBackDropClickHandler);
    }
  }

  @Method('getIsVisible')
  getIsVisible() {
    return this._isVisible;
  }

  @Method('setProgress')
  setProgress(index, value) {
    this.progress[index] = {
      ...this.progress[index],
      current: value
    }
  }

  @Method('getProgress')
  getProgress(index) {
    return this.progress[index];
  }

  @Listen('showEvent')
  showMenuEvent(event) {
    console.log(event)
  }

  @Listen('hideEvent')
  hideMenuEvent(event) {
    console.log(event)
  }

  @Listen('click')
  onClick() {
    setTimeout(() => {
      if (this.scrollBarElement) this.scrollBarElement.update();
    }, 400)
  }

  menuSearchHandler(event) {
    let value = '';
    if (event && event.target && event.target.value) {
      value = event.target.value;
    }
    this.onMenuSearch.emit({
      value: value
    })
  }

  setupMode() {
    this.element.style.transition = `
      left ${this.animation.duration} ${this.animation.timingFunction}, 
      right ${this.animation.duration} ${this.animation.timingFunction}
    `;
    if (this._isVisible && this.enableBackdrop) {
      this.showBackdrop();
    } else {
      this.removeBackdrop();
    }
    switch (this.mode) {
      case 'overlay':
        if (this.side == 'left') {
          if (this._isVisible) {
            this.element.style.left = '0';
          } else {
            this.element.style.left = '-' + this.size;
          }
        } else if (this.side == 'right') {
          if (this._isVisible) {
            this.element.style.right = '0';
          } else {
            this.element.style.right = '-' + this.size;
          }
        }
        return;
      case 'partial':
        if (this._isVisible) {
          this.pushContainer();
          this.element.style.left = '0';
        } else {
          this.element.style.left = '-170px';
          this.pushContainer('50px');
        }
        return;
      case 'push':
        if (this._isVisible) {
          this.pushContainer();
        } else {
          this.pushContainer('0');
        }
        return;
      case 'offset':
        if (this._isVisible) {
          this.pushContainer(undefined, this.size);
        } else {
          this.pushContainer(undefined, '0');
        }
        return;
      default:
        this._isVisible = true;
        this.pushContainer();
    }
  }

  pushContainer(margin = this.size, offset?: string) {
    const containerElement: HTMLElement = typeof this.containerSelector === 'string'
      ? document.querySelector(this.containerSelector)
      : this.containerSelector;
    containerElement.style.transition = `margin, width ${this.animation.duration} ${this.animation.timingFunction}`;
    if (this.side === 'left') {
      if (offset !== undefined) {
        containerElement.style.transition = `left ${this.animation.duration} ${this.animation.timingFunction}`;
        if (parseInt(offset) > 0) {
          this.offsetDefaultCss = {
            position: containerElement.style.position,
            width: containerElement.style.width,
          };
          containerElement.style.position = 'absolute';
          containerElement.style.width = `calc(100% + ${this.size})`;
        } else {
          containerElement.style.position = this.offsetDefaultCss.position;
          containerElement.style.width = this.offsetDefaultCss.width;
        }
        containerElement.style.left = '' + offset;
      } else {
        containerElement.style.marginLeft = '' + margin;
      }

      if (this._isVisible) {
        this.element.style.left = '0';
      } else {
        this.element.style.left = '-' + this.size;
      }
    } else if (this.side === 'right') {
      if (offset !== undefined) {
        containerElement.style.transition = `right ${this.animation.duration} ${this.animation.timingFunction}`;
        if (parseInt(offset) > 0) {
          this.offsetDefaultCss = {
            position: containerElement.style.position,
            width: containerElement.style.width,
          };
          containerElement.style.position = 'absolute';
          containerElement.style.width = `calc(100% + ${this.size})`;
        } else {
          containerElement.style.position = this.offsetDefaultCss.position;
          containerElement.style.width = this.offsetDefaultCss.width;
        }
        containerElement.style.right = '' + offset;
      } else {
        containerElement.style.marginRight = '' + margin;
      }

      if (this._isVisible) {
        this.element.style.right = '0';
      } else {
        this.element.style.right = '-' + this.size;
      }
    }
  }

  private showBackdrop(callback?) {
    if (this._isVisible) {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'eng-menu-backdrop';
      this.body.appendChild(this.backdrop);

      this.documentBackDropClickHandler = (event) => {
        if (this.ignoreBackdropClick || !event.target.classList.contains('eng-menu-backdrop')) {
          return;
        }
        this.hide();
      };
      document.addEventListener('mouseup', this.documentBackDropClickHandler);
      this.backdrop.classList.add('show');
      if (!callback) {
        return;
      }
    } else if (!this._isVisible && this.backdrop) {
      this.backdrop.classList.remove('show');
      const callbackRemove = () => {
        this.removeBackdrop();
        if (callback) {
          callback();
        }
      };
      callbackRemove();
    } else if (callback) {
      callback();
    }
  }

  removeBackdrop() {
    if (this.backdrop) {
      this.body.removeChild(this.backdrop);
      this.backdrop = null
    }
  }

  menuItemClicked(index) {
    if (this.menuItemExists(index)) {
      this.selectedMenuItems = _.without(this.selectedMenuItems, index);
    } else {
      this.selectedMenuItems = [
        ...this.selectedMenuItems,
        index
      ];
    }
  }

  menuItemExists(index) {
    return _.includes(this.selectedMenuItems, index);
  }

  menuItemChildrenExist(item) {
    return item && item.children && item.children.length;
  }

  showItemChildrenArrow(item, index) {
    if (!this.menuItemChildrenExist(item)) return '';
    return this.menuItemExists(index) ? 'fa-chevron-down' : 'fa-chevron-left'
  }

  menuItemAction(item, event) {
    if (item && item.action && _.isFunction(item.action)) {
      item.action({
        item: item,
        event: event
      });
    } else if (item && item.link) {
      location.href = item.link;
    } else if (item && item.stencil) {
      // this.history.push('/doc-marketing', {});
    }
    if (item && item.closes || this.closeOnAction === true) {
      this.hide();
    }
  }

  renderHeader() {
    return (
      <div class="eng-side-menu-header">
        {this.mode && this.mode === 'overlay' && this.side === 'left' && !this.hideClose ?
          <div class="eng-menu-close-box" onClick={() => this.hide()}><i class="fa fa-times"/></div>
          : null
        }
        {this.mode && this.mode === 'overlay' && this.side === 'right' && !this.hideClose ?
          <div class="eng-menu-close-box-right" onClick={() => this.hide()}><i class="fa fa-times"/></div>
          : null
        }
        <a class="eng-brand-container" onClick={() => this.onBrandAction.emit()}>
          {this.brandImage ? <img class="eng-brand-image" src={this.brandImage} alt=""/> : null}
          <h3 class="m-0 p-1 ml-1 pt-1 eng-brand-title">{this.brandTitle ? this.brandTitle : null}</h3>
        </a>
        <slot name="header" />
      </div>
    )
  }

  renderSearch() {
    if (!this.enableSearch) {
      return(<slot name="search" />)
    }
    return (
      <form class="form-inline w-100 mx-1 my-1 bg-transparent eng-menu-search">
        <input
          class="form-control bg-transparent"
          type="search"
          value={this.search.value}
          onInput={(e) => this.menuSearchHandler(e)}
          placeholder={this.search.placeholder} aria-label="Search"
        />
      </form>
    );
  }

  renderMenu(menu = this.menu) {
    if (!menu || !menu.length) {
      return (<slot name="menu" />);
    }
    return (
      <stb-collapse accordion={false} class="mt-2 eng-menu">
        {menu.map((item, i) =>
          item && item.divider ? this.renderMenuDivider(item) : this.renderMenuItem(item, i))
        }
      </stb-collapse>
    );
  }

  handleStencilRoute(item, template) {
    if (_.isString(item.stencil)) {
      return (item && item.stencil ?
        <stencil-route-link
          url={item.stencil}
        >
          {template}
        </stencil-route-link>
        :
        template
      );
    } else {
      const stencil: JSXElements.StencilRouteLinkAttributes = item.stencil;
      return (item && item.stencil ?
        <stencil-route-link
          url={stencil.url}
          exact={stencil.exact}
          activeClass={stencil.activeClass}
          anchorClass={stencil.anchorClass}
          anchorRole={stencil.anchorRole}
          anchorTitle={stencil.anchorTitle}
          custom={stencil.custom}
          history={stencil.history}
          location={stencil.location}
          root={stencil.root}
          strict={stencil.strict}
          urlMatch={stencil.urlMatch}
        >
          {template}
        </stencil-route-link>
        :
        template
      );
    }
  }

  renderMenuDivider(item) {
    return (
      <div
        class="eng-menu-divider"
      >
        <div class="eng-menu-divider-label">{_.isString(item.divider) ? item.divider : ''}</div>
      </div>
    );
  }

  renderMenuItem(item, index) {

    const parentRoute = () =>  (
      <div
        class={`${this.menuItemExists(index) && this.menuItemChildrenExist(item) ? 'eng-menu-item-open' : 'eng-menu-item-closed'}`}
      >
        <div
          class="px-4 py-2"
          data-toggle={this.menuItemChildrenExist(item) ? 'collapse' : ''}
          data-target={'#eng-collapse-' + this._menuId + '-' + _.kebabCase(item.name)}
          onClick={() => this.menuItemClicked(index)}
        >
          <p
            class="mb-0 eng-menu-item-title row align-items-center justify-content-between"
            onClick={(e) => this.menuItemAction(item, e)}
          >
            <a class="eng-menu-item row align-items-center py-1 px-4" aria-expanded="false" aria-controls="collapseOne">
              {item && item.icon ? <i class={item.icon}/> : null}
              <div class="d-inline-block">{item.name}</div>
            </a>
            {item && item.badge ? <span class={`eng-menu-badge ${this.showItemChildrenArrow(item, index) ? 'eng-menu-badge-w-arrow' : ''} badge ${item.badgeClass ? item.badgeClass : 'badge-primary'}`}>{item.badge}</span> : null}
            <i class={`fa ${this.showItemChildrenArrow(item, index)} mt-1 mr-2`} />
          </p>
        </div>

        <div
          id={'eng-collapse-' + this._menuId + '-' + _.kebabCase(item.name)}
          class="collapse pl-4"
          aria-labelledby="headingOne"
          data-parent="#accordion"
        >
          <div class="card-body ml-0 mt-0 pt-0 pl-0" >
            {item && item.children && item.children.length ?
              item.children.map(child => this.handleStencilRoute(child, this.renderSubItem(child)))
              : null
            }
          </div>
        </div>
      </div>
    );

    return (
      this.handleStencilRoute(item, parentRoute())
    );
  }

  renderSubItem (child) {
    return (
      <a class="eng-menu-item row align-items-center py-2 eng-menu-sub-item" onClick={(e) => this.menuItemAction(child, e)}>
        {child && child.icon ? <i class={child.icon}/> : null}
        <div class="d-inline-block">{child.name}</div>
      </a>
    )
  }

  renderProgress(progress: any[] = this.progress) {
    if (!progress || !progress.length) {
      return (<slot name="progress" />);
    }
    return (
      <div class="my-3">
        {progress.map(item => this.renderProgressItem(item))}
      </div>
    );
  }

  renderProgressItem(item) {
    return (
      <div class="p-2" onClick={(e) => this.menuItemAction(item, e)}>
        <span>{item.name}</span>
        <stb-progress current={item.current} />
      </div>
    );
  }

  renderLabels(labels: any[] = this.labels) {
    if (!labels || !labels.length) {
      return (<slot name="labels" />);
    }
    return (
      <div class="my-3">
        {labels.map(item => this.renderLabelItem(item))}
      </div>
    );
  }

  renderLabelItem(item) {
    return (
      <div class="p-2 eng-label-item" onClick={(e) => this.menuItemAction(item, e)}>
        <div class="eng-label-bg" style={{backgroundColor: item.color || 'black'}}/>{item.name}
      </div>
    );
  }

  renderFooter() {
    return (
      <div class="row justify-content-center eng-menu-footer">
        <slot name="footer" />
      </div>
    )
  }

  hostData() {
    return {
      style: {
        display: 'block',
        width: this.size,
        height: '100%',
        visibility: this._visibility,
        position: this.position,
        'background-color': this.backgroundColor,
        color: 'white',
        overflow: 'auto',
      }
    }
  }

  render() {
    // this.scrollBarElement.
    return [
        <div
          class="eng-background-image"
          style={{
            background: this.backgroundImage ? `url("${this.backgroundImage}") center center no-repeat` : '',
            backgroundPosition: this.backgroundImagePosition
          }}
        />,
        this.renderHeader(),
        this.renderSearch(),
        this.renderMenu(this.menu),
        this.renderLabels(this.labels),
        this.renderProgress(this.progress),
        <slot/>,
        this.renderFooter(),
        <eng-scroll scrollBodyElement={this.element} />
    ];
  }
}
