var loadLandscape = function(scene) {
  // Load the GLTF file into the scene
    BABYLON.SceneLoader.Append("assets/", "victoriaCrater.glb", scene, function (scene) {
        console.log("Starting landscape import");

        // Perform some pre-processing steps across each mesh
        for (var i = 0; i < scene.meshes.length; i++) {
          var meshName = scene.meshes[i].name;

          // Hide physics meshes
          if (meshName.includes("Physics")) {
            console.log("Hiding Mesh: " + meshName)
            scene.meshes[i].setEnabled(false);
          }

          // Find the high quality landscape meshes
          if (meshName.includes("highQuality") && !(meshName.endsWith("parent"))) {

            // Assign low quality landscape meshes to LOD levels for high quality
            console.log("Found high quality landscape mesh: " + meshName);
            for (var j = 0; j < scene.meshes.length; j++) {
              var lqMeshName = scene.meshes[j].name;
              if (!(lqMeshName.endsWith("parent")) && lqMeshName.includes("midQuality") && lqMeshName.includes(meshName.substring(meshName.length - 3, meshName.length))) {
                scene.meshes[i].addLODLevel(30, scene.meshes[j]);
                console.log("Assigning low quality mesh as LOD level " + lqMeshName);
              }
            }
          }

          // Find the high quality rock meshes
          if (meshName.includes("Rock_Desert") && !(meshName.includes("_instance_")) && !(meshName.includes("lowPoly"))) {
            console.log("Found rock mesh: " + meshName);

            // Assign lowPoly rocks to LOD of rocks
            for (var j = 0; j < scene.meshes.length; j++) {
              var lqRockName = scene.meshes[j].name;
              if (lqRockName.includes("Rock_Desert") && lqRockName.includes("lowPoly") && !(lqRockName.includes("_instance_")) && lqRockName.includes(meshName.substring(meshName.length - 8, meshName.length))) {
                console.log("Assigning low quality rock mesh as LOD level " + lqRockName);
                scene.meshes[i].addLODLevel(30, scene.meshes[j]);
              }
            }

            console.log("Generating instances for rock mesh: " + meshName);
            var numInstances = 13;
            if (meshName.includes("Large")) {
              numInstances = 4;
            }

            // Create rock instances in a loop
            for (var k = 0; k < numInstances; k++) {

              // Add an instance
              var instanceName = meshName + "_instance_" + k;
              console.log("Creating instance with name: " + instanceName);
              var newInstance = scene.meshes[i].createInstance(instanceName);

              // Select a vertex to assign the instance to
              var vertexData = rockInstanceVerts.pop();
              console.log("Moving to position: [" + vertexData[0] + ", " + vertexData[2] + ", " + vertexData[1]);
              newInstance.position.x = vertexData[0];
              newInstance.position.y = vertexData[2];
              newInstance.position.z = vertexData[1];

              // Apply a random rotation and scaling to the instance
              newInstance.rotate(BABYLON.Axis.X, Math.random(), BABYLON.Space.LOCAL);
              newInstance.rotate(BABYLON.Axis.Y, Math.random(), BABYLON.Space.LOCAL);
              newInstance.rotate(BABYLON.Axis.Z, Math.random(), BABYLON.Space.LOCAL);
              var newScale = Math.random() + 0.5;
              newInstance.scaling.x *= newScale;
              newInstance.scaling.y *= newScale;
              newInstance.scaling.z *= newScale;
            }
          }

          // Load up physics data
          if (scene.meshes[i].name == "Physics_Ground") {
            deriveRoverHeightRotationMap(scene, groundPhysicsFaces);
          }
        }

    }); // BABYLON.SceneLoader.Append
}
