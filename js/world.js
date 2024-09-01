
import { PRIMS } from './prims.js';
import { Simu } from './simu.js';

class World extends Simu {

	constructor() {
		super();
		this.posters = []; // Array to store poster objects and their states
		this.posterDisplayTime = {};
		this.currentlyDisplayedPoster = null; // Track the currently displayed poster
		this.teleportationSpheres = [];
	}

	requete_http(www, port, requete, foo) {
		const entete = "http://" + www + ":" + port + "/" + requete;
		loadJSON(entete, (res) => {
			const data = JSON.parse(res);
			foo(data);
		});
	}



	createWorld(data) {
		const scene = this.scene;
		scene.gravity = new BABYLON.Vector3(0, -0.1, 0);
		PRIMS.createPointer(this.camera, this.scene);

		const light0 = new BABYLON.HemisphericLight("l0", new BABYLON.Vector3(1, 1, 0), scene);
		const light1 = new BABYLON.HemisphericLight("l0", new BABYLON.Vector3(1, -1, 0), scene);
		light1.intensity = 0.2;

		const light2 = new BABYLON.HemisphericLight("l0", new BABYLON.Vector3(1, -1, 0), scene);
		light2.intensity = 0.2;

		const materiau1 = PRIMS.standardMaterial("mat1", { texture: "./assets/240.jpg" }, scene);
		const materiau2 = PRIMS.standardMaterial("mat_sol", { texture: "./assets/marble.jpg", uScale: 25, vScale: 25 }, scene);

		const ciel = PRIMS.sky("ciel", {}, scene);

		//const sol = PRIMS.ground("sol", { materiau: materiau2 }, scene);

		// ################################################################################## //

		// path for textures 
		var pathTextureSolCarrelage = "assets/textures/solCarrelage.jpg";
		var pathTextureMezzanine = "assets/textures/solCarrelage.jpg";
		var pathTextureMur = "assets/textures/wall.jpg";
		var pathTextureCeiling = "assets/textures/white_tile.jpg";
		var pathTextureEscalier = "assets/textures/escalier.jpg";
		var pathTextureEscalier = "assets/textures/escalier.jpg";
		var pathTexturePorte = "assets/door/door_wood.png";
		//Creation des textures
		var materiauSolCarrelage = PRIMS.standardMaterial("mat-sol-carrelage", { texture: pathTextureSolCarrelage, sol: true }, scene);
		var materiauSolMezzanine = PRIMS.standardMaterial("mat-sol-mezzanine", { texture: pathTextureMezzanine, sol: true }, scene);
		var materiauCloison = PRIMS.standardMaterial("mat-cloison", { texture: pathTextureMur }, scene);
		var materiauEscalier = PRIMS.standardMaterial("mat-sol-escalier", { texture: pathTextureEscalier }, scene);
		var materiauPorte = PRIMS.standardMaterial("mat-sol-escalier", { texture: pathTexturePorte }, scene);


		// creation materiaux
		var materiauCeiling = PRIMS.standardMaterial("mat-cloison", { texture: pathTextureCeiling, sol: true, backFaceCulling: false }, scene);
		materiauCeiling.backFaceCulling = false;
		var materiauPlatform = PRIMS.standardMaterial("mat-sol-escalier", { texture: pathTextureEscalier, sol: true }, scene);
		materiauPlatform.backFaceCulling = false;

		var invisibleMaterial = new BABYLON.StandardMaterial("stairsmat", scene);
		invisibleMaterial.alpha = 0.01;

		//Creation du sol de musee 
		var solCarrelage = PRIMS.ground("solCarrelage", { largeur: 30.0, profondeur: 30.0, materiau: materiauSolCarrelage, checkCollisions: true }, scene);

		//Creation sol du mezzanine
		var solMezzanine = PRIMS.ground("solMezzanine", { largeur: 15.0, profondeur: 30.0, materiau: materiauSolMezzanine, checkCollisions: true }, scene);
		solMezzanine.position = new BABYLON.Vector3(-7.5, 5.0, 0.0);

		//Creation des cloisons du musee
		var [cloisonNord, cloisonEst, cloisonSud, cloisonOuest] = PRIMS.OutsideWalls(materiauCloison);

		//Creation du Toit
		var ceilingCarrelage = PRIMS.ground("solMezzanine", { largeur: 15.0, profondeur: 30.0, materiau: materiauCeiling, checkCollisions: true }, scene);
		ceilingCarrelage.position = new BABYLON.Vector3(-7.5, 4.95, 0.0);

		var ceilingMezzanine = PRIMS.ground("solMezzanine", { largeur: 30.0, profondeur: 30.0, materiau: materiauCeiling, checkCollisions: true }, scene);
		ceilingMezzanine.position = new BABYLON.Vector3(0, 10, 0.0);

		var [cloisonMur1, cloisonMur2] = PRIMS.Mur(materiauCloison);
		var [cloisonSalle1, cloisonSalle2, cloisonSalle3, cloisonSalle4, cloisonEntete] = CreateSalle(materiauCloison);

		PRIMS.Escalier({ materiau: materiauEscalier, materiauPlatform: materiauPlatform });
		PRIMS.CreateRailing();

		// Ascenseur
		creerAscenceur(this.camera, scene);

		// Teleporataion et poiteur
		//PRIMS.CreateTeleportationMark();
		// Create teleportation spheres
		const teleportSpheres = [
			this.createTeleportationSphere(new BABYLON.Vector3(10, 0.5, 13), scene),
			this.createTeleportationSphere(new BABYLON.Vector3(13, 0.5, -3), scene),
			this.createTeleportationSphere(new BABYLON.Vector3(10, 0.5, -10), scene),
			//this.createTeleportationSphere(new BABYLON.Vector3(-9, 6, 13.75), scene),
			//this.createTeleportationSphere(new BABYLON.Vector3(-13, 6, 13.75), scene),
			//this.createTeleportationSphere(new BABYLON.Vector3(-13, 6, -1), scene),
			//this.createTeleportationSphere(new BABYLON.Vector3(-5, 6, -1), scene),
			//this.createTeleportationSphere(new BABYLON.Vector3(-5, 6, -9), scene),
			this.createTeleportationSphere(new BABYLON.Vector3(1, 6, -14), scene),
		];

		this.teleportationSpheres.push(...teleportSpheres);


		scene.onBeforeRenderObservable.add(() => {
			this.checkPosterProximity(scene);
			this.updateTeleportationSpheres(scene);
		});

		window.addEventListener("pointerdown", (evt) => {
			if (evt.button === 0) {
				this.teleport(scene);
			}
		});

		// l'art (posters)
		var walls = {
			cloisonNord: cloisonNord,
			cloisonEst: cloisonEst,
			cloisonSud: cloisonSud,
			cloisonOuest: cloisonOuest,
			cloisonMur1: cloisonMur1,
			cloisonMur2: cloisonMur2,
			cloisonSalle1: cloisonSalle1,
			cloisonSalle2: cloisonSalle2,
			cloisonSalle3: cloisonSalle3,
			cloisonSalle4: cloisonSalle4,
			cloisonEntete: cloisonEntete
		}

		createArt(getTableaux(), walls, scene, this.camera);

		// doors 
		var porteSalle1 = PRIMS.CreateDoor({ name: "Leonardo da Vinci", hauteur: 4.0, largeur: 3.0, materiau: materiauPorte, vector: new BABYLON.Vector3(0, 0, 9.5) });
		Opendoor(scene, porteSalle1, this.camera, 3.4);

		var porteSalle2 = PRIMS.CreateDoor({ name: "Van Gogh", hauteur: 4.0, largeur: 4.0, materiau: materiauPorte, vector: new BABYLON.Vector3(0, 0, 0) });
		Opendoor(scene, porteSalle2, this.camera, 3.4);

		var porteSalle3 = PRIMS.CreateDoor({ name: "Pablo Picasso", hauteur: 4.0, largeur: 3.0, materiau: materiauPorte, vector: new BABYLON.Vector3(0, 0, -9.5) });
		Opendoor(scene, porteSalle3, this.camera, 3.0);



		// Status 
		BABYLON.SceneLoader.ImportMesh("", "assets/status/", "Venus.obj", this.scene, (meshes) => {
			const statue_material = PRIMS.standardMaterial("mat-venus", {
				texture: "assets/status/Venus.jpg",
				uScale: 1,
				vScale: 1
			}, this.scene);

			const m = meshes[1];
			m.scaling = new BABYLON.Vector3(1, 1, 1);
			m.position = new BABYLON.Vector3(7.5, 0, 0);
			m.rotation.y = Math.PI / 2;
			m.material = statue_material;
			m.checkCollisions = true;


			rotateStatue(m, this.scene);
		});

		BABYLON.SceneLoader.ImportMesh("", "assets/status/", "David.obj", this.scene, (meshes) => {
			const statue_material = PRIMS.standardMaterial("mat-david", {
				texture: "assets/status/David.jpg",
				uScale: 1,
				vScale: 1
			}, this.scene);

			const m = meshes[0];
			m.scaling = new BABYLON.Vector3(0.0075, 0.0075, 0.0075);
			m.position = new BABYLON.Vector3(-7.5, 5, 0);
			m.rotation.y = Math.PI / 2;
			m.rotation.x = -Math.PI / 2;
			m.material = statue_material;
			m.checkCollisions = true;

			rotateStatue(m, this.scene);
		});
	}

