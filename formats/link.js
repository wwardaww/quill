import Inline from '../blots/inline';

class Link extends Inline {
  static create(opts) {
    let value = opts;
    let target = false;
    if (typeof value === 'object') {
      target = opts.target;
      value = opts.value;
    }
    const node = super.create(value);
    node.setAttribute('href', this.sanitize(value));
    if (target === false) {
      if (value.startsWith('http') || value.startsWith('https')) {
        node.setAttribute('target', '_blank');
      } else {
        node.setAttribute('target', '_self');
      }
    } else {
      node.setAttribute('target', target);
    }
    return node;
  }
  static formats(domNode) {
    if (domNode.hasAttribute('target')) {
      const opts = {
        value: domNode.getAttribute('href'),
        target: domNode.getAttribute('target'),
      };
      return opts;
    }
    return domNode.getAttribute('href');
  }

  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }

  format(name, value) {
    if (name !== this.statics.blotName || !value) {
      if (typeof value === 'object' && value !== null) {
        super.format(name, value.value);
        this.domNode.setAttribute('target', value.target);
      } else {
        super.format(name, value);
      }
    } else {
      if (typeof value === 'object' && value !== null) {
        this.domNode.setAttribute('href', this.constructor.sanitize(value.value));
        this.domNode.setAttribute('target', value.target);
      } else {
        this.domNode.setAttribute('href', this.constructor.sanitize(value));
      }
    }
  }
}
Link.blotName = 'link';
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';
Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel'];

function sanitize(url, protocols) {
  const anchor = document.createElement('a');
  anchor.href = url;
  const protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}

export { Link as default, sanitize };
