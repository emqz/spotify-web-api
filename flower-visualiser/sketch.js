let danceability = 1;
let valence = 1;
let mode = 1;
let energy = 1;

function setup() {
  createCanvas(500, 500);
}

function draw() {
  noLoop();
  
// Spiral variables
  let angle1 = 0;
  let radius1 = 1; // Initial radius
  let angleIncrement1 = map(danceability, 0, 1, 0.03, 10);
  let radiusIncrement1 = map(danceability, 0, 1, 0.3, 0.9); 
  
  let backgroundColor = lerpColor(color(16, 17, 61), color(73, 200, 243), mode);
  let flowerColor1 = lerpColor(color(170, 29, 65), color(255, 177, 214), energy);
  let flowerColor2 = lerpColor(color(38, 188, 190), color(248, 255, 181), valence);
  let circleColor = lerpColor(color(80, 50, 142), color(255, 249, 218), mode);
  let spiralColor = lerpColor(color(134, 151, 219), color(246, 222, 255), danceability);
  
  background(backgroundColor);
  translate(width / 2, height / 2); // Move origin to the center
  
  // Draw flower 1
  let numPetals = int(map(energy, 0, 1, 5, 7));
  let angleIncrement2 = TWO_PI / numPetals;
  
  for (let i = 0; i < numPetals; i++) {
    let angle2 = i * angleIncrement2;
    push();
    rotate(angle2 + map(energy, 0, 1, 0, 360));
    beginShape(); // Petal shape
    noStroke();
    fill(flowerColor1);
    ellipse(0, 140, 126);
    triangle(0, 0, 60, 120, -60, 120);
    endShape(CLOSE);
    pop();
  }
  
  // Draw flower 2
  let numPetals2 = int(map(valence, 0, 1, 5, 7));
  let angleIncrement3 = TWO_PI / numPetals2;

  for (let i = 0; i < numPetals2; i++) {
    let angle3 = i * angleIncrement3;
    push();
    rotate(angle3+map(valence, 0, 1, 0, 360));
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
    let ellipseWidth = i * 100 * map(energy, 0, 1, 1, 2); // Vary width of ellipse based on energy
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
