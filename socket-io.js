import {PolymerElement, html} from '@polymer/polymer';
import "socket.io-client/dist/socket.io.js";

window.__getSocket = (ep) => {
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
    this.socket = window.__getSocket(this.endpoint);

    this.socket.on('connected', () => this._onConnect());
    this.socket.on('disconnected', () => this._onDisconnect());

    Object.keys(this.events).forEach((key) => {
      this.socket.on(key, this.events[key]);
    })
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

customElements.define('socket-io', SocketIO);
