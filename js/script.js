var Colors = {
	red:0xCA3C38,
	white:0xd8d0d1,
	grey:0xb5b5b5,
	darkGrey: 0x707070,
};

window.addEventListener('load', init, false);

var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container, controls;

function createScene() {

	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	scene = new THREE.Scene();
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);
	camera.position.x = 0;
	camera.position.z = 300;
	camera.position.y = 0;
	renderer = new THREE.WebGLRenderer({ 
		alpha: true, 
		antialias: true 
	});

	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', handleWindowResize, false);

	controls = new THREE.OrbitControls(camera, renderer.domElement);

}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	shadowLight.position.set(150, 350, 350);

	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
}


var Robot = function() {
	
	this.mesh = new THREE.Object3D();
	
	var redMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var whiteMat = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var greyMat = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
	var darkGreyMat = new THREE.MeshPhongMaterial({color:Colors.darkGrey, shading:THREE.FlatShading});
	// Create the Head
	var geomHead = new THREE.BoxGeometry(75,50,50,1,1,1);
	var head = new THREE.Mesh(geomHead, redMat);

	head.castShadow = true;
	head.receiveShadow = true;

	// Create the Eyes
	var geomEye = new THREE.CylinderBufferGeometry(15, 10, 10, 8 );
	geomEye.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	var eyeL = new THREE.Mesh(geomEye, whiteMat);
	eyeL.position.set(15,0,25);
	eyeL.castShadow = true;
	eyeL.receiveShadow = true;
	head.add(eyeL);

	// Clone Eye
	var eyeR = eyeL.clone();
	eyeL.position.x = -eyeR.position.x;
	head.add(eyeR);


	// Add Antennna
	var geomAntennaBase = new THREE.CylinderBufferGeometry(5, 10, 5, 6 );
	var antennaBase = new THREE.Mesh(geomAntennaBase, redMat);
	antennaBase.position.set(0,27,0);
	antennaBase.castShadow = true;
	antennaBase.receiveShadow = true;
	head.add(antennaBase);

	var geomAntennaRod = new THREE.CylinderBufferGeometry(1, 5, 20, 6 );
	var antennaRod = new THREE.Mesh(geomAntennaRod, redMat);
	antennaRod.position.set(0,10,0);
	antennaRod.castShadow = true;
	antennaRod.receiveShadow = true;
	antennaBase.add(antennaRod);

	var geomAntennaTop = new THREE.SphereBufferGeometry( 6, 8, 8 );
	var antennaTop = new THREE.Mesh(geomAntennaTop, whiteMat);
	antennaTop.position.set(0,20,0);
	antennaTop.castShadow = true;
	antennaTop.receiveShadow = true;
	antennaBase.add(antennaTop);

	antennaBase.scale.set(0.8, 0.8, 0.8);

	// Create Jaw
	var geomJaw = new THREE.BoxGeometry(85,10,60,1,1,1);
	this.jaw = new THREE.Mesh(geomJaw, redMat);
	this.jaw.castShadow = true;
	this.jaw.receiveShadow = true;
	this.jaw.position.set(0,-40, 0);
	this.jaw.rotation.x =  Math.PI * 0.05;
	this.mesh.add(this.jaw);

	//Create Jaw Vertical
	var geomJawV = new THREE.BoxGeometry(85,25,10,1,1,1);
	var jawV = new THREE.Mesh(geomJawV, redMat);
	jawV.receiveShadow = true;
	jawV.position.set(0, 17.5,-25);
	this.jaw.add(jawV);

	//Create Teeth
	var geomTeeth = new THREE.BoxGeometry(75,5,5,1,1,1);
	var teeth = new THREE.Mesh(geomTeeth, whiteMat);
	teeth.castShadow = true;
	teeth.receiveShadow = true;
	teeth.position.set(0, 5 ,20);
	this.jaw.add(teeth);

	var geomTeethBack = new THREE.BoxGeometry(5,5,30,1,1,1);
	var teethBackL = new THREE.Mesh(geomTeethBack, whiteMat);
	teethBackL.castShadow = true;
	teethBackL.receiveShadow = true;
	teethBackL.position.set(35, 5, 5);
	this.jaw.add(teethBackL);

	var teethBackR = teethBackL.clone();
	teethBackL.position.x = -teethBackR.position.x;
	this.jaw.add(teethBackR);	

	//Creat Jaw Bolts
	var geomJawBolt = new THREE.CylinderBufferGeometry(10, 10, 10, 8 );
	geomJawBolt.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI/2));
	var jawBoltL = new THREE.Mesh(geomJawBolt, redMat);
	jawBoltL.position.set(-40,25,-25);
	jawBoltL.castShadow = true;
	jawBoltL.receiveShadow = true;
	this.jaw.add(jawBoltL);

	//Clone the Jaw
	var jawBoltR = jawBoltL.clone();
	jawBoltL.position.x = -jawBoltR.position.x;
	this.jaw.add(jawBoltR);

	//Add the Jaw
	head.add(this.jaw);

	//Add the Head
	this.mesh.add(head);


	//Create the Torso
	var geomTorso = new THREE.BoxGeometry(65,60,50,1,1,1);
	var torso = new THREE.Mesh(geomTorso, redMat);
	torso.castShadow = true;
	torso.receiveShadow = true;
	geomTorso.vertices[3].x+=10;
	geomTorso.vertices[2].x+=10;
	geomTorso.vertices[7].x-=10;
	geomTorso.vertices[6].x-=10;

	geomTorso.vertices[3].z-=5;
	geomTorso.vertices[2].z+=5;
	geomTorso.vertices[7].z+=5;
	geomTorso.vertices[6].z-=5;


	var geomButton = new THREE.BoxGeometry(5,5,2.5);
	var button = new THREE.Mesh(geomButton, greyMat);
	button.position.set(20,10,28);
	button.castShadow = true;
	button.receiveShadow = true;
	torso.add(button);

	var geomButtonWide = new THREE.BoxGeometry(5,10,2.5);
	var buttonWide = new THREE.Mesh(geomButtonWide, greyMat);
	buttonWide.position.set(10,10,28);
	buttonWide.castShadow = true;
	buttonWide.receiveShadow = true;
	torso.add(buttonWide);


	var geomnDial = new THREE.CylinderBufferGeometry(10, 10, 4, 8 );
	var dial = new THREE.Mesh(geomnDial, darkGreyMat);	
	dial.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	dial.position.set(-15,10,27);
	dial.castShadow = true;
	dial.receiveShadow = true;
	torso.add(dial);


	//Create the LowerTorso
	var geomTorsoLower = new THREE.BoxGeometry(20,12,60,1,1,2);
	var torsoLowerL = new THREE.Mesh(geomTorsoLower, redMat);
	torsoLowerL.position.set(25,-36,0);
	geomTorsoLower.vertices[4].y-=10;	
	geomTorsoLower.vertices[10].y-=10;
	torsoLowerL.castShadow = true;
	torsoLowerL.receiveShadow = true;
	torso.add(torsoLowerL);

	var torsoLowerR = torsoLowerL.clone();
	torsoLowerL.position.x = -torsoLowerR.position.x;
	torso.add(torsoLowerR);

	var torsoLowerM = torsoLowerL.clone();
	torsoLowerM.position.x=0;
	torsoLowerM.position.y=-33.5;
	torsoLowerM.scale.set(1,1.2,1.1);
	torso.add(torsoLowerM);

	// Create the Neck
	var geomNeck = new THREE.CylinderBufferGeometry(10, 15, 12, 6);
	var neck = new THREE.Mesh(geomNeck, redMat);
	neck.castShadow = true;
	neck.position.y = 35;
	neck.receiveShadow = true;
	torso.add(neck);


	// Create JetPack

	var geomFuelBox = new THREE.BoxBufferGeometry(45, 30, 10 );
	var fuelBox = new THREE.Mesh(geomFuelBox, redMat);
	fuelBox.position.set(0,0,-30);
	fuelBox.castShadow = true;
	fuelBox.receiveShadow = true;
	torso.add(fuelBox);

	var geomFuel = new THREE.CylinderBufferGeometry(15, 15, 60, 8 );
	var fuel = new THREE.Mesh(geomFuel, greyMat);
	fuel.position.set(20,0,-50);
	fuel.castShadow = true;
	fuel.receiveShadow = true;
	torso.add(fuel);

	var geomFuelTop = new THREE.SphereGeometry( 15, 8, 8 );
	var fuelTop = new THREE.Mesh(geomFuelTop, whiteMat);
	fuelTop.position.set(0,30,0);
	fuelTop.castShadow = true;
	fuelTop.receiveShadow = true;
	fuel.add(fuelTop);

	var geomFuelBot = new THREE.CylinderBufferGeometry(15, 20, 10, 8 );
	var fuelBot = new THREE.Mesh(geomFuelBot, darkGreyMat);
	fuelBot.position.set(0,-30,0);
	fuelBot.castShadow = true;
	fuelBot.receiveShadow = true;
	fuel.add(fuelBot);


	var fuelR = fuel.clone();
	fuel.position.x = -fuelR.position.x;
	torso.add(fuelR);

	this.mesh.add(torso);



	// Create Arms - need better anchor poitns

	var armLeft = new THREE.Object3D();

	var geomArm = new THREE.BoxGeometry(10,40,10);
	var armUpperL = new THREE.Mesh(geomArm, redMat);
	armUpperL.rotateZ = Math.PI/8;
	armUpperL.castShadow = true;
	armUpperL.position.set(55,0,0);
	armUpperL.receiveShadow = true;
	armUpperL.rotation.z =	Math.PI/3;
	armUpperL.rotation.y =	-Math.PI/4;
	armLeft.add(armUpperL);

	var armLowerL = armUpperL.clone();
	//armUpperL.position.y = -armLowerL.position.y;
	armLowerL.position.set(70,-22,35);
	armLowerL.rotation.y =	-Math.PI/2;
	armLeft.add(armLowerL);	

	// Creat Hands
	var geomHand = new THREE.BoxGeometry(30,30,10);
	var handL = new THREE.Mesh(geomHand, redMat);
	handL.castShadow = true;
	handL.position.set(0,-20,0);
	handL.receiveShadow = true;
	armLowerL.add(handL);

	this.mesh.add(armLeft);	

	var armRight = armLeft.clone();
	armRight.position.y = 25;	
	armRight.rotation.y = Math.PI;
	armRight.rotation.x = Math.PI;

	this.mesh.add(armRight);	



	// Create Legs - Needs better Anchor Points

	var geomLeg = new THREE.BoxGeometry(10,40,10);
	var legL = new THREE.Mesh(geomLeg, redMat);
	legL.castShadow = true;
	legL.position.set(25,-72,10);
	legL.receiveShadow = true;
	this.mesh.add(legL);

	var legLowerL = legL.clone();
	legLowerL.position.set(0,-35,-15);
	legLowerL.rotation.x =	Math.PI/3.5;
	legL.add(legLowerL);


	// Creat Feet
	var geomFeet = new THREE.BoxGeometry(30,10,40);
	var feet = new THREE.Mesh(geomFeet, redMat);
	feet.castShadow = true;
	feet.position.set(0,-20,10);
	feet.receiveShadow = true;
	legLowerL.add(feet);	


	var legR = legL.clone();
	legR.position.x = -25;
	legR.rotation.x = -Math.PI/10;

	this.mesh.add(legR);

	//Position Body Parts
	head.scale.set(1.2, 1.2, 1.2);
	head.position.y = 100;
	torso.position.y = 0;

};

