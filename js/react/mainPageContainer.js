'use strict';

const e = React.createElement;

// Convenience Function to convert Hexidecimal colors to RGB
// Stolen from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

// Button which redirects to the actual game page
class PlayButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: props.name };
  }

  redirectToGame() {
    var roverName = document.getElementById("roverList").value;
    var levelName = document.getElementById("levelList").value;
    var colorValues = hexToRgb(document.getElementById("color_picker").value);
    window.location.href="/game.html?rover=" + roverName + "&levelName=" + levelName + " &roverColor=(" + colorValues[0] + "," + colorValues[1] + "," + colorValues[2] + ")";
  }

  render() {
    return (
      <button onClick={() => this.redirectToGame()}>
        Play
      </button>
    );
  }
}

// List of Rover Options
class RoverList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: props.name, val: "basic" };
  }

  render() {
    return (
      <div>
        Rover: <select id="roverList" name={this.state.name} onChange={() => this.setState({val: document.getElementById("roverList").value})}>
          <option value="basic">Basic</option>
          <option value="speed">Speed</option>
        </select>
      </div>
    );
  }
}

// List of Level Options
class LevelList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: props.name, val: "mars" };
  }

  render() {
    return (
      <div>
        Level: <select id="levelList" name={this.state.name} onChange={() => this.setState({val: document.getElementById("levelList").value})}>
          <option value="mars">Mars</option>
          <option value="moon">Moon</option>
        </select>
      </div>
    );
  }
}

// Color Picker for the Rover
class RoverColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: props.name };
  }

  updateBabylonAlbedoColor() {
    var colorValues = hexToRgb(document.getElementById("color_picker").value);
    scene.materials[2].albedoColor = new BABYLON.Vector3(colorValues[0] * 0.01, colorValues[1] * 0.01, colorValues[2] * 0.01);
  }

  render() {
    return (
      <div>
        Rover Color: <input id="color_picker" type="color" defaultValue="#b0b8c2" name={this.state.name} onChange={() => this.updateBabylonAlbedoColor()} />
      </div>
    );
  }
}

// Main Container for the page which renders the other react components
class MainPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <RoverList name="Rover List" />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <RoverColorPicker name="Color Picker" />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <LevelList name="Level List" />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <PlayButton name="Play" />
          </div>
        </div>
      </div>
    );
  }
}

// Initialize the ReactDOM
const domContainer = document.querySelector('#main_page_container');
ReactDOM.render(e(MainPageContainer), domContainer);
