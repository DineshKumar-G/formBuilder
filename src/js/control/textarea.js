import control from '../control';

/**
 * Text input class
 * Output a <input type="text" ... /> form element
 */

function setTextAreaHeight(el) {
  el.style.height = 'auto';
  el.style.cssText = `height: ${el.scrollHeight}px !important`;
}

export default class controlTextarea extends control {

  /**
   * class configuration
   */
  static get definition() {
    return {

      // mi18n custom mappings (defaults to camelCase type)
      mi18n: {
        textarea: 'textArea'
      }
    };
  }

  /**
   * build a text DOM element, supporting other jquery text form-control's
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    const {value = '', ...attrs} = this.config;
    this.field = this.markup('textarea', this.parsedHtml(value), attrs);
    if(!attrs['userData'] || !attrs['userData'][0]){
      return this.field;
    }
    const printAttrs = {
      ...attrs,
      innerText: attrs['userData'][0],
      className: "print-display",
    }
    this.field = [...this.field, this.markup('div', this.parsedHtml(value), printAttrs)]
    return this.field;
  }

  /**
  * onRender callback
  */
  onRender() {
    // Set userData if available
    if(this.config.userData){       
      $('#'+this.config.name).val(this.config.userData[0]);        
    }
    const doc = document.querySelectorAll('textarea.form-control');
    doc.forEach((el) => {
      setTextAreaHeight(el)
      el.addEventListener('input', () => {
        setTextAreaHeight(el)
      });
    });
  }
    
  /**
   * extend the default events to add a prerender for textareas
   * @param {String} eventType
   * @return {Function} prerender function
   */
  on(eventType) {
    if (eventType == 'prerender' && this.preview) {
      return (element) => {
        if (this.field) {
          element = this.field;
        }

        // if this is a preview, stop events bubbling up so the editor preview is clickable (and not draggable)
        $(element).on('mousedown', (e) => {
          e.stopPropagation();
        });
      };
    }
    return super.on(eventType);
  }
}

// register the following controls
control.register('textarea', controlTextarea);
control.register('textarea', controlTextarea, 'textarea');
