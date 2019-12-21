import {Component, Event, EventEmitter, Prop} from '@stencil/core';


@Component({
  tag: 'eng-social-login',
  styleUrl: 'social-login.scss',
})
export class EngageSocialLogin {

  @Prop({ context: 'config' }) config: any;
  // @Prop() title: string = 'Share: ';
  // @Prop() message: string = '';
  @Prop() adapter: any;
  // Popup, link, etc
  @Prop() method: 'popup' | 'redirect' = 'popup';
  @Prop() type: 'login' | 'create' = 'login';
  @Prop() size: string = '28px';
  @Prop() google: boolean = false;
  @Prop() twitter: boolean = false;
  @Prop() facebook: boolean = false;
  @Prop() linkedin: boolean = false; // require title
  @Prop() github: boolean = false; // require title
  @Prop() context: string = 'clear';
  // @Prop() email: string = '';
  @Event({eventName: 'engOnSocialLoginSuccess'}) onSuccess: EventEmitter;


  getLocation() {
    return location.href;
  }

  async handleAuth(service) {
    const user = await this.adapter.loginSocial(service, this.method);
    if (user) {
      this.onSuccess.emit(user);
    }
  }

  render() {
    return (
      <div>
        {/*<span class="font-weight-bold">{this.title}</span>*/}
        {this.google ?
          <eng-button
            size="sm"
            context={this.context}
            type="a"
            onClick={() => this.handleAuth('google')}
            fontSize={this.size}
            icon="fab fa-google-plus-square"
          />
          : null
        }
        {this.twitter ?
          <eng-button
            size="sm"
            context={this.context}
            type="a"
            onClick={() => this.handleAuth('twitter')}
            fontSize={this.size}
            icon="fab fa-twitter-square"
          />
          : null
        }
        {this.facebook ?
          <eng-button
            size="sm"
            context={this.context}
            type="a"
            onClick={() => this.handleAuth('facebook')}
            fontSize={this.size}
            icon="fab fa-facebook"
          />
          : null
        }
        {this.linkedin ?
          <eng-button
            size="sm"
            context={this.context}
            type="a"
            onClick={() => this.handleAuth('linkedin')}
            fontSize={this.size}
            icon="fab fa-linkedin"
          />
          : null
        }
        {this.github ?
          <eng-button
            size="sm"
            context={this.context}
            type="a"
            onClick={() => this.handleAuth('github')}
            fontSize={this.size}
            icon="fab fa-lgithub-square"
          />
          : null
        }
        <slot name="buttons" />
      </div>
    );
  }
}
