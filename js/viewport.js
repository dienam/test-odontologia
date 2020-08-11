import * as THREE from  '../three.js/build/three.module.js';
import { GLTFLoader } from '../three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';


var renderer, scene, camera;
var children=[];
var model;
var raycaster;
var line;

var mouse = new THREE.Vector2();

var helper;
/* var position = new THREE.Vector3();
var orientation = new THREE.Euler();
var size = new THREE.Vector3( 10, 10, 10 ); */

window.addEventListener( 'load', init );

function init(){


    //Renderizador
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild( renderer.domElement );

    //Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);  //0x333333 -> gris oscuro      0xdddddd -> gris claro  
    
    //Cámara
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 15;
    camera.target = new THREE.Vector3();  //?????

    //Iluminación
    var hlight = new THREE.AmbientLight (0xffffff, 0.5);
    
    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 80%)'), 0.5);
    keyLight.position.set(-100, 0, 100);
    keyLight.castShadow = true;

    var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 80%)'), 0.75);
    fillLight.position.set(100, 0, 100);
    fillLight.castShadow = true;

    var backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(100, 0, -100).normalize();
    backLight.castShadow = true;

    scene.add(hlight);
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);


    //Controles
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1;
	controls.maxDistance = 30;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = false;
    
    var geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    //scene.add( line );


    loadModel();

    raycaster = new THREE.Raycaster();
    helper = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 32, 32 ), new THREE.MeshNormalMaterial() );
	helper.visible = true;
	scene.add( helper );


    window.addEventListener( 'resize', onWindowResize, false );

    var moved = false;

    controls.addEventListener( 'change', function () {

        moved = true;

    } );


    window.addEventListener( 'mousemove', onMouseMove, false );
    
    document.oncontextmenu = function(){return false}



    function onMouseMove( event ) {

        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );

        // See if the ray from the camera into the world hits one of our meshes
        var intersects = raycaster.intersectObjects( children );

        // Toggle rotation bool for meshes that we clicked
        if ( intersects.length > 0 ) {

            helper.position.set( 0, 0, 0 );
            helper.lookAt( intersects[ 0 ].face.normal );

            helper.position.copy( intersects[ 0 ].point );

        }

    }

    onWindowResize();
	animate();
    

}

function loadModel(){
        //Cargar modelo 3D
        var loader = new GLTFLoader();
        loader.load('./modelo/fantoma_simulador.glb', function ( gltf ){
            
            model = gltf.scene;
            
            gltf.scene.traverse( function ( child ) {
                if ( child.isMesh ) {
                    children.push(child)
                }
            } );

            scene.add( model);
            model.scale.set( 10, 10, 10 );             

            
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        }); 

       



}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate () {
    requestAnimationFrame( animate );

    //controls.update();

    renderer.render( scene, camera );
}
