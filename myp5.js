

var lyrics = [];

var /*bgimage,*/ searchResults1, searchResults2;


//function preload(){

  //bgimage = loadImage('bkg.jpg');

//}

function setup() {
  // create canvas
  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('myCanvasDiv');

  textAlign(CENTER);
  textSize(50);

  for (var i = 0; i < 100; i++) {
    lyrics[i] = new lyrics(random(width), random(height));
  }
}

function draw() {
   //image(bgimage, 0, 0, window.innerWidth, window.innerHeight);
  //image(bgimage, 0, 0, window.innerWidth, window.innerHeight);
 // if there is anything in the global lyrics variable
 for (var i = 0; i < lyrics.length; i++) {
    lyrics[i].run(lyrics);
  }
  if (lyrics) {
    fill(0);
    textSize(18);
    text(lyrics, 0, 0);

  } 
  if (searchResults1) {
    fill(0);
    textSize(32);
    text(searchResults1, 0, 0);

  } 
   if (searchResults2) {
    fill(0);
    textSize(32);
    text(searchResults2, 0, 0);

  }  
}

function lyrics(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

lyrics.prototype.run = function(lyrics) {
  this.flock(lyrics);
  this.update();
  this.borders();
  this.render();
};

// Forces go into acceleration
lyrics.prototype.applyForce = function(force) {
  this.acceleration.add(force);
};

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(lyrics) {
  var sep = this.separate(lyrics); // Separation
  var ali = this.align(lyrics);    // Alignment
  var coh = this.cohesion(lyrics); // Cohesion
  // Arbitrarily weight these forces
  sep.mult(2.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
};

// Method to update location
lyrics.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset acceleration to 0 each cycle
  this.acceleration.mult(0);
};

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
lyrics.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); // Limit to maximum steering force
  return steer;
};

// Draw boid as a circle--lyrics
lyrics.prototype.render = function() {
  fill(127, 127);
  stroke(200);
  //ellipse(this.position.x, this.position.y, 16, 16);
};

// Wraparound
lyrics.prototype.borders = function() {
  if (this.position.x < -this.r) this.position.x = width + this.r;
  if (this.position.y < -this.r) this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
};

// Separation
// Method checks for nearby boids and steers away
lyrics.prototype.separate = function(lyrics) {
  var desiredseparation = 25.0;
  var steer = createVector(0, 0);
  var count = 0;
  // For every boid in the system, check if it's too close
  for (var i = 0; i < lyrics.length; i++) {
    var d = p5.Vector.dist(this.position, lyrics[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position, lyrics[i].position);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++; // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
};

// Alignment
// For every nearby boid in the system, calculate the average velocity
lyrics.prototype.align = function(lyrics) {
  var neighbordist = 50;
  var sum = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < lyrics.length; i++) {
    var d = p5.Vector.dist(this.position, lyrics[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(lyrics[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
lyrics.prototype.cohesion = function(lyrics) {
  var neighbordist = 50;
  var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < lyrics.length; i++) {
    var d = p5.Vector.dist(this.position, lyrics[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(lyrics[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum); // Steer towards the location
  } else {
    return createVector(0, 0);
  }
};

 