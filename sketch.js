var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var ground, invisibleGround, groundImage;

var badgesGroup, badgeImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  
  boy_running = loadAnimation("run1.png-removebg-preview.png","run2.png-removebg-preview.png","run3.png-removebg-preview.png");
  //boy_collided = loadAnimation("trex_collided.png");
  boy_collided = loadAnimation("run1.png-removebg-preview.png");
  groundImage = loadImage("flag.png");
  badgeImage1 = loadImage("b1.png");
  badgeImage2 = loadImage("b2.png");
  badgeImage3 = loadImage("b3.png");
  badgeImage4 = loadImage("b4.png");
  badgeImage5 = loadImage("b5.png");

  obstacle1 = loadImage("hud-removebg-preview.png");
  obstacle2 = loadImage("hud-removebg-preview.png");
  obstacle3 = loadImage("hud-removebg-preview.png");
  obstacle4 = loadImage("hud-removebg-preview.png");
  obstacle5 = loadImage("hud-removebg-preview.png");
  obstacle6 = loadImage("hud-removebg-preview.png");
  
  //restartImg = loadImage("restart.png")
  restartImg = loadImage("reset-removebg-preview (1).png")
  //gameOverImg = loadImage("gm3-removebg-preview.png")
  gameOverImg = loadImage("off.png")
  
  jumpSound = loadSound("jump.mp3")
  //jumpSound = loadSound("fullsong.mp2.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1500,450);
  
  boy = createSprite(50,200,20,50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.scale = 0.5;
  
  ground = createSprite(75,350,7000,10);
 //ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(700,230,3000,1500);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;
  
  //restart = createSprite(750,140,50,30);
  restart = createSprite(750,410,50,30);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(70,350,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and badge Groups
  obstaclesGroup = createGroup();
  badgesGroup = createGroup();
  //boy.setCollider("rectangle",0,0,boy.width,boy.height);
  //boy.debug = true
  score = 0;
}
function draw() {
  console.log(getFrameRate())
  background(groundImage);
  //displaying score
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& boy.y >= 100) {
        boy.velocityY = -12;
        jumpSound.play();
    }
    //add gravity
    boy.velocityY = boy.velocityY + 0.8 
    //spawn the badges
    spawnbadges(); 
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(boy)){
        //boy.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the boy animation
      boy.changeAnimation("collided", boy_collided);
    
     
     
      ground.velocityX = 0;
      boy.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    badgesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     badgesGroup.setVelocityXEach(0);    
   }
  
 
  //stop boy from falling down
  boy.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,340,10,20);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,20));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnbadges() {
  //write code here to spawn the badges
  if (frameCount % 60 === 0) {
    var badge = createSprite(1500,120,40,10);
    badge.y = Math.round(random(80,120));
    //badge.addImage(badgeImage);
    badge.scale = 0.5;
    badge.velocityX = -3;
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: badge.addImage(badgeImage1);
              break;
      case 2: badge.addImage(badgeImage2);
              break;
      case 3: badge.addImage(badgeImage3);
              break;
      case 4: badge.addImage(badgeImage4);
              break;
      case 5: badge.addImage(badgeImage5);
              break;
      default: break;
    }
     //assign lifetime to the variable
    badge.lifetime = 500;
    
    //adjust the depth
    badge.depth = boy.depth;
    boy.depth = boy.depth + 1;
    
    //add each badge to the group
    badgesGroup.add(badge);
  }
}
function reset(){
gameState=PLAY;
obstaclesGroup.destroyEach();  
badgesGroup.destroyEach();  
boy.changeAnimation("running", boy_running);
score=0;

}
