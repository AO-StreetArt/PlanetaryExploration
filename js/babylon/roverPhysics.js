// Rover Physics Module
// This implements only the specific physics-type functionality we need for the
// game, in a performant way

// Global variable which tracks the index of the current face the rover is on
var groundDataCurrentFaceIndex = -1;

class PlanarEquation {
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }
  evaluate(x, y) {
    return (this.d - this.a * x - this.b * y) / this.c
  }
}

var areVertsTheSame = function(vert1, vert2) {
  var TOLERANCE = 0.01;
  return (vert1.x - vert2.x < TOLERANCE && vert1.y - vert2.y < TOLERANCE && vert1.z - vert2.z < TOLERANCE);
}

// Derive an object from a mesh which can be kept in memory and
// rapidly used to convert a point into a corrected height value and a
// corrected rotation value(s)
var deriveRoverHeightRotationMap = function(scene) {
  // Iterate over the faces in the ground map
  for (var i = 0; i < groundPhysicsData.length; i++) {
    groundPhysicsData[i].neighbors = []
    var face = groundPhysicsData[i];

    // For each face in the physics data, add as attributes the indices
    //  of each face that is connected to it
    for (var j = 0; j < groundPhysicsData.length; j++) {
      var comparableFace = groundPhysicsData[j];
      for (var k = 0; k < 4; k++) {
        for (var l = 0; l < 4; l++) {
          if (areVertsTheSame(face.vertices[k], comparableFace.vertices[l])) {
            groundPhysicsData[i].neighbors.push(j);
          }
        }
      }
    }

    // For each face in the physics data, add as attributes the euler rotation
    // to get from (0,0,0) global rotation to the state of the plane

    // Start by deriving the rotation needed in axis-angle representation
    var planarVector1 = {
      "x": face.vertices[0].x - face.vertices[1].x,
      "y": face.vertices[0].y - face.vertices[1].y,
      "z": face.vertices[0].z - face.vertices[1].z
    };
    var planarVector2 = {
      "x": face.vertices[1].x - face.vertices[2].x,
      "y": face.vertices[1].y - face.vertices[2].y,
      "z": face.vertices[1].z - face.vertices[2].z
    };
    var normalVector = {
      "x": (planarVector1.y * planarVector2.z) - (planarVector1.z * planarVector2.y),
      "y": (planarVector1.z * planarVector2.x) - (planarVector1.x * planarVector2.z),
      "z": (planarVector1.x * planarVector2.y) - (planarVector1.y * planarVector2.x)
    };
    var normalVectorLength = Math.sqrt(Math.pow(normalVector.x, 2) + Math.pow(normalVector.y, 2) + Math.pow(normalVector.z, 2));
    var normalizedNormalVector = {
      "x": normalVector.x / normalVectorLength;,
      "y": normalVector.y / normalVectorLength;,
      "z": normalVector.z / normalVectorLength;
    };
    var dotProduct = normalizedNormalVector.z; // Simplified dot product because second vector is pointing straight up
    var axisOfRotation = {
      "x": normalizedNormalVector.y,
      "y": normalizedNormalVector.x,
      "z": 0.0
    };
    var angleOfRotation = Math.acos(dotProduct);

    // Convert from axis-angle representation to euler angles in Babylonjs coordinate system
    var eulerRotation = {
      // Bank
      "x": Math.atan2(axisOfRotation.x * Math.sin(angleOfRotation) - axisOfRotation.y * axisOfRotation.z * (1 - Math.cos(angleOfRotation)),
           1 - (Math.pow(axisOfRotation.y, 2) + Math.pow(axisOfRotation.z, 2)) * (1 - Math.cos(angleOfRotation))),
      // Attitude
      "z": Math.asin(axisOfRotation.x * axisOfRotation.y * (1 - Math.cos(angleOfRotation)) + axisOfRotation.z * Math.sin(angleOfRotation)),
      // Heading
      "y": Math.atan2(axisOfRotation.y * Math.sin(angleOfRotation) - axisOfRotation.x * axisOfRotation.z * (1 - Math.cos(angleOfRotation)),
           1 - (Math.pow(axisOfRotation.y, 2) + Math.pow(axisOfRotation.z, 2)) * (1 - Math.cos(angleOfRotation)))
    };

    // For each face in the physics data, calculate a planar equation
    var planarEquation = PlanarEquation(normalVector.x,
                                        normalVector.y,
                                        normalVector.z,
                                        normalVector.x * face.vertices[0].x + normalVector.y * face.vertices[0].y + normalVector.z * face.vertices[0].z);

    // Assign the Euler Rotations and Planar Equation as attributes on each face
    groundPhysicsData[i].eulerRotation = eulerRotation;
    groundPhysicsData[i].planarEquation = planarEquation;

  }
}

var isPointInPolygon = function(x, y, face) {
  // Is a 2d point in a 2d polygon?
  // Given a line segment between P0 (x0,y0) and P1 (x1,y1), another point P (x,y)
  // if (y - y0) (x1 - x0) - (x - x0) (y1 - y0) < 0, then the point is to the right
  // of the line segment.  If it is > 0, then the point is to the left, and if it
  // = 0, then the point is on the line.  If a point is to the left or right of
  // all line segments, then it is inside the polygon.
}

// Find the height and rotation of the rover based on it's position and the
// global HeightRotationMap
var findHeightRotationFromPosition = function(x, y, currentIndex) {
  if (groundDataCurrentFaceIndex < 0) {
    // If we are just starting the level, we need to search every face for the
    // rover to find it's starting point.
    for (var i = 0; i < groundPhysicsData.length; i++) {
      if (isPointInPolygon(x, y, groundPhysicsData[i])) {
        // TO-DO: Calculate height by evaluating planar equation

        // TO-DO: Set the current index
        groundDataCurrentFaceIndex = i;
        break;
      }
    }
  } else {
    // If currentIndex is set, start by looking at that index and neighbors
    if (isPointInPolygon(x, y, groundPhysicsData[groundDataCurrentFaceIndex])) {
      // TO-DO: Calculate height by evaluating planar equation
    } else {
      for (var i = 0; i < groundPhysicsData[groundDataCurrentFaceIndex].neighbors.length; i++) {
        var newFaceIndex = groundPhysicsData[groundDataCurrentFaceIndex].neighbors[i];
        if (isPointInPolygon(x, y, groundPhysicsData[newFaceIndex])) {
          // TO-DO: Calculate height by evaluating planar equation

          // TO-DO: Set the current index
          groundDataCurrentFaceIndex = i;
          break;
        }
      }
    }
  }
}

// Derive an object from a collection of meshes which can be kept in memory and
// rapidly used to detect collisions against a point and determine the result
var deriveRoverCollisionMap = function(scene) {

}
