// Rover Variables
var camera = null;
var roverSkeleton = null;
var blackRubberMaterial = null;
var carbonMaterial = null;
var solarPanelMaterial = null;
var metalMaterial = null;
var roverSpeed = 0.0;
var roverForwardActive = false;
var roverBackwardActive = false;
var roverRightTurnActive = false;
var roverLeftTurnActive = false;
var roverMoveForwardAnim = null;
var roverStartStopAnim = null;
var roverTurnLeftAnim = null;
var roverTurnRightAnim = null;
var roverLeftPercent = 0.0;
var roverRightPercent = 0.0;
var roverRotation = 0.0;
var rover_fl_emitter_position = new BABYLON.Vector3(0.0, 0.0, 0.0);

// Main Function executed within the HTML
var createScene = function (canvas, engine) {

    // Get the query parameters to find the selected rover color
    console.log(window.location.search);
    var urlParams = new URLSearchParams(window.location.search);
    var roverColor = [0.0, 0.0, 0.0];
    if (urlParams.has("roverColor")) {
      var colorListString = urlParams.get("roverColor");
      var colorList = colorListString.substr(1, colorListString.length-2).split(",");
      console.log(colorList);
      roverColor = [parseFloat(colorList[0]), parseFloat(colorList[1]), parseFloat(colorList[2])];
    }

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a new camera
    var camera = addCamera(scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // Load HDRI information (skybox and lighting information)
  	loadHdri(scene);

    // Activate fog
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.0125;
    scene.fogColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    // Load the primary meshes
    loadRover(scene, camera, roverColor);
    loadLandscape(scene);
    console.log(scene);

    return scene;
};

function roverRenderLoop(scene) {
  // Update the rover speed
  if (roverForwardActive && roverSpeed < 0.15) {
    roverSpeed += 0.01;
  } else if (!roverForwardActive && roverSpeed > 0.0) {
    roverSpeed -= 0.001;
  }

  if (roverBackwardActive && roverSpeed > 0.02) {
    roverSpeed -= 0.02;
  }

  // Update our left/right turn percentage for blending
  if (roverLeftTurnActive && roverLeftPercent < 1.0) {
    roverLeftPercent += 0.1;
  } else if (!roverLeftTurnActive && roverLeftPercent > 0.0) {
    roverLeftPercent -= 0.1;
  }

  if (roverRightTurnActive && roverRightPercent < 1.0) {
    roverRightPercent += 0.1;
  } else if (!roverRightTurnActive && roverRightPercent > 0.0) {
    roverRightPercent -= 0.1;
  }

  if (roverSkeleton) {
    // Update the rover position
    roverSkeleton.position.z += roverSpeed * Math.sin(roverRotation);
    roverSkeleton.position.x += roverSpeed * Math.cos(roverRotation);

    // Update the rover rotation
    if (roverRightTurnActive) {
      var roverTurn = -((roverRightPercent * roverSpeed) / 20);
      roverSkeleton.rotate(BABYLON.Axis.Y, roverTurn, BABYLON.Space.LOCAL);
      roverRotation -= roverTurn;
    } else if (roverLeftTurnActive) {
      var roverTurn = ((roverLeftPercent * roverSpeed) / 20);
      roverSkeleton.rotate(BABYLON.Axis.Y, roverTurn, BABYLON.Space.LOCAL);
      roverRotation -= roverTurn;
    }

    // Update the currently running animation speed & weights
    roverMoveForwardAnim.speedRatio = roverSpeed * 10.0;
    roverMoveForwardAnim.setWeightForAllAnimatables(1.0 - (roverRightPercent + roverLeftPercent));
    roverTurnLeftAnim.speedRatio = roverSpeed * 10.0;
    roverTurnLeftAnim.setWeightForAllAnimatables(roverLeftPercent);
    roverTurnRightAnim.speedRatio = roverSpeed * 10.0;
    roverTurnRightAnim.setWeightForAllAnimatables(roverRightPercent);
  }

  // Render the scene
  scene.render();
};
