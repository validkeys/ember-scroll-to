import Em from 'ember';

const DURATION = 750;
const EASING   = 'swing';
const OFFSET   = 0;

const { RSVP } = Em;

export default Em.Service.extend({

  // ----- Static properties -----
  duration: DURATION,
  easing:   EASING,
  offset:   OFFSET,


  // ----- Computed properties -----
  scrollable: Em.computed(function() {
    return Em.$('html, body');
  }),


  // ----- Methods -----
  getJQueryElement (target) {
    const jQueryElement = Em.$(target);

    if (!jQueryElement) {
      Em.Logger.warn("element couldn't be found:", target);
      return;
    }

    return jQueryElement;
  },

  getScrollableTop (scrollable = null) {
    // because the target elements top is calculated relative to the document,
    // and if the scrollable container is not the document,
    // we need to normalize the target elements top based on the top and current scrolled position of the scrollable
    let container = scrollable || this.get("scrollable");
    if (container.offset().top) {
      return container.scrollTop() - container.offset().top;
    } else {
      return 0;
    }
  },

  getVerticalCoord ({ target, offset = 0, scrollable = null} = {}) {
    const  jQueryElement = this.getJQueryElement(target);
    return this.getScrollableTop(scrollable) + jQueryElement.offset().top + offset;
  },

  scrollVertical (target, opts = {}) {
    return new RSVP.Promise((resolve, reject) => {

      const scrollable = opts.scrollable
        ? Em.$(opts.scrollable)
        : this.get('scrollable');

      scrollable
        .animate(
          {
            scrollTop: this.getVerticalCoord({
              target,
              offset: opts.offset,
              scrollable: scrollable
            })
          },
          opts.duration || this.get('duration'),
          opts.easing || this.get('easing'),
          opts.complete
        )
        .promise()
        .then(resolve, reject);
    });
  }
});
