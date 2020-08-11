var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas:document.getElementById("canvas3d"),antialias:true});
renderer.physicallyCorrectLights = true;
renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = new THREE.Color( "#333333");
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
scene.add(camera);
camera.position.set(0, 0, 100);
camera.lookAt(scene.position);
var orbitcontrols = new THREE.OrbitControls(camera, document.getElementById("canvas3d"));
var light = new THREE.AmbientLight("#ffffff", 2);
//scene.add(light);
var light1 = new THREE.DirectionalLight("#ffffff",2);
light1.position.set(0, 100,50);
scene.add(light1);
var light2 = new THREE.HemisphereLight( 0xffffff, 0xffaaaa, 2 );
scene.add( light2 );

var loader = new THREE.TextureLoader();
var loadedTexture, loadedBumpmap, loadedRoughmap;


// Images loaded from external file:
var imgData1 = "images/textureMap.png";
var imgData2 = "images/bumpMap.png";
var imgData3 = "images/roughMap.png";

loader.load( imgData1, ( texture ) => {
	loadedTexture = texture;
	loader.load( imgData2, ( texture ) => {
		loadedBumpmap = texture;
		loader.load( imgData3, ( texture ) => {
			loadedRoughmap = texture;
			createCard();
		});
	});
});


function createCard(){
	console.log("createcard")
	var geometry = new THREE.PlaneBufferGeometry(59.6, 84, 8, 8);
	var material1 = new THREE.MeshPhysicalMaterial( {
			map: loadedTexture,
			side: THREE.DoubleSide,
			reflectivity : 0.4,
			//envMap : this.textureCube,
			//envMapIntensity : 0.7,
			metalness: 1,
			//metalnessMap: loadedRoughmap,
			//bumpMap: loadedBumpmap,
			//bumpScale : 0.5,
			color:"#ff0000",
			roughness : 0.2,
			//roughnessMap : loadedRoughmap,
			//blending: THREE.MultiplyBlending
	} );

	var material2 = new THREE.MeshStandardMaterial( {
		transparent:true,
			map: loadedTexture,
			alphaMap: loadedRoughmap,
			bumpMap: loadedBumpmap,
			bumpScale : 0.2,
			color:"#cccccc",
			reflectivity : 0,
			metalness: 0,

	} );

	var card = new THREE.Object3D();
	var cardLayer1 = new THREE.Mesh( geometry, material1);
	var cardLayer2 = new THREE.Mesh( geometry, material2);
	loadedTexture.needsUpdate = true;
	loadedBumpmap.needsUpdate = true;
	loadedRoughmap.needsUpdate = true;
	scene.add(card);
	card.add(cardLayer1);
	card.add(cardLayer2);
	cardLayer2.position.z +=0.1;
	animate();
}

function animate(){
    requestAnimationFrame(() => { animate() } );
    renderer.render(scene, camera);
}