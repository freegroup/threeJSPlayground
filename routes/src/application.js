// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer, lineMaterial, textMaterial;

init();
animate();

function init() {


      // Create the scene and set the scene size.
      scene = new THREE.Scene();
      var WIDTH = window.innerWidth;
      var HEIGHT = window.innerHeight;

     // Create a renderer and add it to the DOM.
      renderer = new THREE.WebGLRenderer({antialias:true});
      renderer.setSize(WIDTH, HEIGHT);
      renderer.autoClear = false;
      document.body.appendChild(renderer.domElement);
 
      // Create a camera, zoom it out from the model a bit, and add it to the scene.
      camera = new THREE.PerspectiveCamera(5, WIDTH / HEIGHT, 0.1, 20000);
      camera.position.set(340,462,3514);
      scene.add(camera);

      filter();

      // Create an event listener that resizes the renderer with the browser window.
      window.addEventListener('resize', onWindowResize);

      // Set the background color of the scene.
      renderer.setClearColor(0x000000, 1);

     controls = new THREE.OrbitControls(camera, renderer.domElement);

     lineMaterial = new THREE.LineBasicMaterial( { color: 0xDD2C00, opacity: 0.1, linewidth: 1, vertexColors: THREE.VertexColors } );
     textMaterial = new THREE.MeshNormalMaterial( { color: 0xFFFFFF, opacity:0.4, transparent: true, overdraw: true} );

     if(!Detector.webgl) Detector.addGetWebGLMessage();
    
     plotData();
     plotPlaces();
};

function animate() {
  // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimationFrame(animate);
     
  renderer.clear();
  composer.render(); 
 
  controls.update();
};
  
  
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    if(effectFXAA)
    	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    composer.reset();
}

function plotData() {
    for(var j = 0; j < routes.length; j++) {
      var route = routes[j];
        var geometry = new THREE.Geometry(),
            colors = [],
            spline = new THREE.Spline(route);
        for(var k = 0; k < route.length; k++) {
          if(route.hasOwnProperty(k)) {
            var index = k / (route.length);
            position = spline.getPoint(index);
            var plot = getPosition(position.x, position.y);
            geometry.vertices[k] = new THREE.Vector3(plot.x, plot.y, plot.z);
            geometry.colors[k] = new THREE.Color(0xffffff);
          }
        }

        var line = new THREE.Line(geometry, lineMaterial);
        var scale = 1;

        line.scale.x = line.scale.y = line.scale.z = scale;

        line.position.x = 0;
        line.position.y = 0;
        line.position.z = 0;

        scene.add(line);
      }
};



function plotPlaces() {
    var obj3D= new THREE.Object3D();
    places.forEach(function(place) {
      var point = getPosition(place.x,place.y);
      var text3d = new THREE.TextGeometry( place.title, {
        size: 8,
        curveSegments: 3,
        font: "helvetiker",
        weight: "normal",
        style: "normal",
        height: 1
      });

      var text = new THREE.Mesh( text3d, textMaterial );
      text.position.x = point.x;
      text.position.y = point.y;
      text.rotation.x = 0;
      text.rotation.y = 0;
      obj3D.add( text );
    });
    scene.add( obj3D );
    composer.render();
  };

function getPosition(raw_x,raw_y) {
    centerX = places[0].x;
    centerY = places[0].y;
    var x = -((raw_x - centerX) * 200 / (-3)) ,
        y = -((raw_y - centerY) * 200 / (-3)) ;
    return {"x":y,"y":x,"z":0};
}



