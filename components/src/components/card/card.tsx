import {Component, Prop, Element} from '@stencil/core';
import _ from 'lodash';
import {EngageColor} from "../../global/color";

export interface EngICardItem {
  headerText?: string;
  footerText?: string;
  bodyText?: string;
  title?: string;
  name?: string;
  icon?: string;
  image?: string;
  action?();
  link?: string;
}

/*
* TODO:
* [ ] Tabs top and bottom (header, footer)
*
* */

@Component({
  tag: 'eng-card',
  styleUrl: 'card.scss'
})
export class EngageCard {

  @Element() element: HTMLElement;
  @Prop({ context: 'engageColor' }) engColor: EngageColor;
  @Prop() cardContent: EngICardItem[] = [];
  @Prop() type: 'static' | 'flip' | 'pass' = 'static';
  @Prop() flipType: 'hover' | 'click' | 'button' = 'hover';
  @Prop() flipButtonId: string;
  @Prop() cardBg: string;
  @Prop() disableHeader: boolean = false;
  @Prop() disableFooter: boolean = false;
  @Prop() simple: boolean = false;

  flipCards;


  componentDidLoad(): void {
    if (this.type === 'flip') this.setupFlipCard();
  }

  setupFlipCard() {

    this.flipCards = this.element.querySelectorAll('.eng-flip');
    console.log('hit set card dimensions');
    _.each(this.flipCards, (flipCard) => {
      if (flipCard) {
        console.log(flipCard.children)
        //set height
        flipCard.style.height =                         flipCard.children[0].offsetHeight + 'px';
        flipCard.children[0].style.height =             flipCard.children[0].offsetHeight + 'px';
        flipCard.children[1].style.height =             flipCard.children[0].offsetHeight + 'px';
        flipCard.children[0].children[0].style.height = flipCard.children[0].offsetHeight + 'px';
        flipCard.children[1].children[0].style.height = flipCard.children[0].offsetHeight + 'px';

        //add hover
        if (this.flipType === 'hover') {
          const flipCardParent = flipCard.parentElement;
          flipCardParent.classList.add('eng-flip-card-hover');
        }

        //add click
        if (this.flipType === 'click') {
          flipCard.addEventListener("click", () => {
            if (flipCard.parentElement.classList.contains('eng-flip-card-flipped')) {
              flipCard.parentElement.classList.remove('eng-flip-card-flipped');
              console.log('flipCard', flipCard);
            } else {
              flipCard.parentElement.classList.add('eng-flip-card-flipped');
              console.log('flipCard2', flipCard);
            }
          });
        }

        //add button
        if (this.flipType === 'button') {
          let flipButton;
          if (this.flipButtonId) flipButton = document.querySelector(this.flipButtonId);
          if (flipButton) {
            console.log('flipButton', flipButton);
            flipButton.addEventListener("click", () => {
              if (flipCard.parentElement.classList.contains('eng-flip-card-flipped')) {
                flipCard.parentElement.classList.remove('eng-flip-card-flipped');
                console.log('flipCard', flipCard);
              } else {
                flipCard.parentElement.classList.add('eng-flip-card-flipped');
                console.log('flipCard2', flipCard);
              }
            });
          }
        }
      }

    });

    // this.flipCard = document.querySelector('.flip');
    // if (this.flipCard) {
    //     this.flipCard.style.height = this.flipCard.children[0].offsetHeight + 'px';
    //     this.flipCard.children[0].style.height = this.flipCard.children[0].offsetHeight + 'px';
    //     this.flipCard.children[1].style.height = this.flipCard.children[0].offsetHeight + 'px';
    //   this.flipCard.children[0].children[0].style.height = this.flipCard.children[0].offsetHeight + 'px';
    //   this.flipCard.children[1].children[0].style.height = this.flipCard.children[0].offsetHeight + 'px';
    // }
  }

  isSimple(classes = '') {
    return this.simple ? '' : classes;
  }

  // renderTabsNav() {
  //   return (
  //     <eng-tabs></eng-tabs>
  //   );
  // }

  renderHeader(cardContent: EngICardItem, location = '') {
    return (
      <div class={this.isSimple('card-header')}>
        <slot name={`card-header${location}`}/>
        {cardContent && cardContent.headerText ?
          cardContent.headerText : null}
      </div>
    );
  }

  renderFooter(cardContent: EngICardItem, location = '') {
    return (
      <div class={this.isSimple('card-footer')}>
        <slot name={`card-footer${location}`}/>
        {cardContent && cardContent.footerText ?
          cardContent.footerText : null}
      </div>
    );
  }

  renderCard(cardContent: EngICardItem, location = '') {
    if (!cardContent) {
      cardContent = this.cardContent[0];
    }
    return [
      <div
        class={this.isSimple('card') + ' ' + this.engColor.classContextBg(this.cardBg) + ' ' + this.engColor.determineTextColor(this.cardBg)}
        style={{...this.engColor.hexContextBg(this.cardBg)}}
      >
        {!this.disableHeader ?
          this.renderHeader(cardContent, location)
        : null}
        <div class="card-body">
          <slot name={`card-body${location}`} />
          <p>{cardContent && cardContent.bodyText ?
            cardContent.bodyText : null }</p>
        </div>
        {!this.disableFooter ?
          this.renderFooter(cardContent, location)
          : null}
      </div>
    ];
  }

  renderFlipCard() {
    return [
      <div>
        <div class="eng-flip-card" >
          <div class="eng-flip">
            <div class="eng-flip-card-front">
              {this.renderCard(this.cardContent[0])}
            </div>
            <div class="eng-flip-card-back">
              {this.renderCard(this.cardContent[1], '-back')}
            </div>
          </div>
        </div>
      </div>
    ];
  }

  renderSimpleCard() {
    return <slot name="card-simple" />;
  }

  render() {
    return [
      this.type === 'static' && this.renderCard(this.cardContent[0]),
      this.type === 'flip' && this.renderFlipCard(),
      this.type === 'pass' && <div class="card"> <slot /> </div>,
      this.renderSimpleCard()
    ];
  }
}
