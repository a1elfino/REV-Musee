

function Fabrique(monde){
    this.monde = monde ;
}

Fabrique.prototype.fabriquer = function(){

    const scene = this.monde.scene ;
    scene.ambientColor = new BABYLON.Color3(0.5,0.7,0.3) ; 

    this.monde.camera = this.creerCamera("camera",{},scene) ;     

    const materiau1 = this.creerMateriauStandard("mat1",{texture:"./assets/240.jpg"},scene) ; 
    const materiau2 = this.creerMateriauStandard("mat_sol",{texture:"./assets/marble.jpg",uScale:100,vScale:100},scene);
 

    const ciel = this.creerCiel("ciel",{},scene);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1,1,0), this.monde.scene) ; 

    const sphere = this.creerSphere("sph1", {}, scene) ; 
    const sph    = this.creerSphere("sph2",{},scene);
    sph.position.y = 0.5 ; 
    this.sph1 = this.creuser(sphere,sph);

    const mur1 = this.creerCloison("wall-i",{materiau:materiau1}, scene) ; 
    mur1.position = new BABYLON.Vector3(2.5,0,0) ; 
    const mur2 = this.creerCloison("wall-2",{materiau:materiau1}, scene) ; 
    mur2.rotation.y = Math.PI/2 ;
    mur2.position.z = 2.5 ; 

    const poster = this.creerPoster("poster01",{tableau:"./assets/4.jpg"},scene);
    poster.parent = mur2 ; 
    poster.position.y = 1.7 ; 
    poster.position.z = 0.1 ; 
    poster.rotation.y = Math.PI ; 
    const sol = this.creerSol("sol",{materiau:materiau2},scene);

    const sphere01 = BABYLON.MeshBuilder.CreateSphere("sph0",{diameter:0.2},scene);
    sphere01.position = new BABYLON.Vector3(1,1,1) ; 

}


Fabrique.prototype.creerCamera = function(name,data,scene){

    const velocity = data.velocity || 2.0 ; 
    const inertia  = data.inertia  || 0 ; 
    const fov      = data.fov      || 0.8 ; 
    const gravity  = data.gravity  || true ; 

   
    const canvas = scene.getEngine().getRenderingCanvas() ;
    const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(2,1.7,2), scene) ; 
    camera.attachControl(canvas, true) ; 
    camera.setTarget(BABYLON.Vector3.Zero()) ; 

    camera.applyGravity = gravity ; 
    camera.checkCollisions = true ;

    camera.minZ = 0.1 ; 

    camera.speed = velocity ; 
    camera.fov = fov ; 
    camera.inertia = inertia ; 
    camera.angularSensibility = 350; 

    return camera ;    
}

Fabrique.prototype.creerSol = function(nom,options,scn){
	options = options || {} ; 
	const taille   = options.taille   || 500.0 ; 
	let materiau = options.materiau || null ;
	
	const sol = BABYLON.Mesh.CreateGround(name,220.0,220.0,2.0,scn) ;
	
	if(materiau){
		sol.material = materiau ; 
	} else {
		materiau = new BABYLON.StandardMaterial("materiau-defaut-" + name, scn) ; 
		materiau.diffuseColor = new BABYLON.Color3(1.0,0.0,0.0) ;   
		sol.material = materiau ; 
	}

    sol.checkCollisions = true ;
	
	return sol ; 
}

Fabrique.prototype.creerCiel = function(nom,options,scene){
    const skyMaterial = new BABYLON.StandardMaterial("mat_skybox", scene);
    skyMaterial.backFaceCulling = false ;
    skyMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox/skybox", scene);
    skyMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyMaterial.diffuseColor = new BABYLON.Color3(0,0,0);
    skyMaterial.specularColor = new BABYLON.Color3(0,0,0);

    const skyBox = BABYLON.Mesh.CreateBox("skybox",100,scene);
    skyBox.material = skyMaterial ;

    return skyBox ;
}

Fabrique.prototype.creerMateriauStandard = function(nom, options,scn){
	let couleur = options.couleur || null ; 
	let texture = options.texture || null ; 
	let uScale  = options.uScale  || 1.0 ; 
	let vScale  = options.vScale  || 1.0 ; 

	let materiau = new BABYLON.StandardMaterial(nom,scn) ; 
	if(couleur != null) materiau.diffuseColor = couleur ; 
	if(texture!= null){
		materiau.diffuseTexture = new BABYLON.Texture(texture,scn) ; 
		materiau.diffuseTexture.uScale = uScale ; 
		materiau.diffuseTexture.vScale = vScale ; 
	}
	return materiau ; 
}

Fabrique.prototype.creerSphere = function(nom,opts,scn){

	let options  = opts || {} ; 
	let diametre = opts.diametre || 1.0 ; 
	let materiau = opts.materiau || null ; 
	
	if(materiau == null){
		materiau = new BABYLON.StandardMaterial("blanc",scn) ;
		materiau.diffuseColor = new BABYLON.Color3(1.0,1.0,1.0) ; 
	}

	let sph = BABYLON.Mesh.CreateSphere(nom,16,diametre,scn) ;
	sph.material              = materiau

	return sph;
}


Fabrique.prototype.creerPoster = function(nom,opts,scn){

	let options = opts || {} ; 
	let hauteur = options["hauteur"] || 1.0 ; 
	let largeur = options["largeur"] || 1.0 ; 	
	let textureName = options["tableau"] || ""; 

	var group = new BABYLON.TransformNode("group-"+nom)
	var tableau1 = BABYLON.MeshBuilder.CreatePlane("tableau-" + nom, {width:largeur,height:hauteur}, scn);
	var verso = BABYLON.MeshBuilder.CreatePlane("verso-" + nom, {width:largeur,height:hauteur}, scn);
	tableau1.parent = group ; 
	tableau1.position.z = -0.01 ; 
	verso.parent = group ; 
	verso.rotation.y = Math.PI ; 

	var mat = new BABYLON.StandardMaterial("tex-tableau-" + nom, scn);
	mat.diffuseTexture = new BABYLON.Texture(textureName, scn);
	tableau1.material = mat;

	tableau1.checkCollisions = true;

	return group ; 

}

Fabrique.prototype.creerCloison = function(nom,opts,scn){
	
	let options   = opts || {} ; 
	let hauteur   = options.hauteur || 3.0 ; 
	let largeur   = options.largeur || 5.0 ; 
	let epaisseur = options.epaisseur || 0.1 ;

	let materiau   = options.materiau || new BABYLON.StandardMaterial("materiau-pos"+nom,scn); 

    	let groupe = new BABYLON.TransformNode("groupe-"+nom) ; 

	let cloison = BABYLON.MeshBuilder.CreateBox(nom,{width:largeur,height:hauteur,depth:epaisseur},scn) ;
	cloison.material = materiau ; 
	cloison.parent = groupe ; 
	cloison.position.y = hauteur / 2.0 ; 

    cloison.checkCollisions = true ;

    return groupe ;  
}

Fabrique.prototype.creuser = function(mesh0, mesh1){
    const csg0 = BABYLON.CSG.FromMesh(mesh0);
    const csg1 = BABYLON.CSG.FromMesh(mesh1) ; 
    csg0.subtractInPlace(csg1);
    const csgMesh = csg0.toMesh() ;
    mesh0.dispose() ; 
    mesh1.dispose() ; 
    return csgMesh ;  
}









export {Fabrique} ; 
