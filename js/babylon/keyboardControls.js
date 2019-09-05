// Use a given action manager to setup the keyboard inputs for the game
var createKeyboardControls = function (actionManager) {
  // Setup the 'w' key to move forward
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: 'w'
      },
      function () { roverForwardActive = true; }
    )
  );
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyUpTrigger,
        parameter: 'w'
      },
      function () { roverForwardActive = false; }
    )
  );

  // Setup the 's' key to move backward
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: 's'
      },
      function () { roverBackwardActive = true; }
    )
  );
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyUpTrigger,
        parameter: 's'
      },
      function () { roverBackwardActive = false; }
    )
  );

  // Setup the 'a' key to steer left
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: 'a'
      },
      function () { roverLeftTurnActive = true; }
    )
  );
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyUpTrigger,
        parameter: 'a'
      },
      function () { roverLeftTurnActive = false; }
    )
  );

  // Setup the 'd' key to steer left
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: 'd'
      },
      function () { roverRightTurnActive = true; }
    )
  );
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyUpTrigger,
        parameter: 'd'
      },
      function () { roverRightTurnActive = false; }
    )
  );
};
