'use babel';

import fs from 'fs';
import path from 'path';
import { CompositeDisposable } from 'atom';
import { name as packageName } from '../package.json';

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.themes.onDidChangeActiveThemes(() => {
      this.subscriptions.add(atom.config.observe(`${packageName}.subtheme`, (value) => {
        this.apply(value);
      }));
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  apply(value) {
    const file = path.join(__dirname, '..', 'styles', 'syntax-variables.less');
    const oldData = fs.readFileSync(file, 'utf8');
    const newData = `@import "colors/${value}";\n`;

    if (oldData !== newData) {
      fs.writeFileSync(file, newData);
      this.reloadAllStylesheets();
    }
  },

  reloadAllStylesheets() {
    atom.themes.loadUserStylesheet();
    atom.themes.reloadBaseStylesheets();
    const packages = atom.packages.getActivePackages();

    for (let i = 0; i < packages.length; i++) {
      packages[i].reloadStylesheets();
    }
  }

};
