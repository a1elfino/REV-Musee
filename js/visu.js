import { createPointerLock } from './pointerLock.js';
import { PRIMS } from './prims.js';

class Visu {

	constructor() {

		this.canvas = document.getElementById("renderCanvas");
		this.engine = new BABYLON.Engine(this.canvas, true);
		this.clock = 0.0;

		this.scene = new BABYLON.Scene();
		this.scene.useRightHandedSystem = true;
		this.scene.gravity = new BABYLON.Vector3(0, -9, 0);
		createPointerLock(this.scene);

		this.camera = PRIMS.camera("camera", {}, this.scene);
		this.scene.actionManager = new BABYLON.ActionManager(this.scene); // new 
		this.camera.attachControl(this.canvas, false);

		this.reticule = PRIMS.reticule("reticule", {}, this.scene);
		this.reticule.parent = this.camera;

		this.assets = {};

		const that = this;
		window.addEventListener("resize", () => { that.engine.resize(); })
	}

	go() {
		const that = this;
		this.engine.runRenderLoop(function () {
			const dt = that.engine.getDeltaTime() / 1000.0;
			that.clock += dt;
			that.update(dt);
			that.scene.render();
		});
	}

	createWorld(data) { }

	update(dt) { }

	registerAsset(name, foo, data) { this.assets[name] = foo(data); }

	removeAsset(name) { }

	findAsset(name, byDefault) { return this.assets[name] || byDefault; }
}

export { Visu }; 
