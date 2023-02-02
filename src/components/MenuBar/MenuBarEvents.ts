import * as React from 'react';
import { Emitter } from './utils/emitter';

type Events = {
  mouseover: (event: React.MouseEvent) => void;
};

export default class MenuBarEvents {
  private _eventEmitter = new Emitter<Events>();

  constructor() {
    // eventEmitter.setMaxListeners(Infinity);
  }

  public addMouseOverListener(listener: any) {
    this._eventEmitter.on('mouseover', listener);
  }

  public removeMouseOverListener(listener: any) {
    this._eventEmitter.off('mouseover', listener);
  }

  public emitMouseOver(event: React.MouseEvent) {
    this._eventEmitter.emit('mouseover', event);
  }
}
