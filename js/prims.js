import { World } from './world.js';


function creerScene() {
	var scn = new BABYLON.Scene(engine);
	scn.gravity = new BABYLON.Vector3(0, -9.8, 0);
	scn.collisionsEnabled = true;
	return scn;
}


function creerCamera(name, options, scn) {
	// console.log("creation camera");
	// Création de la caméra
	// =====================

	let camera = new BABYLON.UniversalCamera(name, new BABYLON.Vector3(10, 1.7, 5), scn);
	camera.setTarget(new BABYLON.Vector3(0.0, 0.7, 0.0));

	camera.minZ = 0.05;

	// new code : 
	// let camMesh = BABYLON.MeshBuilder.CreateBox("camMesh", { size: 0.5 }, scn);
	// camMesh.parent = camera;
	// camMesh.isPointerBlocker = false;
	// camMesh.actionManager = new BABYLON.ActionManager(scn);
	// end 

	camera.checkCollisions = true;
	camera.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
	camera.applyGravity = true;
	camera.keysUp = [90, 38];
	camera.keysDown = [40, 83];
	camera.keysLeft = [81, 37];
	camera.keysRight = [68, 39];
	camera.inertia = 0.01;
	camera.angularSensibility = 1000;


	return camera
}


function creerReticule(nom, opts, scn) {
	const reticule = BABYLON.MeshBuilder.CreateSphere("reticule", { segments: 4, diameter: 0.0025 }, scn);
	const retMat = new BABYLON.StandardMaterial("reticuleMat", scn);
	retMat.emissiveColor = BABYLON.Color3.Red();
	retMat.specularColor = BABYLON.Color3.Black();
	retMat.diffuseColor = BABYLON.Color3.Black();
	reticule.material = retMat;
	reticule.isPickable = false;
	reticule.position.z = 0.3;

	return reticule;
}

function creerCiel(nom, options, scene) {
	const skyMaterial = new BABYLON.StandardMaterial("mat_skybox", scene);
	skyMaterial.backFaceCulling = false;
	skyMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox/skybox", scene);
	skyMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

	const skyBox = BABYLON.Mesh.CreateBox("skybox", 100, scene);
	skyBox.material = skyMaterial;

	return skyBox;
}

function creerSol(name, options, scn) {
	options = options || {};
	const width = options.largeur || 100.0;
	const height = options.profondeur || width;

	const subdivisions = Math.round(width / 10);

	let materiau = options.materiau || null;

	const sol = BABYLON.MeshBuilder.CreateGround(name, { width, height, subdivisions }, scn);

	if (materiau) {
		sol.material = materiau;
	} else {
		materiau = new BABYLON.StandardMaterial("materiau-defaut-" + name, scn);
		materiau.diffuseColor = new BABYLON.Color3(1.0, 0.8, 0.6);
		sol.material = materiau;
	};

	sol.checkCollisions = true;

	return sol;

}

function creerPrairie(name, options, scn) {
	let sol = BABYLON.Mesh.CreateGround(name, 220.0, 220.0, 2.0, scn);
	sol.checkCollisions = true;
	sol.material = new BABYLON.StandardMaterial("blanc", scn);
	// sol.material.diffuseColor  = new BABYLON.Color3(1.0,0,0) ;
	sol.material.diffuseTexture = new BABYLON.Texture('./assets/textures/grass.png', scn);
	sol.material.specularTexture = new BABYLON.Texture('./assets/textures/grass.png', scn);
	sol.material.emissiveTexture = new BABYLON.Texture('./assets/textures/grass.png', scn);
	sol.material.ambientTexture = new BABYLON.Texture('./assets/textures/grass.png', scn);
	sol.material.diffuseTexture.uScale = 10.0;
	sol.material.diffuseTexture.vScale = 10.0;
	sol.material.specularTexture.uScale = 10.0;
	sol.material.specularTexture.vScale = 10.0;
	sol.material.emissiveTexture.uScale = 10.0;
	sol.material.emissiveTexture.vScale = 10.0;
	sol.material.ambientTexture.uScale = 10.0;
	sol.material.ambientTexture.vScale = 10.0;
	sol.receiveShadows = true;
	sol.metadata = { "type": 'ground' }
	return sol
}

