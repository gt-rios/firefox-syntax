"use babel";
"use strict";

import fs from "fs";
import path from "path";
import {CompositeDisposable} from "atom";
import {name as packageName} from "../package.json";

export default {

	subscriptions: null,

	activate(state) {
		this.subscriptions = new CompositeDisposable();
		this.subscriptions.add(atom.themes.onDidChangeActiveThemes(() => {
			this.subscriptions.add(atom.config.observe(`${packageName}.subtheme`, value => {
				this.apply(value);
			}));
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	apply(value) {
		let newData = `@import "colors/${value}";\n`,
		    file = path.join(__dirname, "..", "styles", "syntax-variables.less"),
		    oldData = fs.readFileSync(file, "utf8");

		if (newData !== oldData) {
			fs.writeFileSync(file, newData);
			this.reloadAllStylesheets();
		}
	},

	reloadAllStylesheets() {
		atom.themes.loadUserStylesheet();
		atom.themes.reloadBaseStylesheets();
		let ref = atom.packages.getActivePackages();

		for (let i = 0, len = ref.length; i < len; i++) {
			let pack = ref[i];
			pack.reloadStylesheets();
		}
	}
};
