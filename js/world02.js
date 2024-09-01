
import {PRIMS} from './prims.js' ; 
import {Simu}  from './simu.js' ; 

class World extends Simu {

	constructor(){
		super() ; 
	}



	createWorld(data) {
		const scene = this.scene ;
		
		const light0 = new BABYLON.HemisphericLight("l0",new BABYLON.Vector3(1,1,0), scene);
		
		const sph01 = PRIMS.sphere("sph01", {}, scene) ; 
		const sol01 = PRIMS.meadow("sol01", {}, scene) ; 
	}
}

export {World}