function creerMateriauStandard(nom, options, scn) {
	let couleur = options.couleur || null;
	let texture = options.texture || null;
	let uScale = options.uScale || 1.0;
	let vScale = options.vScale || 1.0;

	let materiau = new BABYLON.StandardMaterial(nom, scn);
	if (couleur != null) materiau.diffuseColor = couleur;
	if (texture != null) {
		materiau.diffuseTexture = new BABYLON.Texture(texture, scn);
		materiau.diffuseTexture.uScale = uScale;
		materiau.diffuseTexture.vScale = vScale;
	}
	return materiau;
}


function creerSphere(nom, opts, scn) {

	let options = opts || {};
	let diametre = opts.diametre || 1.0;
	let materiau = opts.materiau || null;

	if (materiau == null) {
		materiau = new BABYLON.StandardMaterial("blanc", scn);
		materiau.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
	}

	let sph = BABYLON.Mesh.CreateSphere(nom, 16, diametre, scn);
	sph.material = materiau

	return sph;

}


function creerBoite(nom, opts, scn) {
	let options = opts || {};
	let width = opts.largeur || 1.0;
	let height = opts.hauteur || 1.0;
	let depth = opts.profondeur || 1.0;
	let materiau = opts.materiau || null;

	if (materiau == null) {
		materiau = new BABYLON.StandardMaterial("blanc", scn);
		materiau.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);

	}

	let box = BABYLON.MeshBuilder.CreateBox(nom, { width, height, depth }, scn);
	box.material = materiau

	return box;
}

function creerPoster(nom, opts, scn) {

	let options = opts || {};
	let hauteur = options["hauteur"] || 1.0;
	let largeur = options["largeur"] || 1.0;
	let textureName = options["tableau"] || "";

	var group = new BABYLON.TransformNode("group-" + nom)
	var tableau1 = BABYLON.MeshBuilder.CreatePlane("tableau-" + nom, { width: largeur, height: hauteur }, scn);
	var verso = BABYLON.MeshBuilder.CreatePlane("verso-" + nom, { width: largeur, height: hauteur }, scn);
	tableau1.parent = group;
	tableau1.position.z = -0.01;
	verso.parent = group;
	verso.rotation.y = Math.PI;

	var mat = new BABYLON.StandardMaterial("tex-tableau-" + nom, scn);
	mat.diffuseTexture = new BABYLON.Texture(textureName, scn);
	tableau1.material = mat;

	tableau1.checkCollisions = true;

	return group;

}

function creerCloison(nom, opts, scn) {

	let options = opts || {};
	let hauteur = options.hauteur || 3.0;
	let largeur = options.largeur || 5.0;
	let epaisseur = options.epaisseur || 0.1;

	let materiau = options.materiau || new BABYLON.StandardMaterial("materiau-pos" + nom, scn);

	let groupe = new BABYLON.TransformNode("groupe-" + nom);

	let cloison = BABYLON.MeshBuilder.CreateBox(nom, { width: largeur, height: hauteur, depth: epaisseur }, scn);
	cloison.material = materiau;
	cloison.parent = groupe;
	cloison.position.y = hauteur / 2.0;

	cloison.checkCollisions = true;

	return groupe;
}

