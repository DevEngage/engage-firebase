import {Component, Method, Prop, Element, Listen, State, Event, EventEmitter, Watch} from '@stencil/core';
import {EngageITab} from "../../../components/tabs/tabs";
import _ from 'lodash';
import {HeaderStyle} from "../../../types/theme";
import {RouterHistory} from "@stencil/router";


export interface EngageIUserLogin {
  email?: string;
  username?: string;
  password?: string;
  repeat?: string;
  remember?: boolean;
}


/*
* TODO:
* */

@Component({
  tag: 'eng-login-card',
  styleUrl: 'login-card.scss'
})
export class EngageLoginCard {

  @Prop({ context: 'config' }) config: any;
  @Element() element;
  @Prop() value: EngageIUserLogin = {
    email: '',
    password: '',
    remember: null,
  };
  @Prop() adapter;
  @Prop() history: RouterHistory;
  @Prop() type: 'create' | 'login' = 'login';
  @Prop() headerStyle: HeaderStyle = 'narrow';
  @Prop() simple: boolean = false;
  @Prop() route: string;
  @Prop() stencil: string;
  @Prop() modalType: any;
  @Prop() modalPosition: any;
  @Prop() sendEmailVerification: boolean = false;
  @Prop() cardStyle: 'style1'| 'style2' = 'style1';
  @Prop() showPolicy = true;
  /* Social */
  @Prop() social: boolean = false;
  @Prop() facebook: boolean = false;
  @Prop() google: boolean = false;
  @Prop() twitter: boolean = false;
  @Prop() linkedin: boolean = false;
  @Prop() github: boolean = false;
  /*        */
  @Event() onLoginSubmit: EventEmitter;
  @Event({eventName: 'engOnLoginSuccess'}) onSuccess: EventEmitter;
  @State() emailError: string;
  @State() passwordError: string;
  @State() submitError: string;
  @State() _type;
  @State() loading: boolean = false;
  private formElement;
  private tabs: EngageITab[] = [
    {
      name: 'Login',
    },
    {
      name: 'Create',
    },
  ];

  componentDidLoad() {
    this.watchType();
    this.formElement = this.element.querySelector('eng-form');
  }

  @Method('login')
  login() {
    this.formElement.submit();
    this.onLoginSubmit.emit({
      value: this.value
    });
    // this.modalElement.toggle();
  }

  @Method('create')
  create() {
    this.formElement.submit();
    // this.modalElement.toggle();
  }

  @Method('clear')
  clear() {
    this.formElement.reset();
    // this.modalElement.toggle();
  }

  @Method('forgotPassword')
  forgotPassword() {
    // this.modalElement.toggle();
  }

