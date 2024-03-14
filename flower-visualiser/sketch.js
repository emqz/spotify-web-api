// sketch.js
var sketch = function(p) {
  var button;

  p.setup = function() {
      var myCanvas = p.createCanvas(500, 500);
      myCanvas.parent("flower-visualiser");

      button = p.createButton('Save image');
      button.mousePressed(p.saveImage);
      button.id('save-button');
  };

  p.draw = function() {
      // Spiral variables
      var angle1 = 0;
      var radius1 = 1;
      var angleIncrement1 = p.map(window.meanDanceability, 0, 1, 0.03, 10);
      var radiusIncrement1 = p.map(window.meanDanceability, 0, 1, 0.3, 0.9); 

      var backgroundColor = p.lerpColor(p.color(14, 17, 71), p.color(207, 255, 254), window.meanMode);
      var flowerColor1 = p.lerpColor(p.color(179, 21, 84), p.color(255, 194, 223), window.meanEnergy);
      var flowerColor2 = p.lerpColor(p.color(29, 162, 163), p.color(248, 255, 181), window.meanValence);
      var circleColor = p.lerpColor(p.color(80, 50, 142), p.color(255, 249, 218), window.meanMode);
      var spiralColor = p.lerpColor(p.color(134, 151, 219), p.color(246, 222, 255), window.meanDanceability);
      
      p.background(backgroundColor);
      p.translate(p.width / 2, p.height / 2); 
      
      // Draw flower 1
      var numPetals = p.int(p.map(window.meanEnergy, 0, 1, 5, 7));
      var angleIncrement2 = p.TWO_PI / numPetals;
      
      for (var i = 0; i < numPetals; i++) {
          var angle2 = i * angleIncrement2;
          p.push();
          p.rotate(angle2 + p.map(window.meanEnergy, 0, 1, 0, 360));
          p.beginShape(); // Petal shape
          p.noStroke();
          p.fill(flowerColor1);
          p.ellipse(0, 140, 126);
          p.triangle(0, 0, 60, 120, -60, 120);
          p.endShape(p.CLOSE);
          p.pop();
      }
      
      // Draw flower 2
      var numPetals2 = p.int(p.map(window.meanValence, 0, 1, 5, 7));
      var angleIncrement3 = p.TWO_PI / numPetals2;

      for (var j = 0; j < numPetals2; j++) {
          var angle3 = j * angleIncrement3;
          p.push();
          p.rotate(angle3+p.map(window.meanValence, 0, 1, 0, 360));
          p.beginShape(); // Petal shape
          p.noStroke();
          p.fill(flowerColor2);
          p.ellipse(0, 100, 82);
          p.triangle(0, 0, 36, 80, -36, 80);
          p.ellipse(0, 0, 30); // Centre
          p.endShape(p.CLOSE);
          p.pop();
      }
      
      // Draw circles
      for (var k = 1; k <= 5; k++) {
          p.noFill();
          p.stroke(circleColor);
          p.strokeWeight(3);
          var ellipseWidth = k * 100 * p.map(window.meanEnergy, 0, 1, 1, 2);
          p.ellipse(0, 0, ellipseWidth, k * 100);
      }

      // Draw spiral
      for (var a = 0; a < 1000; a++) { // Draw a certain number of points
          var x = radius1 * p.cos(angle1);
          var y = radius1 * p.sin(angle1);
          p.noStroke();
          p.fill(spiralColor);
          p.ellipse(x, y, 5, 5); // Draw point

          angle1 += angleIncrement1; // Increment angle
          radius1 += radiusIncrement1; // Increment radius
      }
  };

  p.saveImage = function() {
    p.save("image.png");
  }
};

new p5(sketch, 'flower-visualiser');

// danceability-indicator.js
var danceabilityIndicator = function(p) {

  p.setup = function() {
      var myCanvas = p.createCanvas(256, 30);
      myCanvas.parent("danceability-indicator");
      p.noLoop();
  };

  p.draw = function() {
      var startX = 0;
      var endX = 246;
      
      var currentX = p.map(window.meanDanceability, 0, 1, startX, endX);
      
      p.fill(255);
      p.noStroke();
      p.rect(currentX, 0, 10, p.height, 30);
  };
};

new p5(danceabilityIndicator, 'danceability-indicator');

var mode1Indicator = function(p) {

  p.setup = function() {
      var myCanvas = p.createCanvas(256, 30);
      myCanvas.parent("mode1-indicator");
      p.noLoop();
  };

  p.draw = function() {
      var startX = 0;
      var endX = 246;
      
      var currentX = p.map(window.meanMode, 0, 1, startX, endX);
      
      p.fill(255);
      p.noStroke();
      p.rect(currentX, 0, 10, p.height, 30);
  };
};

new p5(mode1Indicator, 'mode1-indicator');

var mode2Indicator = function(p) {

  p.setup = function() {
      var myCanvas = p.createCanvas(256, 30);
      myCanvas.parent("mode2-indicator");
      p.noLoop();
  };

  p.draw = function() {
      var startY = 0;
      var endY = 246;
      
      var currentY = p.map(window.meanMode, 0, 1, startY, endY);
      
      p.fill(255);
      p.noStroke();
      p.rect(currentY, 0, 10, p.height, 30);
  };
};

new p5(mode2Indicator, 'mode2-indicator');

var energyIndicator = function(p) {

  p.setup = function() {
      var myCanvas = p.createCanvas(256, 30);
      myCanvas.parent("energy-indicator");
      p.noLoop();
  };

  p.draw = function() {
      var startX = 0;
      var endX = 246;
      
      var currentX = p.map(window.meanEnergy, 0, 1, startX, endX);
      
      p.fill(255);
      p.noStroke();
      p.rect(currentX, 0, 10, p.height, 30);
  };
};

new p5(energyIndicator, 'energy-indicator');

var valenceIndicator = function(p) {

  p.setup = function() {
      var myCanvas = p.createCanvas(256, 30);
      myCanvas.parent("valence-indicator");
      p.noLoop();
  };

  p.draw = function() {
      var startX = 0;
      var endX = 246;
      
      var currentX = p.map(window.meanValence, 0, 1, startX, endX);
      
      p.fill(255);
      p.noStroke();
      p.rect(currentX, 0, 10, p.height, 30);
  };
};

new p5(valenceIndicator, 'valence-indicator');
