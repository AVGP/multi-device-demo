var WIDTH = document.body.clientWidth, HEIGHT = document.body.clientHeight;
var scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000),
    renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
// React to silly browsers...
WIDTH = document.body.clientWidth;
HEIGHT = document.body.clientHeight;
renderer.setSize(WIDTH, HEIGHT);

light = new THREE.DirectionalLight(0xffffff);

light.position.set(0, 100, 60);
light.castShadow = true;
light.shadowCameraLeft = -60;
light.shadowCameraTop = -60;
light.shadowCameraRight = 60;
light.shadowCameraBottom = 60;
light.shadowCameraNear = 1;
light.shadowCameraFar = 1000;
light.shadowBias = -.0001
light.shadowMapWidth = light.shadowMapHeight = 1024;
light.shadowDarkness = .7;

scene.add(light);

var geometry = new THREE.CubeGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.set(10, 1, -20);
scene.add(cube);
camera.position.set(0,5,20);

var grounds = [],
    groundGeometry = new THREE.CubeGeometry(10, 1, 10, 10, 10),
    groundMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeeee });

for(var z=0;z<10;z++) {
  grounds[z] = [];
  for(var x=0;x<10;x++) {
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -3;
    ground.position.x = (x - 5) * 10;
    ground.position.z = (z - 5) * 10;
    scene.add(ground);
    grounds[z][x] = ground;
  }
}

var r = Math.round(Math.random() * 255),
    g = Math.round(Math.random() * 255),
    b = Math.round(Math.random() * 255);
var ball = new THREE.Mesh(
  new THREE.SphereGeometry(3, 16, 16),
  new THREE.MeshLambertMaterial({color: 'rgb(' + r + ',' + g + ',' + b + ')', reflectivity: .8})
);

ball.position.y = 1.5;
ball.add(camera);
scene.add(ball);
var baseGamma = undefined;
window.addEventListener("deviceorientation", function(e) {
  if(baseGamma === undefined) baseGamma = e.gamma;

  var dz = (e.gamma - baseGamma) / 90,
      ry = e.beta / 180;
  ball.translateZ(-dz);
  ball.rotation.y -= ry;
});
window.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
      case 37: // left arrow
        ball.rotation.y += 0.05;
        break;
      case 38: // up arrow
      ball.translateZ(-0.3);
        break;
      case 39: // right arrow
        ball.rotation.y -= 0.05;
        break;
      case 40: // down arrow
        ball.translateZ(0.3);
        break;
    }
});

var score = 0;

 var peer = new Peer({key: '7nxxqfxzhestt9'});

  peer.on('open', function(id) {
    alert(id);
  });

  peer.on('connection', function(c) {
    c.on('data', function(data) {
        var movement = JSON.parse(data);
        ball.translateZ(-(movement.dz));
        ball.rotation.y -= movement.ry;
    });
  });

function updateGame() {
	requestAnimationFrame(updateGame);
	renderer.render(scene, camera);
  var ballPos = ball.position, cubePos = cube.position;

  if(  (ballPos.x + 1 > cubePos.x - 0.5 && ballPos.z + 1 > cubePos.z - 0.5 && ballPos.z - 1 < cubePos.z + 0.5)
    || (ballPos.x - 1 < cubePos.x + 0.5 && ballPos.z + 1 > cubePos.z - 0.5 && ballPos.z - 1 < cubePos.z + 0.5)) {
    cube.position.x = -50 + Math.random() * 100;
    cube.position.z = -50 + Math.random() * 100;
    document.getElementById("score").textContent = "Score: " + (++score);
  }
}

updateGame();
