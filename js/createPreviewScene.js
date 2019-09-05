// Function to create the BabylonJS scene for the previewer
var createPreviewScene = function (canvas, engine) {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // Load the GLTF file into the scene
    BABYLON.SceneLoader.Append("assets/", "basicRover.glb", scene, function (scene) {
      console.log(scene);
    });

    return scene;
};