function creuser(mesh0, mesh1) {
	const csg0 = BABYLON.CSG.FromMesh(mesh0);
	const csg1 = BABYLON.CSG.FromMesh(mesh1);
	csg0.subtractInPlace(csg1);
	const csgMesh = csg0.toMesh();
	mesh0.dispose();
	mesh1.dispose();
	return csgMesh;
}
// ###################################################################### //
// combinaison function
function OutsideWalls(materiau) {
	var cloisonNord = creerCloison("cloisonNord", { hauteur: 10.0, largeur: 30.0, materiau: materiau });
	cloisonNord.position = new BABYLON.Vector3(-15.0, 0.0, 0.0);
	cloisonNord.rotation.y = Math.PI / 2;

	var cloisonEst = creerCloison("cloisonEst", { hauteur: 10.0, largeur: 30.0, materiau: materiau });
	cloisonEst.position = new BABYLON.Vector3(0.0, 0.0, 15.0);

	var cloisonSud = creerCloison("cloisonSud", { hauteur: 10.0, largeur: 30.0, materiau: materiau });
	cloisonSud.position = new BABYLON.Vector3(15.0, 0.0, 0.0);
	cloisonSud.rotation.y = Math.PI / -2;

	var cloisonOuest = creerCloison("cloisonOuest", { hauteur: 10.0, largeur: 30.0, materiau: materiau });
	cloisonOuest.position = new BABYLON.Vector3(0.0, 0.0, -15.0);

	return [cloisonNord, cloisonEst, cloisonSud, cloisonOuest];
}
function CreateMur(materiau) {
	var cloisonMur1 = creerCloison("cloisonMur1", { hauteur: 5.0, largeur: 15.0, materiau: materiau });
	cloisonMur1.position = new BABYLON.Vector3(-7.5, 0.0, -5.0);

	var cloisonMur2 = creerCloison("cloisonMur2", { hauteur: 5.0, largeur: 15.0, materiau: materiau });
	cloisonMur2.position = new BABYLON.Vector3(-7.5, 0.0, 5.0);

	return [cloisonMur1, cloisonMur2]

}
// escalier function
function CreateEscalier(materiaus) {
	var materiauPlatform = materiaus.materiauPlatform;
	var materiau = materiaus.materiau;
	var pathTextureMur = "assets/textures/wall.jpg";

	var materiauinvisible = creerMateriauStandard("mat-cloison", { texture: pathTextureMur });
	materiauinvisible.alpha = 0;

	var epaisseur = 0.05;

	// Creation des escaliers - only the left staircase
	var i = 0;
	// les parties verticales
	for (i = 0; i < 10; i++) {
		var escalierV = creerCloison("escalierV-" + i, { hauteur: 0.5, largeur: 3, epaisseur: epaisseur, materiau: materiau, collision: false });
		escalierV.rotation.y = Math.PI / 2;
		escalierV.position = new BABYLON.Vector3(8 - (i / 2), i / 2, -13.5);
	}

	// les parties horizontales
	for (i = 1; i < 10; i++) {
		var escalierH = creerCloison("escalierH-" + i, { hauteur: 0.5, largeur: 3, epaisseur: epaisseur, materiau: materiau, collision: false });
		escalierH.rotation.x = Math.PI / 2;
		escalierH.rotation.y = Math.PI / 2;
		escalierH.position = new BABYLON.Vector3(8 - (i / 2), i / 2, -13.5);
	}

	// Creation des rampes largeur
	var left_rampe = creerCloison("left_rampe", { hauteur: 7.25, largeur: 3, materiau: materiauinvisible });
	left_rampe.rotation.y = Math.PI / 2;
	left_rampe.rotation.x = -0.8;
	left_rampe.position = new BABYLON.Vector3(8.75, 0, -13.5);
	left_rampe.checkCollisions = true;

	var p = 3;
	var l = 3.48;
	var x = l / 2;
	var y = 5;
	var z = 15 - (p / 2);
	var w = 0.05;

	// Creation des platform des escaliers - only the left platform
	var left_platform = creerSol("asc-plat-3", { profondeur: p, largeur: l, materiau: materiauPlatform });
	left_platform.position = new BABYLON.Vector3(x, y, -z);
	left_platform.checkCollisions = true;

	var left_platform_back = creerSol("asc-plat-3", { profondeur: p, largeur: l, materiau: materiauPlatform });
	left_platform_back.position = new BABYLON.Vector3(x, y - w, -z);
}
// railing 
function CreateRailing() {

	var materiauRampe = creerMateriauStandard(
		"mat-plaque",
		{ texture: "assets/textures/railing02.png" }
	);

	// materiauRampe.vScale *= 20;

	materiauRampe.diffuseTexture.hasAlpha = true;
	materiauRampe.backFaceCulling = true;

	var railing_largeur_platform = 3.5;
	var railing_hauteur = 2.0 + 0.05;
	var railing_y = 5 - 0.05;
	var epaisseur = 0.06;

	var x = 1;
	for (var i = 0; i < 2; i++) {
		for (var j = 1; j < 4; j++) {
			var mur_railing_face = creerCloison("cloison" + i, { hauteur: railing_hauteur, largeur: 4, epaisseur: epaisseur, epaisseur: epaisseur, materiau: materiauRampe });
			var z = (4 * j) - 2;
			mur_railing_face.position = new BABYLON.Vector3(0.05, railing_y, x * z);
			mur_railing_face.rotation.y = Math.PI / 2;
		}
		x = -1;
	}

	//platform Railing
	//var mur_railing_platform_right = creerCloison("cloison", { hauteur: railing_hauteur, largeur: railing_largeur_platform, epaisseur: epaisseur, materiau: materiauRampe });
	//mur_railing_platform_right.position = new BABYLON.Vector3(1.75, railing_y, 12.0 - 0.05);

	var mur_railing_platform_left = creerCloison("cloison", { hauteur: railing_hauteur, largeur: railing_largeur_platform, epaisseur: epaisseur, materiau: materiauRampe });
	mur_railing_platform_left.position = new BABYLON.Vector3(1.75, railing_y, -12.0 + 0.05);


	//Escalier Railing - left and right
	var y = 2;
	var z = 12 - 0.05;
	for (i = 0; i < 9; i++) {
		x = 1;
		for (j = 1; j <= 2; j++) {
			var mur_railing_escalier = creerCloison("mur_railing_escalier-" + j + i, { hauteur: 0.5, largeur: railing_hauteur, epaisseur: epaisseur, materiau: materiauRampe, collision: false });
			mur_railing_escalier.rotation.z = Math.PI / 2;
			mur_railing_escalier.position = new BABYLON.Vector3(8 - (i / 2), y, -z * (x));
			//x = -1; // comment to only use right 
		}
		y += 0.5;
	}

}