	createTeleportationSphere(position, scene) {
		const sphere = BABYLON.MeshBuilder.CreateSphere("teleportSphere", { diameter: 1 }, scene);
		sphere.position = position;
		sphere.material = new BABYLON.StandardMaterial("teleportMaterial", scene);
		sphere.material.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.75)
		sphere.material.alpha = 0.5; // Set the transparency level (0.0 fully transparent, 1.0 fully opaque)
		return sphere;
	}

	// teleportation function
	updateTeleportationSpheres(scene) {
		const camera = scene.activeCamera;
		let closestSphere = null;
		let closestDistance = Infinity;

		this.teleportationSpheres.forEach(sphere => {
			sphere.material.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.75); // Reset color
			sphere.material.alpha = 0.5; // Reset transparency
			const distance = BABYLON.Vector3.Distance(camera.position, sphere.position);
			if (distance < closestDistance) {
				closestDistance = distance;
				closestSphere = sphere;
			}
		});

		if (closestSphere && closestDistance < 8) { // Adjust threshold as needed
			closestSphere.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Highlight color
			closestSphere.material.alpha = 0.8; // Adjust transparency for highlight
		}
	}


	teleport(scene) {
		const camera = scene.activeCamera;
		this.teleportationSpheres.forEach(sphere => {
			if (sphere.material.diffuseColor.equals(new BABYLON.Color3(1, 0, 0))) {
				camera.position.copyFrom(sphere.position);
				camera.position.y += 2; // Adjust height as needed
			}
		});
	}
	checkPosterProximity(scene) {
		let camera = scene.activeCamera;
		let proximityThreshold = 4;
		let closestPoster = null;
		let closestDistance = proximityThreshold;

		for (let posterData of this.posters) {
			let { poster, titleMesh, descriptionContainer } = posterData;
			let distance = BABYLON.Vector3.Distance(camera.position, poster.getAbsolutePosition());

			if (distance < closestDistance) {
				closestDistance = distance;
				closestPoster = posterData;
			}
		}

		if (closestPoster !== this.currentlyDisplayedPoster) {
			if (this.currentlyDisplayedPoster) {
				this.currentlyDisplayedPoster.titleMesh.isVisible = false;
				this.currentlyDisplayedPoster.descriptionContainer.isVisible = false;
				this.currentlyDisplayedPoster.titleDisplayed = false;
				this.currentlyDisplayedPoster.descriptionDisplayed = false;
			}

			if (closestPoster) {
				closestPoster.titleMesh.isVisible = true;
				closestPoster.titleDisplayed = true;
				this.posterDisplayTime[closestPoster.poster.name] = Date.now();

				let elapsed = Date.now() - this.posterDisplayTime[closestPoster.poster.name];
				if (elapsed > closestPoster.showTime) {
					closestPoster.descriptionContainer.isVisible = true;
					closestPoster.descriptionDisplayed = true;
				}
			}

			this.currentlyDisplayedPoster = closestPoster;
		}

		if (this.currentlyDisplayedPoster) {
			let elapsed = Date.now() - this.posterDisplayTime[this.currentlyDisplayedPoster.poster.name];
			if (elapsed > this.currentlyDisplayedPoster.showTime) {
				this.currentlyDisplayedPoster.descriptionContainer.isVisible = true;
				this.currentlyDisplayedPoster.descriptionDisplayed = true;
			}
		}
	}

}

