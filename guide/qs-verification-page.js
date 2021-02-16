
/**
  * `qs-verification-page`
  * 
  *   
  *
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  *
  **/
  

import {AppElement, html} from '@longlost/app-core/app-element.js';
import {wait}             from '@longlost/app-core/utils.js';
import htmlString         from './qs-verification-page.html';
import '@polymer/iron-icon/iron-icon.js';
import '../shared/app-shell-icons.js';


class QuickStartVerificationPage extends AppElement {

  static get is() { return 'qs-verification-page'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {

      current: String,

      page: String,

      user: Object,

      _animateIconClass: {
        type: String,
        value: ''
      },

      _isCurrentPage: {
        type: Boolean,
        computed: '__computeIsCurrentPage(current, page)'
      }

    };
  }


  static get observers() {
    return [
      '__updateAnimateIconClass(_isCurrentPage)'
    ];
  }


  __computeIsCurrentPage(current, page) {

    if (!current || !page) { return false; }

    return current === page; 
  }


  async __updateAnimateIconClass(isCurrentPage) {

    if (isCurrentPage) {

      await wait(500);
      
      this._animateIconClass = 'animate-send';
    }
  }

}

window.customElements.define(QuickStartVerificationPage.is, QuickStartVerificationPage);
