var createParticleSystem = function(scene, emitter) {
  // Setup particle systems emitted from the loaded mesh
  var lf_tire_system = new BABYLON.ParticleSystem("lf_particles", 2000, scene);
  shared_particle_texture = new BABYLON.Texture("/assets/particleTexture.png", scene);
  lf_tire_system.particleTexture = shared_particle_texture;
  lf_tire_system.emitter = emitter;
  lf_tire_system.start();
  // Size of each particle (random between...)
  lf_tire_system.minSize = 0.05;
  lf_tire_system.maxSize = 0.5;
}

var loadRover = function(scene, camera, roverColor) {
  // Load the GLTF file into the scene
  BABYLON.SceneLoader.Append("assets/", "basicRover.glb", scene, function (scene) {

      console.log("Starting Rover Import, identifying imported elements in scene")
      for (var i = 0; i < scene.meshes.length; i++) {
        if (scene.meshes[i].name == "Plane") {
          roverSkeleton = scene.meshes[i];
        }
      }
      for (var i = 0; i < scene.animationGroups.length; i++) {
        var animGroupName = scene.animationGroups[i].name;
        if (animGroupName == "Armature|Armature|RollForward|Armature|RollForward") {
          roverMoveForwardAnim = scene.animationGroups[i];
        } else if (animGroupName == "Armature|Armature|TurnRight|Armature|TurnRight") {
          roverTurnRightAnim = scene.animationGroups[i];
        } else if (animGroupName == "Armature|Armature|TurnLeft|Armature|TurnLeft") {
          roverTurnLeftAnim = scene.animationGroups[i];
        } else if (animGroupName == "Armature|Armature|StartEndRolling|Armature|StartEndRolling") {
          roverStartStopAnim = scene.animationGroups[i];
        }
      }

      console.log("Updating Rover Color");
      for (var i = 0; i < scene.animationGroups.length; i++) {
        if (scene.materials[i].name == "default material") {
          scene.materials[i].albedoColor = new BABYLON.Vector3(roverColor[0] * 0.01, roverColor[1] * 0.01, roverColor[2] * 0.01); // Steel Material Diffuse Color
        }
      }

      console.log("Starting Animations");
      roverMoveForwardAnim.setWeightForAllAnimatables(1.0);
      roverTurnLeftAnim.setWeightForAllAnimatables(0.0);
      roverTurnLeftAnim.play(true);
      roverTurnRightAnim.setWeightForAllAnimatables(0.0);
      roverTurnRightAnim.play(true);

      console.log("Targeting Camera to mesh");
      camera.lockedTarget = roverSkeleton;

      // Prevent frustum clipping on imported meshes (Bugfix)
      console.log("Disabling Frustum clipping");
      for (i = 2; i < scene.meshes.length; i++) {
        scene.meshes[i].alwaysSelectAsActiveMesh = true;
      }

      // Setup particle systems emitted from the loaded mesh
      // createParticleSystem(scene, scene.meshes[10]);
  }); // BABYLON.SceneLoader.Append
}
