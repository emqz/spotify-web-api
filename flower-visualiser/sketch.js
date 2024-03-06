const sketch = (p) => {
  let danceability = 1;
  let valence = 1;
  let mode = 1;
  let energy = 1;

  p.setup = () => {
    let myCanvas = p.createCanvas(500, 500);
    myCanvas.parent("flower-visualiser");
  };

  p.draw = () => {
    p.noLoop();

    // Spiral variables
    let angle1 = 0;
    let radius1 = 1; // Initial radius
    let angleIncrement1 = p.map(danceability, 0, 1, 0.03, 10);
    let radiusIncrement1 = p.map(danceability, 0, 1, 0.3, 0.9);

    let backgroundColor = p.lerpColor(p.color(16, 17, 61), p.color(73, 200, 243), mode);
    let flowerColor1 = p.lerpColor(p.color(170, 29, 65), p.color(255, 177, 214), energy);
    let flowerColor2 = p.lerpColor(p.color(38, 188, 190), p.color(248, 255, 181), valence);
    let circleColor = p.lerpColor(p.color(80, 50, 142), p.color(255, 249, 218), mode);
    let spiralColor = p.lerpColor(p.color(134, 151, 219), p.color(246, 222, 255), danceability);

    p.background(backgroundColor);
    p.translate(p.width / 2, p.height / 2); // Move origin to the center

    // Draw flower 1
    let numPetals = p.int(p.map(energy, 0, 1, 5, 7));
    let angleIncrement2 = p.TWO_PI / numPetals;

    for (let i = 0; i < numPetals; i++) {
      let angle2 = i * angleIncrement2;
      p.push();
      p.rotate(angle2 + p.map(energy, 0, 1, 0, 360));
      p.beginShape(); // Petal shape
      p.noStroke();
      p.fill(flowerColor1);
      p.ellipse(0, 140, 126);
      p.triangle(0, 0, 60, 120, -60, 120);
      p.endShape(p.CLOSE);
      p.pop();
    }

    // Draw flower 2
    let numPetals2 = p.int(p.map(valence, 0, 1, 5, 7));
    let angleIncrement3 = p.TWO_PI / numPetals2;

    for (let i = 0; i < numPetals2; i++) {
      let angle3 = i * angleIncrement3;
      p.push();
      p.rotate(angle3 + p.map(valence, 0, 1, 0, 360));
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
    for (let i = 1; i <= 5; i++) {
      p.noFill();
      p.stroke(circleColor);
      p.strokeWeight(3);
      let ellipseWidth = i * 100 * p.map(energy, 0, 1, 1, 2); // Vary width of ellipse based on energy
      p.ellipse(0, 0, ellipseWidth, i * 100);
    }

    // Draw spiral
    for (let a = 0; a < 1000; a++) { // Draw a certain number of points
      let x = radius1 * p.cos(angle1);
      let y = radius1 * p.sin(angle1);
      p.noStroke();
      p.fill(spiralColor);
      p.ellipse(x, y, 5, 5); // Draw point

      angle1 += angleIncrement1; // Increment angle
      radius1 += radiusIncrement1; // Increment radius
    }
  };
};

let myp5 = new p5(sketch);
