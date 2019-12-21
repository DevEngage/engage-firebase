import {Component, Method, Prop, Element, Listen} from '@stencil/core';
import _ from 'lodash';


/*
* TODO:
* */

@Component({
  tag: 'eng-flip-card',
  styleUrl: 'flip-card.scss',
  host: {
    theme: 'eng-flip-card'
  }
})
export class EngageFlipCard {

  @Prop({ context: 'config' }) config: any;
  @Prop() flipType: 'hover' | 'click' | 'button' = 'click';
  @Prop() type: 'static' | 'flip' | 'pass' = 'flip';
  @Prop() visible: number = 0;
  @Prop() flipSelector: string = '.eng-flip';
  @Prop() flipButtonId: string;
  @Element() element: HTMLElement;

  private flipCards;
  innerElement;

  componentDidLoad() {
    this.innerElement = this.element.querySelector('.eng-flip-card');
    this.initFlipCard();
  }

  initFlipCard() {
    const flipElement: any  = this.element.querySelector('.eng-flip');
    this.flipCards = flipElement.children;
    if (this.flipCards && this.flipCards.length > 2) {
      console.warn('Flip-card only supports 2 cards right now.');
    }

    flipElement.style.height = this.getOffset() + 'px';

    if (this.flipType === 'hover') {
      this.innerElement.classList.add('eng-flip-card-hover');
    }

    if (this.flipType === 'button' && this.flipButtonId) {
      let flipButton;
      if (this.flipButtonId) flipButton = document.querySelector(this.flipButtonId);
      if (flipButton) {
        flipButton.addEventListener("click", () => {
          this.flip();
        });
      }
    }

    if (this.flipCards && this.flipCards[0]) {
      this.flipCards[0].classList.add('eng-flip-card-front');
    }
    if (this.flipCards && this.flipCards[1]) {
      this.flipCards[1].classList.add('eng-flip-card-back');
    }
  }

  getOffset() {
    const flipElement: any  = this.element.querySelector('.eng-flip');
    let offset = 0; // flipElement.offsetHeight / 1.85;
    const digDeep = (element) => {
      if (element && element.children && element.children.length) {
        _.each(element.children, (child) => {
          if (!child.offsetHeight) {
            digDeep(child)
          } else {
            offset = child.offsetHeight * 1.16;
          }
        });
      }
    };
    digDeep(flipElement);
    return offset || flipElement.offsetHeight / 1.85;
  }

  @Listen('click')
  onClick() {
    if (this.flipType === 'click') {
      this.flip();
    }
  }

  @Method('flip')
  flip() {
    if (this.innerElement.classList.contains('eng-flip-card-flipped')) {
      this.innerElement.classList.remove('eng-flip-card-flipped');
    } else {
      this.innerElement.classList.add('eng-flip-card-flipped');
    }
  }

  render() {
    return(
      <div class="eng-flip-card-base">
        <div class="eng-flip-card" >
          <div class="eng-flip">
            <slot />
          </div>
        </div>
      </div>
    )
  }

}
