

import {Fabrique} from './fabrique.js' ; 
import {createPointerLock} from './pointerLock.js' ; 


window.addEventListener("DOMContentLoaded", ()=> {
        const monde = new Monde();
        const fabrique = new Fabrique(monde) ; 
        fabrique.fabriquer() ; 
        monde.go() ; 
  }
) ; 



function Monde(){

    this.canvas = document.getElementById("renderCanvas") ; 
    this.engine = new BABYLON.Engine(this.canvas, true) ; 
    this.clock  = 0.0 ; 

    this.scene  = new BABYLON.Scene() ; 
    this.scene.useRightHandedSystem=true;
    this.scene.gravity = new BABYLON.Vector3(0,-9,0) ; 
    createPointerLock(this.scene) ; 
    
    this.camera = PRIMS.camera("camera",{}, this.scene) ; 

    /*
    this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(2,1.7,2), this.scene) ; 
    this.camera.attachControl(this.canvas, true) ; 
    this.camera.setTarget(BABYLON.Vector3.Zero()) ; 
    */

    const that = this ;


    window.addEventListener("resize", ()=>{that.engine.resize();})
}

Monde.prototype.go = function(){
    const that = this ; 
    this.engine.runRenderLoop(function(){
        const dt = that.engine.getDeltaTime()/1000.0 ; 
        that.clock += dt ; 
        that.scene.render() ; 
    });
}


