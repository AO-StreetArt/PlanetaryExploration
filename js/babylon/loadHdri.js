var loadHdri = function(scene) {
  // Add the skybox (6 sky textures generated from an HDRI image)
  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
  skybox.position.y = -50;
  skybox.rotation.y = -1.4;
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skyBox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.fogEnabled = false;
  skybox.material = skyboxMaterial;

  // Load the HDRI lighting information
  scene.environmentTexture = new BABYLON.CubeTexture("assets/environment.env", scene);
}
