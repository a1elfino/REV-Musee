
import {PRIMS}     from './prims.js' ; 
import {Visu}      from './visu.js' ;
import {SafeArray} from './safeArray.js' ;  

class Simu extends Visu {

	constructor(){
		super() ; 
		this.directory = {} ; 
		this.entities = new SafeArray() ; 
	}



	createWorld(data) {} // Méthode abstraite
	
	createEntity(name, Type, data){
		const entity = new Type(data) ;
		this.directory[name] = entity ;  
		this.entities.add(entity) ; 
		return entity ; 
	}
	
	removeEntity(entity){
		delete this.directory[name] ; 
		this.entities.remove(entity) ; 
	}
	
	findEntity(name){return this.directory[name] || null ; }
}

export {Simu}