// Status
function rotateStatue(statue, scene) {

	const frameRate = 10;
	const animationStatue = new BABYLON.Animation("rotate-" + statue.name, "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	const keyframesStatue = [];

	keyframesStatue.push({ frame: 0, value: 0 });
	keyframesStatue.push({ frame: frameRate, value: Math.PI });
	keyframesStatue.push({ frame: 2 * frameRate, value: Math.PI * 2 });

	animationStatue.setKeys(keyframesStatue);
	statue.animations.push(animationStatue);
	scene.beginAnimation(statue, 0, 2 * frameRate, true);

}
// Art
function creerUIMessage() {
	// GUI
	var advancedTexture =
		BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	var textblock = new BABYLON.GUI.TextBlock();
	textblock.text = "";
	textblock.fontSize = 22;
	textblock.width = 0.8;
	textblock.height = 1;
	textblock.color = "white";
	advancedTexture.addControl(textblock);

	return textblock;
}
function createArt(tableaux, Walls, scene, camera) {

	let advancedTexture = creerUIMessage();
	// Create a tableau
	function createTableau(cloison, tableau, x, y, z, rotation, advancedTexture, hauteur, largeur, scene, camera) {

		let options = {
			tableau: tableau,
			uiobject: advancedTexture,
			hauteur: hauteur || 2.0,
			largeur: largeur || 2.0,
		};
		let tableauName = options.tableau.name || "";
		let tableauDescription = options.tableau.description || "";
		let UItext = options.uiobject;
		//console.log("tableauName : " + tableauName)

		var group = new BABYLON.TransformNode("group-" + tableau.name);

		// Set dimensions
		hauteur = hauteur || 2.0;
		largeur = largeur || 2.0;

		// Create the main tableau
		var tableau1 = BABYLON.MeshBuilder.CreatePlane("tableau-" + tableau.name, { width: largeur, height: hauteur }, scene);
		tableau1.parent = group;
		tableau1.position.z = -0.01;
		tableau1.position.y = 0.8;

		// Create material for the tableau
		var mat = new BABYLON.StandardMaterial("tex-tableau-" + tableau.name, scene);
		mat.diffuseTexture = new BABYLON.Texture("assets/tableaux/" + tableau.name + ".jpg", scene);
		tableau1.material = mat;
		tableau1.checkCollisions = true;

		// Create light bulb for the tableau
		var ampoule = BABYLON.MeshBuilder.CreateBox("nom", { width: 1, height: 0.4, depth: 0.05 });
		var material = new BABYLON.StandardMaterial("ampoule");
		material.emissiveColor = new BABYLON.Color3(1.0, 1.0, 0.7);
		ampoule.material = material;
		ampoule.parent = group;
		ampoule.position = new BABYLON.Vector3(0, hauteur + 0.5, 0);

		var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 0.5, -0.3), new BABYLON.Vector3(0, -5, 0), Math.PI / 2, 8);
		light.parent = ampoule;
		light.diffuse = new BABYLON.Color3(1.0, 1.0, 0.5);
		light.intensity = 5;
		light.setEnabled(false);

		// Create sound for the tableau
		var music = new BABYLON.Sound("Violons", "assets/sounds/sound.mp3", scene, null, {
			loop: false,
			autoplay: false,
		});

		// Create detector for the tableau
		var box = BABYLON.MeshBuilder.CreateBox("myBox", { height: 4, width: 2, depth: largeur + 1 }, scene);
		box.position = new BABYLON.Vector3(0, 0.5, -1.5);
		box.useAlphaFromDiffuseTexture = true;
		box.parent = group;

		var invisibleMaterial = new BABYLON.StandardMaterial("stairsmat", scene);
		invisibleMaterial.alpha = 0.01;

		box.material = invisibleMaterial;

		let collider = BABYLON.MeshBuilder.CreateBox(
			"myBox",
			{ height: 3, width: 2, depth: 0.5 },
			scene
		);
		collider.parent = camera;

		/**  detecteur  (evenement afficher le nom de l'oeuvre) */
		let watchingTableau = false;
		collider.actionManager = new BABYLON.ActionManager(scene);
		let tableauDesc = new BABYLON.ExecuteCodeAction(
			{
				trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
				parameter: {
					mesh: box,
				},
			},
			(evt) => {
				watchingTableau = true;
				light.setEnabled(true);
				music.play();
				var i = 15; // ms

				/** timer nom de tableau */
				var handle = window.setInterval(() => {
					i--;
					UItext.text = tableauName;

					if (i === 0) {
						window.clearInterval(handle);
						UItext.text = "";

					}
				}, 100);

				/** timer description */
				var j = 30; // ms
				var handle2 = window.setInterval(() => {
					j--;

					if (j === 0) {
						window.clearInterval(handle2);
						if (watchingTableau)
							UItext.text = tableauDescription;
					}
				}, 100);
			}
		);

		let tableauOut = new BABYLON.ExecuteCodeAction(
			{
				trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
				parameter: {
					mesh: box,
				},
			},
			(evt) => {
				watchingTableau = false;
				light.setEnabled(false);
				UItext.text = "";
				music.stop();
			}
		);
		collider.actionManager.registerAction(tableauDesc);
		collider.actionManager.registerAction(tableauOut);

		// Set position and rotation
		group.parent = cloison;
		group.position = new BABYLON.Vector3(x, y, z);
		group.rotation.y = rotation;

		return group;
	}

	// Define tableau dimensions
	var x = 3.0;
	var y = 2.0;
	var z = 0.2;

	// SALLE 1
	createTableau(Walls.cloisonNord, tableaux.salle1.tableauNord, -12, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonNord, tableaux.salle1.tableauNord2, -8, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);

	createTableau(Walls.cloisonMur2, tableaux.salle1.tableauEst1, -4, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonMur2, tableaux.salle1.tableauEst2, -0, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonMur2, tableaux.salle1.tableauEst3, 4, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);

	createTableau(Walls.cloisonEst, tableaux.salle1.tableauOuest1, -3, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonEst, tableaux.salle1.tableauOuest2, -7.5, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonEst, tableaux.salle1.tableauOuest3, -12, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);


	// SALLE 2
	createTableau(Walls.cloisonNord, tableaux.salle2.tableauNord, -2, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonNord, tableaux.salle2.tableauNord2, 2, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);

	createTableau(Walls.cloisonMur1, tableaux.salle2.tableauEst1, -4, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonMur1, tableaux.salle2.tableauEst2, -0, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonMur1, tableaux.salle2.tableauEst3, 4, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);

	createTableau(Walls.cloisonMur2, tableaux.salle2.tableauOuest1, -4, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonMur2, tableaux.salle2.tableauOuest2, -0, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonMur2, tableaux.salle2.tableauOuest3, 4, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);


	// SALLE 3
	createTableau(Walls.cloisonNord, tableaux.salle3.tableauNord, 8, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonNord, tableaux.salle3.tableauNord2, 12, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);

	createTableau(Walls.cloisonMur1, tableaux.salle3.tableauEst1, -4, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonMur1, tableaux.salle3.tableauEst2, -0, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonMur1, tableaux.salle3.tableauEst3, 4, y * 3 / 4, -z, Math.PI * 2, advancedTexture, null, null, scene, camera);

	createTableau(Walls.cloisonOuest, tableaux.salle3.tableauOuest1, -11, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonOuest, tableaux.salle3.tableauOuest2, -7, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);
	createTableau(Walls.cloisonOuest, tableaux.salle3.tableauOuest3, -3, y * 3 / 4, z, Math.PI, advancedTexture, null, null, scene, camera);



	// SALLE DALA
	createTableau(Walls.cloisonNord, tableaux.mezzanine.tableauNord, -10, y * 3, z, Math.PI, advancedTexture, 3, 7, scene, camera);
	createTableau(Walls.cloisonNord, tableaux.mezzanine.tableauEst, 10, y * 3, z, Math.PI, advancedTexture, 3, 7, scene, camera);
	createTableau(Walls.cloisonNord, tableaux.mezzanine.tableauOuest, 0, y * 3, z, Math.PI, advancedTexture, 3, 7, scene, camera);

	// TO DO FIX
	//CreateRoomName("room1", Walls.cloisonSalle2, 2, 1, new BABYLON.Vector3(-0.1, 4, 0.5), scene);



}
function CreateRoomName(name, wall, largeur, hauteur, position, scn) {
	var group = new BABYLON.TransformNode("group-" + name)

	group.parent = wall;

	var roomName = BABYLON.MeshBuilder.CreatePlane("tableau-" + name, { width: largeur, height: hauteur }, scn);
	roomName.parent = group;
	roomName.position = position;

	var mat = new BABYLON.StandardMaterial("tex-tableau-" + name, scn);
	mat.diffuseTexture = new BABYLON.Texture("assets/tableaux/" + name + ".png", scn);

	roomName.material = mat;
	roomName.rotation.y = Math.PI;
	roomName.rotation.z = 12;
}
// ascenseur : 
function open_close_lift_doors(door) {
	if (door.position.z == 13.5) {
		var endPosition = new BABYLON.Vector3(door.position.x, door.position.y, door.position.z + 3);
	} else if (door.position.z == 16.5) {
		var endPosition = new BABYLON.Vector3(door.position.x, door.position.y, door.position.z - 3);
	}
	var distance = BABYLON.Vector3.Distance(door.position, endPosition);
	var speed = 2;
	var duration = distance / speed * 1000;
	var frameRate = 30;
	var numFrames = duration / 1000 * frameRate;
	BABYLON.Animation.CreateAndStartAnimation("anim1", door, "position", frameRate, numFrames, door.position, endPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
}

// new combinaison function
function CreateSalle(materiauCloison) {
	var epaisseur = 0.8;
	var cloisonSalle1 = PRIMS.wall("cloisonSalle1", { hauteur: 4.0, largeur: 4.0, epaisseur: epaisseur, materiau: materiauCloison });
	cloisonSalle1.position = new BABYLON.Vector3(0.0, 0.0, 13.0);
	cloisonSalle1.rotation.y = Math.PI / 2;

	var cloisonSalle2 = PRIMS.wall("cloisonSalle2", { hauteur: 4.0, largeur: 6.0, epaisseur: epaisseur, materiau: materiauCloison });
	cloisonSalle2.position = new BABYLON.Vector3(0.0, 0.0, 5.0);
	cloisonSalle2.rotation.y = Math.PI / 2;

	var cloisonSalle3 = PRIMS.wall("cloisonSalle3", { hauteur: 4.0, largeur: 6.0, epaisseur: epaisseur, materiau: materiauCloison });
	cloisonSalle3.position = new BABYLON.Vector3(0.0, 0.0, -5.0);
	cloisonSalle3.rotation.y = Math.PI / 2;

	var cloisonSalle4 = PRIMS.wall("cloisonSalle4", { hauteur: 4.0, largeur: 4.0, epaisseur: epaisseur, materiau: materiauCloison });
	cloisonSalle4.position = new BABYLON.Vector3(0.0, 0.0, -13.0);
	cloisonSalle4.rotation.y = Math.PI / 2;

	var cloisonEntete = PRIMS.wall("cloisonEntete", { hauteur: 1.0, largeur: 30.0, epaisseur: epaisseur, materiau: materiauCloison });
	cloisonEntete.position = new BABYLON.Vector3(0.0, 4.0, 0.0);
	cloisonEntete.rotation.y = Math.PI / 2;

	return [cloisonSalle1, cloisonSalle2, cloisonSalle3, cloisonSalle4, cloisonEntete]

}

// tableau : 
function getTableaux() {

	const tableaux = {
		salle1: {
			tableauNord: {
				name: "Au Salon de la rue des Moulins",
				description:
					"Ce tableau montre des femmes élégamment habillées dans un salon, capturant l'intimité et l'élégance de l'époque.",
			},
			tableauNord2: {
				name: "Le bar de Maxim's",
				description:
					"Une représentation du célèbre bar parisien Maxim's, symbole de la vie mondaine de la Belle ÉpoqueCe tableau illustre le célèbre bar parisien Maxim's, qui était un lieu de rencontre prisé par l'élite parisienne. Le bar est rempli de clients élégants, discutant et buvant dans un cadre luxueux..",
			},
			tableauEst1: {
				name: "Une soirée élégante",
				description:
					"Une scène d'intérieur vibrante où des hommes et des femmes en tenue de soirée sont rassemblés pour une fête chic, reflétant l'opulence et le raffinement de la société de la Belle Époque.",
			},
			tableauEst2: {
				name: "Les Quais de la Seine",
				description:
					"Ce tableau montre une vue animée des quais de la Seine à Paris, capturant l'activité urbaine et la beauté de la vie quotidienne à la Belle Époque.",
			},
			tableauEst3: {
				name: "Le Chalet du cycle au bois de Boulogne",
				description:
					"Représente l'oisiveté de la bourgeoisie, montrant des cyclistes élégants se relaxant et socialisant dans un cadre verdoyant.",
			},
			tableauOuest1: {
				name: "Glaneuses",
				description:
					"Ce tableau montre des glaneuses travaillant près des meules de foin, capturant la réalité et la dignité du travail rural.",

			},
			tableauOuest2: {
				name: "Le Bon Marché",
				description:
					"Représente l'intérieur vibrant du grand magasin Le Bon Marché, capturant l'agitation et la modernité du commerce parisien.",
			}
			,
			tableauOuest3: {
				name: "Aux courses",
				description:
					"Ce tableau montre des spectateurs assistant à une course de chevaux, capturant l'animation et l'élégance de l'époque.",
			}
		},
		salle2: {
			tableauNord: {
				name: "Le gouvernement Émile Combes",
				description:
					"Ce tableau capture une scène politique importante où Émile Combes et ses ministres discutent sérieusement des réformes laïques et sociales après leur victoire électorale.",
			},
			tableauNord2: {
				name: "Une voiture Renault",
				description:
					"Ce tableau montre une voiture Renault élégante de 1906 ou 1907, illustrant le design automobile et les avancées technologiques de l'époque.",
			},
			tableauEst1: {
				name: "Pierre et Marie Curie dans leur laboratoire",
				description:
					"Montre les Curie travaillant ensemble, symbolisant leurs découvertes."
			},
			tableauEst2: {
				name: "Hommage à Cézanne",
				description:
					"Ce tableau montre un groupe d'artistes rendant hommage à Cézanne, soulignant son influence majeure sur l'art moderne."
			},
			tableauEst3: {
				name: "Mineurs du Pas-de-Calais",
				description:
					"Cette illustration montre des mineurs en grève, soulignant les luttes sociales et les conditions de travail difficiles de l'époque."
			},
			tableauOuest1: {
				name: "Ouvriers des usines Schneider",
				description:
					"Ce tableau montre des ouvriers au travail dans les usines Schneider, illustrant l'industrie lourde pendant la Première Guerre mondiale."
			},
			tableauOuest2: {
				name: "Manifestation de vignerons",
				description:
					"Ce tableau montre des vignerons en marche, protestant à Béziers en 1907, capturant l'agitation sociale et les revendications de l'époque."
			},
			tableauOuest3: {
				name: "Le stand Renault Frères",
				description:
					"Ce tableau montre le stand de Renault Frères, fleuron de l'industrie automobile française, au salon de Paris en 1901."
			},
		},
		salle3: {
			tableauNord: {
				name: "Le Parlement de Paris",
				description:
					"Montre une scène de débat intense au Parlement, capturant les tensions politiques de l'époque."
			},
			tableauNord2: {
				name: "Assassinat du Sadi Carnot",
				description:
					"Dépeint l'attaque tragique du président français, soulignant l'instabilité politique."
			},
			tableauEst1: {
				name: "Le Dreyfusards",
				description:
					"Représente les partisans de Dreyfus, illustrant les divisions politiques et sociales de l'affaire Dreyfus."
			},
			tableauEst2: {
				name: "Émile Zola à son bureau",
				description:
					"Montre l'écrivain engagé Zola, capturant son rôle crucial dans l'affaire Dreyfus."
			},
			tableauEst3: {
				name: "Conseil Municipal",
				description:
					"Dépeint une réunion animée du conseil municipal de Paris, illustrant la vie politique locale."
			},
			tableauOuest1: {
				name: "La Grève",
				description:
					"Représente des ouvriers en grève, capturant les luttes sociales et politiques pour les droits des travailleurs."
			},
			tableauOuest2: {
				name: "Discours politique",
				description:
					"Montre un orateur passionné devant une foule, symbolisant l'importance de la rhétorique politique."

			},
			tableauOuest3: {
				name: "La Liberté guidant le peuple",
				description:
					"Une interprétation de la célèbre œuvre de Delacroix, soulignant les idéaux politiques de liberté et de révolution."
			}
		},
		mezzanine: {
			tableauNord: {
				name: "Le Moulin de la Galette",
				description: "Une peinture représentant une scène animée dans un moulin célèbre de Paris, montrant l'esprit joyeux de la Belle Époque."
			},
			tableauEst: {
				name: "L'Exposition universelle de Paris",
				description: "Ce tableau montre l'Exposition universelle de 1900 à Paris, capturant les structures innovantes et les foules émerveillées de visiteurs."
			},

			tableauOuest: {
				name: "La Charge (1899) par Henri-Paul Motte",
				description: "Ce tableau célèbre montre une charge de cavalerie, symbolisant le courage et la détermination des soldats, et est facilement trouvable en ligne."
			}
		}
	};



	return tableaux;
}
// assenseur 
function creerAscenceur(camera, scene) {
	let camMesh = BABYLON.MeshBuilder.CreateBox("camMesh", { size: 0.5 }, scene);
	camMesh.parent = camera;
	camMesh.isPointerBlocker = false;
	camMesh.actionManager = new BABYLON.ActionManager(scene);

	var materiauCloison = PRIMS.standardMaterial("mat-cloison", { texture: "assets/textures/lift_tex_3.jpeg" }, scene);
	materiauCloison.alpha = 0.9;
	var lift_box_wall1 = PRIMS.wall("lift_box_wall1", { hauteur: 8.0, largeur: 4.0, materiau: materiauCloison }, scene);
	lift_box_wall1.position = new BABYLON.Vector3(2.4, 0, 14.8);

	var lift_box_wall2 = PRIMS.wall("lift_box_wall2", { hauteur: 8.0, largeur: 4.0, materiau: materiauCloison }, scene);
	lift_box_wall2.position = new BABYLON.Vector3(2.4, 0, 12.2);

	var lift_box_wall4 = PRIMS.wall("lift_box_wall4", { hauteur: 5.0, largeur: 3.0, materiau: materiauCloison }, scene);
	lift_box_wall4.position = new BABYLON.Vector3(4.4, 3, 13.6);
	lift_box_wall4.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

	var materiauCloison = PRIMS.standardMaterial("mat-cloison", { texture: "assets/textures/lift_tex_3.jpeg" }, scene);
	var materiauCloisonTransparent = PRIMS.standardMaterial("mat-cloison", { texture: "assets/textures/lift_door.jpeg" }, scene);
	materiauCloisonTransparent.alpha = 0.8;
	var lift_wall1 = PRIMS.wall("lift_wall1", { hauteur: 3.0, largeur: 4, materiau: materiauCloison }, scene);
	lift_wall1.position = new BABYLON.Vector3(2.4, 0, 14.8);
	var lift_wall2 = PRIMS.wall("lift_wall2", { hauteur: 3.0, largeur: 4, materiau: materiauCloison }, scene);
	lift_wall2.position = new BABYLON.Vector3(2.4, 0, 12.2);
	var lift_door1 = PRIMS.wall("lift_door1", { hauteur: 3.0, largeur: 2.6, materiau: materiauCloisonTransparent }, scene);
	lift_door1.position = new BABYLON.Vector3(4.4, 0, 13.5);
	lift_door1.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
	var lift_door2 = PRIMS.wall("lift_door2", { hauteur: 3.0, largeur: 2.6, materiau: materiauCloisonTransparent }, scene);
	lift_door2.position = new BABYLON.Vector3(0.4, 0, 13.5);
	lift_door2.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
	var lift_sol = PRIMS.wall("lift_sol", { hauteur: 2.6, largeur: 4, materiau: materiauCloison }, scene);
	lift_sol.position = new BABYLON.Vector3(2.4, 0, 12.2);
	lift_sol.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
	var lift_roof = PRIMS.wall("lift_roof", { hauteur: 2.6, largeur: 4, materiau: materiauCloison }, scene);
	lift_roof.position = new BABYLON.Vector3(2.4, 3.0, 12.2);
	lift_roof.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

	let lift = new BABYLON.TransformNode("lift");

	lift_wall1.parent = lift;
	lift_wall2.parent = lift;
	lift_door1.parent = lift;
	lift_door2.parent = lift;
	lift_sol.parent = lift;
	lift_roof.parent = lift;

	let pannel = BABYLON.MeshBuilder.CreateBox("pannel", { width: 0.7, height: 0.3, depth: 0.05 }, scene);
	pannel.position = new BABYLON.Vector3(3, 1.7, 14.5);
	let materialPannel = new BABYLON.StandardMaterial("blanc", scene);
	materialPannel.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	pannel.material = materialPannel;

	// Create the text label
	var labelPlane = BABYLON.MeshBuilder.CreatePlane("labelPlane", { width: 2, height: 1 }, scene);
	labelPlane.parent = lift; // Attach the label to the lift
	labelPlane.position = new BABYLON.Vector3(2.4, 2, 13.0); // Position the label on the wall inside the lift
	var labelTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(labelPlane);
	var labelText = new BABYLON.GUI.TextBlock();
	labelText.text = "L'ascenseur est hors service :) F5 si ca crush";
	labelText.color = "red";
	labelText.fontSize = 50;
	labelTexture.addControl(labelText);

	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: 'a' }, function () { move_lift(lift) }));
	var buttonLift = BABYLON.MeshBuilder.CreateBox("button-lift", { width: 0.3, height: 0.1, depth: 0.1 }, scene);
	buttonLift.position = new BABYLON.Vector3(3, 1.7, 14.5);
	buttonLift.type = "buttonLift";
	buttonLift.metadata = { "type": 'buttonLift' };
	buttonLift.parent = lift;


	let materialFF = new BABYLON.StandardMaterial("blanc", scene);
	materialFF.diffuseColor = new BABYLON.Color3(1, 0, 0);
	let materialSF = new BABYLON.StandardMaterial("blanc", scene);
	materialSF.diffuseColor = new BABYLON.Color3(1, 1, 1);


	const textureLIFT = new BABYLON.DynamicTexture('texture', { width: 512, height: 256 }, scene);

	const font = 'bold 60px monospace';



	const textureContextLIFT = textureLIFT.getContext();
	textureContextLIFT.font = font;
	textureContextLIFT.fillStyle = '#ffffff';
	textureContextLIFT.fillRect(0, 0, textureLIFT.getSize().width, textureLIFT.getSize().height);
	textureContextLIFT.fillStyle = '#000000';
	textureContextLIFT.textAlign = 'center';
	textureContextLIFT.textBaseline = 'middle';
	textureContextLIFT.fillText(' ', textureLIFT.getSize().width / 2, textureLIFT.getSize().height / 2);
	textureLIFT.update();

	const materialLIFT = new BABYLON.StandardMaterial('materialSF', scene);

	materialLIFT.diffuseTexture = textureLIFT;
	buttonLift.material = materialLIFT;

	pannel.parent = lift;

	var liftBottomDoor = BABYLON.MeshBuilder.CreateBox("lift-bottom-door", { width: 3, height: 3, depth: 3 }, scene);
	liftBottomDoor.position = new BABYLON.Vector3(4.75, 1.5, 13.5);// modify here 
	var liftTopDoor = BABYLON.MeshBuilder.CreateBox("lift-top-door", { width: 3, height: 3, depth: 3 }, scene);
	liftTopDoor.position = new BABYLON.Vector3(0, 6.5, 13.5);//modify here 

	var transparent = new BABYLON.StandardMaterial("", scene);
	transparent.alpha = 0;

	liftBottomDoor.material = transparent;
	liftTopDoor.material = transparent;

	var openLiftBottomDoor = new BABYLON.ExecuteCodeAction(
		{
			trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
			parameter: { mesh: liftBottomDoor },
		},
		(evt) => {
			var i = 30;
			open_close_lift_doors(lift_door1);
			var countDown = window.setInterval(() => {
				i--;
				if (i === 0) {
					open_close_lift_doors(lift_door1);
					window.clearInterval(countDown);
				}
			}, 100);
		}
	);
	var openLiftTopDoor = new BABYLON.ExecuteCodeAction(
		{
			trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
			parameter: { mesh: liftTopDoor },
		},
		(evt) => {
			var i = 30;
			open_close_lift_doors(lift_door2);
			var countDown = window.setInterval(() => {
				i--;
				if (i === 0) {
					open_close_lift_doors(lift_door2);
					window.clearInterval(countDown);
				}
			}, 100);
		}
	);


	camMesh.actionManager.registerAction(openLiftBottomDoor);
	camMesh.actionManager.registerAction(openLiftTopDoor);
}

