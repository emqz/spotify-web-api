console.log("loading sketch.js...")

function setup() {
  var myCanvas = createCanvas(500, 500);
  myCanvas.parent("flower-visualiser");

  // let meanDanceability = meanmeanDanceability || 0;
  // let meanValence = meanmeanValence || 0;
  // let meanMode = meanmeanMode || 0;
  // let meanEnergy = meanmeanEnergy || 0;

  console.log("meanDanceability:", window.meanDanceability);
  console.log("meanValence:", window.meanValence);
  console.log("meanMode:", window.meanMode);
  console.log("meanEnergy:", window.meanEnergy);
}

function draw() {

  // Spiral variables
  let angle1 = 0;
  let radius1 = 1; // Initial radius
  let angleIncrement1 = map(meanDanceability, 0, 1, 0.03, 10);
  let radiusIncrement1 = map(meanDanceability, 0, 1, 0.3, 0.9); 

  let backgroundColor = lerpColor(color(14, 17, 71), color(207, 255, 254), meanMode);
  let flowerColor1 = lerpColor(color(179, 21, 84), color(255, 194, 223), meanEnergy);
  let flowerColor2 = lerpColor(color(29, 162, 163), color(248, 255, 181), meanValence);
  let circleColor = lerpColor(color(80, 50, 142), color(255, 249, 218), meanMode);
  let spiralColor = lerpColor(color(134, 151, 219), color(246, 222, 255), meanDanceability);
  
  background(backgroundColor);
  translate(width / 2, height / 2); // Move origin to the center
  
  // Draw flower 1
  let numPetals = int(map(meanEnergy, 0, 1, 5, 7));
  let angleIncrement2 = TWO_PI / numPetals;
  
  for (let i = 0; i < numPetals; i++) {
    let angle2 = i * angleIncrement2;
    push();
    rotate(angle2 + map(meanEnergy, 0, 1, 0, 360));
    beginShape(); // Petal shape
    noStroke();
    fill(flowerColor1);
    ellipse(0, 140, 126);
    triangle(0, 0, 60, 120, -60, 120);
    endShape(CLOSE);
    pop();
  }
  
  // Draw flower 2
  let numPetals2 = int(map(meanValence, 0, 1, 5, 7));
  let angleIncrement3 = TWO_PI / numPetals2;

  for (let i = 0; i < numPetals2; i++) {
    let angle3 = i * angleIncrement3;
    push();
    rotate(angle3+map(meanValence, 0, 1, 0, 360));
    beginShape(); // Petal shape
    noStroke();
    fill(flowerColor2);
    ellipse(0, 100, 82);
    triangle(0, 0, 36, 80, -36, 80);
    ellipse(0, 0, 30); // Centre
    endShape(CLOSE);
    pop();
  }
  
  // Draw circles
  for (let i = 1; i <= 5; i++) {
    noFill();
    stroke(circleColor);
    strokeWeight(3);
    let ellipseWidth = i * 100 * map(meanEnergy, 0, 1, 1, 2); // Vary width of ellipse based on meanEnergy
    ellipse(0, 0, ellipseWidth, i * 100);
  }

  // Draw spiral
  for (let a = 0; a < 1000; a++) { // Draw a certain number of points
    let x = radius1 * cos(angle1);
    let y = radius1 * sin(angle1);
    noStroke();
    fill(spiralColor);
    ellipse(x, y, 5, 5); // Draw point

    angle1 += angleIncrement1; // Increment angle
    radius1 += radiusIncrement1; // Increment radius
  }
}
