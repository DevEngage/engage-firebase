import {Component, Prop} from '@stencil/core';


@Component({
  tag: 'eng-social-share',
  styleUrl: 'social-share.scss',
})
export class EngageSocialShare {

  @Prop() title: string = 'Share: ';
  @Prop() size: string = '28px';
  @Prop() message: string = '';
  @Prop() twitter: boolean = false;
  @Prop() facebook: string = '';
  @Prop() linkedin: string = ''; // require title
  @Prop() email: string = '';
  @Prop() context: string = 'clear'; //btn-outline-light

  getLocation() {
    return location.href;
  }

  render() {
    return (
      <div>
        <span class="font-weight-bold">{this.title}</span>
        {this.twitter ?
          <eng-button
            type="a"
            size="sm"
            context={this.context}
            href={`https://twitter.com/intent/tweet?text=${this.message}`}
            target="_blank"
            fontSize={this.size}
            icon="fab fa-twitter-square"
          />
          : null
        }
        {this.facebook ?
          <eng-button
            type="a"
            size="sm"
            context={this.context}
            href={`https://www.facebook.com/dialog/share?app_id=${this.facebook}&display=popup&href=${this.getLocation()}`}
            target="_blank"
            fontSize={this.size}
            icon="fab fa-facebook"
          />
          : null
        }
        {this.linkedin ?
          <eng-button
            type="a"
            size="sm"
            context={this.context}
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${this.getLocation()}&title=${this.linkedin}&summary=${this.message}&source=`}
            target="_blank"
            fontSize={this.size}
            icon="fab fa-linkedin"
          />
          : null
        }
        {this.email ?
          <eng-button
            type="a"
            size="sm"
            context={this.context}
            href={`mailto:?subject=${this.email}&body=${this.message}`}
            fontSize={this.size}
            icon="fas fa-envelope"
          />
          : null
        }
        <slot name="buttons" />
      </div>
    );
  }
}