function Opendoor(scene, porte, camera, largeur) {

	var box = BABYLON.MeshBuilder.CreateBox("detecteur", { width: 3, height: 5, depth: 10 });

	box.position = new BABYLON.Vector3(0, 0, 0);
	box.useAlphaFromDiffuseTexture = true;
	box.parent = porte;
	var invisibleMaterial = new BABYLON.StandardMaterial("stairsmat");
	invisibleMaterial.alpha = 0;

	box.material = invisibleMaterial;

	let collidercam = BABYLON.MeshBuilder.CreateBox(
		"collider",
		{ size: 0.5 }
	);
	// création mesh camera  
	collidercam.parent = camera;
	collidercam.isPointerBlocker = false;
	collidercam.actionManager = new BABYLON.ActionManager(scene);
	let actionOpenDoor = new BABYLON.ExecuteCodeAction(
		{
			trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
			parameter: {
				mesh: box,
			},
		},
		(evt) => {
			var i = 30;
			movedoor(porte, scene, false, largeur);
			var handle = window.setInterval(() => {
				i--;
				if (i === 0) {
					window.clearInterval(handle);
					movedoor(porte, scene, true, largeur);
				}
			}, 100);
		}
	);
	collidercam.actionManager.registerAction(actionOpenDoor);
}

// door : 
function movedoor(port, scene, opened, largeur) {
	const SPEED = 0.95;
	let pos = port.position.z;

	if (!opened) {
		scene.registerBeforeRender(function open() {
			const delta = 0.05;
			/* movement */
			if (port.position.z - SPEED * delta >= (pos - largeur)) {
				port.position.z -= SPEED * delta;
				port.position.z -= SPEED * delta;

			}
			else {
				scene.unregisterBeforeRender(open);
			}

		});
	} else {
		scene.registerBeforeRender(function close() {
			const delta = 0.05;
			/* movement */
			if (port.position.z + SPEED * delta <= (pos + largeur)) {
				port.position.z += SPEED * delta;
				port.position.z += SPEED * delta;
			} else {
				scene.unregisterBeforeRender(close);
			}

		});
	}
}



export { World }
