import {Component, Method, Prop, Element, Listen, State, Event, EventEmitter, Watch} from '@stencil/core';
import {ImageStyle, Size} from "../../../types/theme";
// import {EngageITab} from "../../../components/tabs/tabs";
// import _ from 'lodash';


export interface EngageIProfile {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  bio?: string;
  username?: string;
  image?: string;
  $image?: string;
}


/*
* TODO:
* */

@Component({
  tag: 'eng-profile-card',
  styleUrl: 'profile-card.scss'
})
export class EngageProfileCard {

  @Prop({ context: 'config' }) config: any;
  @Element() element;
  @Prop() value: EngageIProfile = {
    name: '',
    title: '',
    email: '',
  };
  @Prop() adapter;
  @Prop() type: 'create' | 'login' = 'login';
  @Prop() mode: 'edit' | 'view' = 'view';
  @Prop() imageStyle: ImageStyle = 'rounded';
  @Prop() size: Size = 'md';
  @Prop() headerBg: string;
  @Prop() simple: boolean = false;
  @Prop() social: boolean = false;
  @Prop() imageBorder: boolean = true;
  @Prop() canEdit: boolean;
  @Prop() noProfileMsg: string = 'No Profile Info';
  /* Social */
  // @Prop() facebook: string = '';
  // @Prop() google: string = '';
  // @Prop() twitter: string = '';
  // @Prop() linkedin: string = '';
  // @Prop() github: string = '';
  /*        */
  /* Enable */
  @Prop() enableName = true;
  @Prop() enableEmail = true;
  @Prop() enablePhone = true;
  @Prop() enableTitle = true;
  @Prop() enableBio = true;
  @Prop() enableImage = true;
  @Prop() enablePasswordChange = true;
  @Prop() enableUsername = false;
  /*        */
  @Event({eventName: 'engOnSave'}) onSave: EventEmitter;
  @State() _type;
  @State() _canEdit: boolean;
  @State() previewImage: string;
  @State() _mode: 'edit' | 'view' = 'view';
  @State() _value: EngageIProfile = {
    name: '',
    title: '',
    email: '',
  };
  private formElement;

  componentDidLoad() {
    this._type = this.type;
    this.formElement = this.element.querySelector('eng-form');
    this.watchValue();
    this.watchMode();
    this.watchCanEdit();
  }

  @Watch('value')
  watchValue() {
    this._value = this.value;
  }

  @Watch('canEdit')
  watchCanEdit() {
    this._canEdit = this.canEdit;
  }

  @Watch('mode')
  watchMode() {
    if (this.mode === 'edit' && this.canEdit === undefined) {
      this._canEdit = true;
    }
    this._mode = this.mode;
  }

  @Method('clear')
  clear() {
    if (!this.formElement) {
      this.formElement = this.element.querySelector('eng-form');
    }
    if (this.formElement) {
      this.formElement.reset();
    }
  }

  @Method('changePassword')
  changePassword() {
    this.element.querySelector('.modal-change-password').toggle();
  }

  @Method('save')
  save() {
    if (!this.formElement) {
      this.formElement = this.element.querySelector('eng-form');
    }
    if (this.formElement) {
      this.formElement.submit();
      this.onSave.emit();
    }
  }

  @Listen('engOnHeaderClick')
  onHeaderClick() {
    const uploadElement = this.element.querySelector('eng-upload');
    if (uploadElement) {
      uploadElement.select();
    }
  }

  @Listen('engOnFileSelect')
  onFileSelect(event) {
    if (event && event.detail && event.detail.status === 'selected') {
      this.previewImage = URL.createObjectURL(event.detail.files[0]);
    }
  }

  @Listen('engOnFabClick')
  onFabClick() {
    if (this._mode === 'edit') {
      this.save();
    }
    this.changeMode();
  }

  changeMode() {
    if (this._mode === 'view') {
      this._mode = 'edit';
    } else {
      this._mode = 'view';
    }
  }

  renderModeEdit() {
    return (
      <eng-form slot="media-body" type="save" value={this._value} adapter={this.adapter}>

        {this.enableName ? <eng-input
          label="Name"
          name="name"
          type="text"
          bind={this._value}
        /> : null}

        {this.enableUsername ? <eng-input
          label="Username"
          name="username"
          type="text"
          bind={this._value}
        /> : null}

        {this.enableTitle ? <eng-input
          label="Title"
          name="title"
          type="text"
          bind={this._value}
        /> : null}

        {this.enableEmail ? <eng-input
          label="Email"
          name="email"
          type="email"
          bind={this._value}
        /> : null}

        {this.enablePhone ? <eng-input
          label="Phone"
          name="phone"
          type="text"
          bind={this._value}
        /> : null}

        {this.enableBio ? <eng-input
          label="Bio"
          name="bio"
          type="textarea"
          bind={this._value}
        /> : null}

        {this.enableImage ? <eng-upload
          type="hidden"
          name="image"
          mainImage={true}
        /> : null}

        <slot name="edit-body" />

        <div class="row justify-content-center">
          {this.enablePasswordChange ?
            <eng-button context="info" outline={true} onClick={() => this.changePassword()}>Change Password</eng-button>
          : null }
        </div>

      </eng-form>
    );
  }

  renderModeView() {
    return (
      <div slot="media-body">
        {this._value && this._value.name ? <h4> {this._value.name} </h4> : null}
        {this._value && this._value.title ? <h5> {this._value.title} </h5> : null}
        {this._value && this._value.username ? <p> {this._value.username} </p> : null}
        {this._value && this._value.email ? <p> {this._value.email} </p> : null}
        {this._value && this._value.phone ? <p> {this._value.phone} </p> : null}
        {this._value && this._value.bio ? <p> {this._value.bio} </p> : null}
        <slot name="view-body" />
      </div>
    );
  }

  render() {
    if (!this._value) return (
      <h4>{this.noProfileMsg}</h4>
    );
    return [
      <eng-media-card
        class={`${this.imageBorder && this.enableImage ? 'eng-profile-border' : ''}`}
        headerStyle="profile"
        disableHeader={!this.enableImage}
        headerBg={this.headerBg}
        headerImage={this.previewImage || this._value.image || this._value.$image}
        profileIcon={`${this.enableImage && !(this._value.image || this._value.$image || this.previewImage) ? 'user' : ''}`}
        fab={`${this._canEdit && this._mode === 'view' ? 'edit' : this._canEdit && this._mode === 'edit' ? 'save' : ''}`}
        disableFooter={true}
      >
        {this._mode === 'edit' ? this.renderModeEdit() : this.renderModeView()}
        <eng-modal
          class="modal-change-password"
          headerTitle="Change Password"
        >

          <eng-input
            label="Password"
            name="password"
            type="password"
          />

          <eng-input
            label="Repeat Password"
            name="passwordRepeat"
            type="password"
          />

          <div slot="footer">
            <eng-button class="float-right">Change</eng-button>
          </div>
        </eng-modal>
      </eng-media-card>
    ];
  }
}