// ###########################START TELEPORTATION ################################ //
function createTPMark(nom, opts, scn) {
	let options = opts || {};
	let diameter = options.diameter || 3.0;

	var invisibleMaterial = new BABYLON.StandardMaterial("TeleportationSphere");
	invisibleMaterial.alpha = 0.3;

	let sph = BABYLON.Mesh.CreateSphere(nom, diameter, 1, scn);

	sph.material = invisibleMaterial;
	sph.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);

	sph.type = "Teleportation";
	sph.metadata = { type: "Teleportation" };

	sph.position = opts.position;


	return sph;
}

function CreateTeleportationMark() {
	// var positions = [];


	// positions.push(new BABYLON.Vector3(10, 1, -14));
	// positions.push(new BABYLON.Vector3(10, 1, 14));
	// positions.push(new BABYLON.Vector3(2, 1, 11.5));
	// positions.push(new BABYLON.Vector3(1.0, 7, -13.5));
	// positions.push(new BABYLON.Vector3(-1, 7, 0));
	// positions.push(new BABYLON.Vector3(-13, 7, -13.5));
	// positions.push(new BABYLON.Vector3(-13, 7, 13.5));

	// var i = 0;
	// positions.forEach(function (position) {
	// 	createTPMark("sphere" + i, { position: position });
	// 	i++;
	// });

	const sphere = PRIMS.sphere("teleport-sphere1", { materiau: this.material_glass, diametre: 2 }, this.scene);
	sphere.position = new BABYLON.Vector3(-7.5, 7, -7.5);

	const sphere2 = PRIMS.sphere("teleport-sphere2", { materiau: this.material_glass, diametre: 2 }, this.scene);
	sphere2.position = new BABYLON.Vector3(10, 2, 10);


}
// ###########################END TELEPORTATION ################################ //

// doors 
function CreateDoor(DoorOpts) {

	let name = DoorOpts.name || "door";
	let height = DoorOpts.hauteur || 4.0;
	let width = DoorOpts.largeur || 3.0;
	let materiau = DoorOpts.materiau;
	let vector = DoorOpts.vector || new BABYLON.Vector3(0, 0, 0);

	var door = creerCloison(name, { hauteur: height, largeur: width, materiau: materiau });
	door.position = vector;
	door.rotation.y = Math.PI / 2;
	door.opened = false;

	var panel = BABYLON.MeshBuilder.CreatePlane("panel-" + name, { width: width, height: height });

	panel.position = vector;

	panel.rotation.y = Math.PI / 2;


	panel.material = materiau;


	return door;
}

// crosshair 
function createPointer(camera, scene) {
	const pointer = BABYLON.Mesh.CreateSphere("pointer", 16, 0.01, scene, false);
	pointer.parent = camera;
	pointer.position.z = -1.3;
}

const PRIMS = {
	"camera": creerCamera,
	"reticule": creerReticule,
	"wall": creerCloison,
	"sphere": creerSphere,
	"box": creerBoite,
	"poster": creerPoster,
	"standardMaterial": creerMateriauStandard,
	"meadow": creerPrairie,
	"ground": creerSol,
	"sky": creerCiel,
	"creuser": creuser,
	"OutsideWalls": OutsideWalls, // new used
	"Mur": CreateMur, // new used
	"Escalier": CreateEscalier, // new used
	"CreateRailing": CreateRailing, // new used
	"CreateTeleportationMark": CreateTeleportationMark, // new used but need crosshair
	"CreateDoor": CreateDoor,
	"createPointer": createPointer
}

export { PRIMS }; 
