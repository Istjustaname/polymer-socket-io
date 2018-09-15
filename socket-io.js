import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

window.__getSocket = (ep) => {

  console.log(ep)
  const endpoint = ep || '';

  if (!window.__SOCKETS) {
    window.__SOCKETS = {};
  }

  if (!window.__SOCKETS[endpoint]) {
    window.__SOCKETS[endpoint] = io(endpoint);
  }

  return window.__SOCKETS[endpoint];
};

class SocketIO extends PolymerElement {
  static get properties() {
    return {
      endpoint: {
        type: String,
        value: undefined
      },
      connected: {
        type: Boolean,
        readOnly: true,
        notify: true,
        value: false,
        reflectToAttribute: true
      },
      events: {
        type: Object,
        value: {}
      }
    }
  }

  constructor() {
    super();

    this.socket = null;
  }

  connectedCallback() {
    console.log("Connection In Progress");
    var head = document.getElementsByTagName("head")[0] || document.documentElement;
    var script = document.createElement("script");
    script.src = this._getClientUrl(this.endpoint);
    // Handle Script loading
    var done = false;
    // Attach handlers for all browsers
    var _this = this;
    script.onload = script.onreadystatechange = function() {
      if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
        done = true;
        console.log('Finished Loading Socket-IO Script');


        _this.socket = window.__getSocket(_this.endpoint);
        _this.socket.on('connected', () => _this._onConnect());
        _this.socket.on('disconnected', () => _this._onDisconnect());

        Object.keys(_this.events).forEach((key) => {
          _this.socket.on(key, _this.events[key]);
        })
      }
    };

    head.append(script);
  }
  

  _getClientUrl (ep) {
    const endpoint = ep || '';
    if (endpoint.slice(-1) === '/') {
      return endpoint + 'socket.io/socket.io.js';
    }
    return endpoint + '/socket.io/socket.io.js';
  }

  emit(key, value) {
    this.socket.emit(key, value);
  }

  _onConnect() {
    this._setConnected(true);
  }

  _onDisconnect() {
    this._setConnected(false);
  }
}

window.customElements.define('socket-io', SocketIO);