  @Watch('type')
  watchType() {
    this._type = this.type;
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
  // }

  @Listen('engOnSocialLoginSuccess')
  async engOnSocialLoginSuccess(event) {
    if (event.detail) {
      this.routeOnSuccess();
      this.onSuccess.emit(event.detail);
    }
  }
  @Listen('onSubmit')
  async onSubmit(event) {
    if (event.detail.type !== 'custom') return;
    if (!this.verifyForm(event.detail.values)) return;
    this.loading = true;
    let isSuccess = true;
    let user;
    this.submitError = '';
    try {
      switch (this._type) {
        case 'login':
          user = await this.adapter.login(event.detail.values.email, event.detail.values.password);
          break;
        case 'create':
          user = await this.adapter.signup(event.detail.values.email, event.detail.values.password);
          if (user && this.sendEmailVerification && this.adapter.sendEmailVerification) {
            this.adapter.sendEmailVerification();
          }
          break;
      }
    } catch (error) {
      isSuccess = false;
      console.error(error);
      if (error) {
        this.submitError = error.message || error.code || error.msg || error;
      }
      console.log(this.submitError);

    }
    this.loading = false;
    if (user && isSuccess) {
      this.routeOnSuccess();
      this.onSuccess.emit(user);
    }
  }

  toggletype(event) {
    event.preventDefault();
    if (this._type === 'create') this._type = 'login';
    else this._type = 'create';
  }

  verifyForm(form): boolean {
    if (!form) {
      return false;
      // throw new Error('Missing Form Data');
    }
    if (!form.email) {
      this.emailError = 'Please enter a valid email';
      return false;
    }
    this.emailError = '';
    if (!form.password) {
      this.passwordError = 'Please enter a valid password';
      return false;
    }
    if (this._type === 'create' && form.password !== form.repeat) {
      this.passwordError = 'Passwords do not match';
      return false;
    }
    this.passwordError = '';

    return true;
  }

  routeOnSuccess() {
    if (this.route) {
      location.href = this.route;
    } else if (this.stencil && this.history) {
      this.history.push(this.stencil);
    }
  }

  showPrivacyPolicy(event) {
    event.preventDefault();
    const element = this.element.querySelector('eng-privacy-policy-modal');
    element.show();
  }

  handleForgotPassword() {
    if (!this.adapter || !this.adapter.forgotPassword) return;
    this.adapter.forgotPassword();
  }

  renderStyle1() {
    return [
      <eng-media-card
        disableFooter={!this.social}
        simple={this.simple}
        headerTabs={this.tabs}
        headerStyle={this.headerStyle}
        footerBorder={true}
      >
        <eng-form slot="media-body" type="custom">

          <eng-input
            label="Email"
            name="email"
            manualMsg={true}
            errorMsg={this.emailError}
          />

          <eng-input
            label="Password"
            name="password"
            type="password"
            manualMsg={true}
            errorMsg={this.passwordError}
          />

          {this._type === 'create' ?
            <eng-input
              label="Repeat Password"
              name="repeat"
              type="password"
            />
            : null}

          {this.value && _.isBoolean(this.value.remember) ?
            [<eng-checkbox
              name="remember"
              label="Remember this device"
            />, <br/>]
            : null}

          {this.submitError ? <div class="text-danger">{this.submitError}</div> : null }
          <div class="row justify-content-center">
            {/*<eng-button context="info" outline={true}>{this.type === 'login' ? 'Create?' : 'Login?'}</eng-button>*/}
            <eng-button
              context="primary"
              disabled={this.loading}
              loading={this.loading}
            >{this._type}</eng-button>
          </div>
          <div class="row justify-content-center">
            <eng-button
              context="secondary"
              size="xs"
              outline={true}
              onClick={() => this.handleForgotPassword()}
            >Forgot password?</eng-button>
            <eng-button
              context="info"
              size="xs"
              outline={true}
              onClick={(e) => this.showPrivacyPolicy(e)}
            >Privacy Policy</eng-button>
          </div>

        </eng-form>

        {this.social || this.facebook || this.twitter || this.linkedin || this.github ? <div slot="media-footer" class="social-login">
          {/*{this.simple ? <hr /> : null }*/}
          <eng-social-login
            class="row justify-content-center"
            size="32px"
            type={this._type}
            adapter={this.adapter}
            google={this.google}
            facebook={this.facebook}
            twitter={this.twitter}
            linkedin={this.linkedin}
            github={this.github}
          />
        </div> : null}
      </eng-media-card>,
      <eng-privacy-policy-modal modalType={this.modalType} modalPosition={this.modalPosition} />
    ];
  }

  renderStyle2() {
    return [
      <eng-media-card
        simple={this.simple}
        disableHeader={true}
        disableFooter={true}
      >

        <eng-form slot="media-body" type="custom">

          <div class="row text-center">
            <div class="col header-text">
              {this._type === 'login' ?
                <div><eng-icon class="pr-2" name="fas fa-lock" /><span>Login</span></div>
                : <div><eng-icon class="pr-2" name="fas fa-user" /><span>Register</span></div>
              }
            </div>
          </div>

          <eng-input
            label="Email"
            name="email"
            manualMsg={true}
            errorMsg={this.emailError}
          />

          <eng-input
            label="Password"
            name="password"
            type="password"
            manualMsg={true}
            errorMsg={this.passwordError}
          />

          {this._type === 'create' ?
            <eng-input
              label="Repeat Password"
              name="repeat"
              type="password"
            />
            : null}

          {this.value && _.isBoolean(this.value.remember) ?
            [<eng-checkbox
              name="remember"
              label="Remember this device"
            />, <br/>]
            : null}

          {this.submitError ? <div class="text-danger">{this.submitError}</div> : null }
          <div class="row justify-content-center">
            {/*<eng-button context="info" outline={true}>{this.type === 'login' ? 'Create?' : 'Login?'}</eng-button>*/}
            <eng-button
              context="primary"
              disabled={this.loading}
              loading={this.loading}
              rounded={true}
            >{this._type}</eng-button>
          </div>
          <div class="pt-4">
            {this._type === 'create' ?
              <div class="row justify-content-center"><eng-button
                context="info"
                size="xs"
                clear={true}
                onClick={(e) => this.toggletype(e)}
              >Login</eng-button></div>
              : <div class="row justify-content-center"><eng-button
                context="info"
                size="xs"
                clear={true}
                onClick={(e) => this.toggletype(e)}
              >Register</eng-button></div>
            }
            <div class="row justify-content-center">
            <eng-button
              context="secondary"
              size="xs"
              clear={true}
              onClick={() => this.handleForgotPassword()}
            >Forgot password?</eng-button>
            </div>
            {this.showPolicy ?
            <div class="row justify-content-center">
            <eng-button
              context="info"
              size="xs"
              clear={true}
              outline={false}
              onClick={(e) => this.showPrivacyPolicy(e)}
            >Privacy Policy</eng-button>
            </div> : null }
          </div>

        </eng-form>

        {this.social || this.facebook || this.twitter || this.linkedin || this.github ? <div slot="media-footer" class="social-login">
          {/*{this.simple ? <hr /> : null }*/}
          <eng-social-login
            class="row justify-content-center"
            size="32px"
            type={this._type}
            adapter={this.adapter}
            google={this.google}
            facebook={this.facebook}
            twitter={this.twitter}
            linkedin={this.linkedin}
            github={this.github}
          />
        </div> : null}
      </eng-media-card>,
      <eng-privacy-policy-modal modalType={this.modalType} modalPosition={this.modalPosition} />
    ];
  }

  render() {
    switch (this.cardStyle) {
      case 'style1':
        return this.renderStyle1();
      case 'style2' :
        return this.renderStyle2();
    }
  }
}
