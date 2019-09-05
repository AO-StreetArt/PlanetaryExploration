var addCamera = function(scene) {
  // Parameters: name, position, scene
  var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, 10), scene);

  // The goal distance of camera from target
  camera.radius = 10;

  // The goal height of camera above local origin (centre) of target
  camera.heightOffset = 5;

  // The goal rotation of camera around local origin (centre) of target in x y plane
  camera.rotationOffset = 25;

  // Acceleration of camera in moving from current to goal position
  camera.cameraAcceleration = 0.005

  // The speed at which acceleration is halted
  camera.maxCameraSpeed = 10

  return camera
}
