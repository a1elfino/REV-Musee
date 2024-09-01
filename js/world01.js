
import {PRIMS} from './prims.js' ; 
import {Simu}  from './simu.js' ; 

class World extends Simu {

	constructor(){
		super() ; 
	}

	requete_http(www, port, requete, foo){
		const entete = "http://" + www + ":" + port + "/" + requete ;
		loadJSON(entete, (res) => {
			const data = JSON.parse(res) ; 
			foo(data) ; 
		}) ;
	} 



	createWorld(data) {
		const scene = this.scene ;
		
		const light0 = new BABYLON.HemisphericLight("l0",new BABYLON.Vector3(1,1,0), scene);
        	const light1 = new BABYLON.HemisphericLight("l0",new BABYLON.Vector3(1,-1,0), scene);
        	light1.intensity = 0.2 ;

        	const light2 = new BABYLON.HemisphericLight("l0",new BABYLON.Vector3(1,-1,0), scene);
        	light2.intensity = 0.2 ;

		const sph01 = PRIMS.sphere("sph01", {}, scene) ; 
		const sol01 = PRIMS.ground("sol01", {}, scene) ; 

		const mat_rouge = PRIMS.standardMaterial("mat_rouge", {couleur: new BABYLON.Color3(1,0,0)}, scene) ; 
		const mat_vert  = PRIMS.standardMaterial("mat_vert", {couleur: new BABYLON.Color3(0,1,0)}, scene) ; 
		const mat_bleu  = PRIMS.standardMaterial("mat_bleu", {couleur: new BABYLON.Color3(0,0,1)}, scene) ; 

		const sph_X = PRIMS.sphere("sph_X", {materiau : mat_rouge}, scene) ;
		sph_X.position.set(5,0,0) ;  

		const sph_Y = PRIMS.sphere("sph_Y", {materiau : mat_vert}, scene) ; 
		sph_Y.position.set(0,5,0) ; 

		const sph_Z = PRIMS.sphere("sph_Y", {materiau : mat_bleu}, scene) ; 
		sph_Z.position.set(0,0,5) ; 

        	const mur_nord = PRIMS.wall("mur_nord",{largeur:30, hauteur:10}, scene) ; 
        	mur_nord.position.set(0,0,-15) ; 

        	const mur_sud = PRIMS.wall("mur_sud",{largeur:30, hauteur:10}, scene) ; 
        	mur_sud.position.set(0,0,15) ; 

        	const mur_ouest = PRIMS.wall("mur_ouest",{largeur:30, hauteur:10}, scene) ; 
        	mur_ouest.position.set(-15,0,0) ; 
        	mur_ouest.rotation.y = Math.PI/2 ;

        	const mur_est = PRIMS.wall("mur_est",{largeur:30, hauteur:10}, scene) ; 
        	mur_est.position.set(15,0,0) ; 
        	mur_est.rotation.y = Math.PI/2 ; 

        	const plafond = PRIMS.box("plafond",{largeur:30, profondeur:30, hauteur:0.1}, scene) ; 
        	plafond.position.set(0,10,0) ; 
        	
        	
		


		const iMax = 100 ; 
		let i = 0 ; 
		while (i < iMax){
			const sph = PRIMS.sphere("sph--"+i, {diametre:0.1}, scene) ; 
			const x = (0.5-Math.random())*0.5 ; 
			const z = (0.5-Math.random())*2 ; 
			const y = 1 + Math.random()*0.5; 

			sph.position.set(x,y,z) ; 

			i++ ; 
		}

		i = 0 ; 
		while (i < iMax){
			const sph = PRIMS.sphere("sph--"+i, {diametre:0.1}, scene) ; 
			const x = 10+ (0.5-Math.random())*0.5 ; 
			const z = 10 + (0.5-Math.random())*2 ; 
			const y = 1 + Math.random()*0.5; 

			sph.position.set(x,y,z) ; 

			i++ ; 
		}

		const socle01 = PRIMS.wall("socle01",{largeur:1, hauteur:1, epaisseur:1}, scene) ; 
		socle01.position.set(10,0,-10);
		i = 0 ; 
		while (i < iMax){
			const sph = PRIMS.sphere("sph--"+i, {diametre:0.1}, scene) ; 
			const x = (0.5-Math.random())*0.5 ; 
			const z = (0.5-Math.random())*2 ; 
			const y = 1.2 + Math.random()*0.5; 
			sph.parent = socle01 ; 

			sph.position.set(x,y,z) ; 

			i++ ; 
		}
		
		// ================================================================================
		const mur0 = PRIMS.wall("mur0",{largeur:10, hauteur:3.5}, scene) ; 
		mur0.position.set(-8,0,-8) ; 
		
		
		const mur1 = PRIMS.wall("mur1",{largeur:10, hauteur:3.5}, scene) ; 
		mur1.rotation.y = Math.PI/2 ; 
		mur1.parent = mur0 ; 
		
		mur0.rotation.y = Math.PI/3 ;
		
		// ===================================================================================
		
		const socle02 = PRIMS.wall("socle02", {hauteur:1, largeur:1, epaisseur:1}, scene);
		socle02.position.set(5,0,10) ; 
		
		i=0 ; 
		while(i<5){
			const sph = PRIMS.sphere("boule"+i,{diametre:0.1},scene) ;
			sph.position.set(i/6.0,1.2,-0.4) ; 
			sph.parent = socle02 ;  
			i += 1 ;
			
			const materiau = PRIMS.standardMaterial("mat"+i,{},scene) ;
			sph.material = materiau ; 
		}


    	}

}

export {World}