// var model;
// var skyBox;

function initSkybox(){

	var urls = [
		'skybox/sky_pos_x.jpg',
		'skybox/sky_neg_x.jpg',
		'skybox/sky_pos_y.jpg',
		'skybox/sky_neg_y.jpg',
		'skybox/sky_neg_z.jpg',
		'skybox/sky_pos_z.jpg'
	];
	
	var reflectionCube = new THREE.CubeTextureLoader().load( urls );
	reflectionCube.format = THREE.RGBFormat;
	
	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = reflectionCube;
	
	var material = new THREE.ShaderMaterial( {
	
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
		
	} ), skyBox = new THREE.Mesh( new THREE.BoxGeometry( 5000, 5000, 5000 ), material );
	
	//skyBox.rotation.y += Math.PI;
	scene.add( skyBox );


}



function createRobot(){ 
	robot = new Robot();
	robot.mesh.position.y = 0;
	robot.mesh.rotation.y = -Math.PI/2;
	robot.mesh.rotation.z = -Math.PI/10;	
	robot.mesh.scale.set(.7,.7,.7);
	scene.add(robot.mesh);
}


function init() {
	createScene();
	createLights();
	createRobot();
	initSkybox();
	loop();
}

function loop(){

	controls.update();
	controls.autoRotate = true;

	robot.mesh.rotation.y +=0.005;

	if ( robot.mesh) {
        robot.mesh.rotation.z = Math.sin(Date.now() * 0.0005) * Math.PI * 0.2 ;
    }


	renderer.render(scene, camera);

	requestAnimationFrame(loop);
}