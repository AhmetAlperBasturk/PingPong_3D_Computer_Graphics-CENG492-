// 3d pingpong game

// Emin Takim 15118083
// Ahmet Alper Baştürk 191180764
// Elif Berfin Gülbaş 181180037

// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 200, fieldHeight = 150;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 1.2;

// score-hold variables
var score1 = 0, score2 = 0;
var maxScore = 5;


function setup()
{
	// print max score for match win
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";

	// now reset scores
	score1 = 0;
	score2 = 0;

	// set up all the 3D objects in the scene
	createScene();

	draw();
}

function createScene()
{
	//scene size
	var WIDTH = 840,
	  HEIGHT = 460;

	//camera attributes
	var VIEW_ANGLE = 45,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing surface plane
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;

	// create the paddle1's material
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
	// create the paddle2's material
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x03D0BA
		});
	// create the plane's material
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xE80D0D
		});
	// create the table's material
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x163108
		});

	// create the ground's material
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x4C1130
		});


	// create the playing surface plane
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.85,
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);

	scene.add(plane);
	plane.receiveShadow = true;

	var table = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1.05,	
		planeHeight * 1.03,
		100,			
		planeQuality,
		planeQuality,
		1),

	  tableMaterial);
	table.position.z = -51;	
	scene.add(table);
	table.receiveShadow = true;

	// set up the sphere vars
	var radius = 8,
		segments = 6,
		rings = 6;

	//create the sphere's material
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x000000
		});

	// Create a ball with sphere geometry
	ball = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	//add the sphere to the scene
	scene.add(ball);

	ball.position.x = 0;
	ball.position.y = 0;
	//set ball above the table surface
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;

	// set up the paddle vars
	paddleWidth = 5;
	paddleHeight = 30;
	paddleDepth = 20;
	//paddleQuality = 1;

	paddle1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle1Material);

	// add the paddle1 to the scene
	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;

	paddle2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle2Material);

	//  add paddle2 the to the scene
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;

	// set paddles on each side of the table
	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;

	// lift paddles over playing surface
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;


	// adding a ground plane
	var ground = new THREE.Mesh(

	  new THREE.CubeGeometry(
	  1000,
	  1000,
	  3,
	  1,
	  1,
	  1 ),

	  groundMaterial);
    // set ground to random z position to shadowing
	ground.position.z = -132;
	ground.receiveShadow = true;
	scene.add(ground);

	//create a point light
	pointLight =
	  new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.4;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);

	// add a spot light
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 3.0;
    spotLight.castShadow = true;
    scene.add(spotLight);

	renderer.shadowMapEnabled = true;
}

function draw()
{
	// draw THREE.JS scene
	renderer.render(scene, camera);
	// loop draw function call
	requestAnimationFrame(draw);

	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	player2PaddleMovement();
}

function ballPhysics()
{
	// if ball goes off the 'left' side (Player1's side)
	if (ball.position.x <= -fieldWidth/2)
	{
		// player2 scores
		score2++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(2);
		matchScoreCheck();
	}

	// if ball goes off the 'right' side (player2's side)
	if (ball.position.x >= fieldWidth/2)
	{
		// Player1 scores
		score1++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(1);
		matchScoreCheck();
	}

	// if ball goes off the top side (side of table)
	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	// if ball goes off the bottom side (side of table)
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}

	// update ball position by time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;

	// limit ball's y-speed to 2x the x-speed

	// silinebilir
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
	// silinebilir
}

// Handles player2 paddle movement and logic
function player2PaddleMovement()
{
	// move forward
	if (Key.isDown(Key.down)) // paddle1.position.x < -60 && 
	{
		// if paddle is not touching the side of table move it
	
		paddle2.position.x -= 1
		// else don't move and stretch the paddle
		// to indicate can't move
	}
	// move backward
	if (paddle2.position.x < fieldWidth / 2 - 3 && Key.isDown(Key.up))
	{
		// if paddle is not touching the side of table move it
		
		paddle2.position.x += 1
		// else don't move and stretch the paddle
		// to indicate can't move
	}	
	// move left
	if (Key.isDown(Key.left))
	{
		// if paddle is not touching the side of table
		if (paddle2.position.y < fieldHeight * 0.45)
		{
			paddle2DirY = paddleSpeed * 0.5;
		}
	
		else
		{
			paddle2DirY = 0;

		}
	}
	// move right
	else if (Key.isDown(Key.right))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle2.position.y > -fieldHeight * 0.45)
		{
			paddle2DirY = -paddleSpeed * 0.5;
		}

		else
		{
			paddle2DirY = 0;

		}
	}

	else
	{
		// stop the paddle
		paddle2DirY = 0;
	}

	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
	paddle1.scale.z += (1 - paddle2.scale.z) * 0.2;
	paddle2.position.y += paddle2DirY;
}

// Handles player1's paddle movement
function playerPaddleMovement()
{
	// move forward
	if (Key.isDown(Key.W)) // paddle1.position.x < -60 && 
	{
		// if paddle is not touching the side of table move it
	
		paddle1.position.x += 1
		// else don't move and stretch the paddle
		// to indicate can't move
	}
	// move backward
	if (paddle1.position.x > -1 * fieldWidth / 2 && Key.isDown(Key.S))
	{
		// if paddle is not touching the side of table move it
		
		paddle1.position.x -= 1
		// else don't move and stretch the paddle
		// to indicate can't move
	}
	// move left
	if (Key.isDown(Key.A))
	{
		// if paddle is not touching the side of table move it
	
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		// else don't move and stretch the paddle
		// to indicate can't move
		else
		{
			paddle1DirY = 0;

		}
	}
	// move right
	else if (Key.isDown(Key.D))
	{
		// if paddle is not touching the side of table
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirY = 0;

		}
	}
	
	else
	{
		// stop the paddle
		paddle1DirY = 0;
	}

	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
	paddle1.position.y += paddle1DirY;
}

// Handles camera and lighting logic
function cameraPhysics()
{
	// see shadows if dynamically move lights during the game
	spotLight.position.x = ball.position.x * 2;
	spotLight.position.y = ball.position.y * 2;

	// move to behind the player1's paddle
	camera.position.x = paddle1.position.x - 100;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);

	// rotate to face towards the player2
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// Handles paddle collision logic
function paddlePhysics()
{
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		//if ball is aligned with paddle1 on y plane
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirX < 0)
			{
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}

	// PLAYER2 PADDLE LOGIC

	// if ball is aligned with paddle2 on x plane
	// the position is the CENTER of the object
	// (one-way collision)
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{
		// and if ball is aligned with paddle2 on y plane
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards opponent (+ve direction)
			if (ballDirX > 0)
			{
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

function resetBall(loser)
{
	// position the ball in the center of the table
	ball.position.x = 0;
	ball.position.y = 0;

	// if player lost the last point, send the ball to opponent
	if (loser == 1)
	{
		ballDirX = -1;
		paddle1.position.x = -fieldWidth/2 + paddleWidth;
		paddle2.position.x = fieldWidth/2 - paddleWidth;
	}
	// else if opponent lost, send ball to player
	else
	{
		ballDirX = 1;
		paddle1.position.x = -fieldWidth/2 + paddleWidth;
		paddle2.position.x = fieldWidth/2 - paddleWidth;
	}

	// set the ball to move +ve in y plane (towards left from the camera)
	ballDirY = 1;
}


// checks if either player or opponent has reached 5 points
function matchScoreCheck()
{
	// if player has 5 points
	if (score1 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "Player1 wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
	
	}
	// else if opponent has 5 points
	else if (score2 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "Player2 wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		
	}
}