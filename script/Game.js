"use strict";

var requestAnimationFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function Game_Singleton() {
    this.size = undefined;
    this.spritesStillLoading = 0;
    this.gameWorld = undefined;
    this.sound = true;

    this.mainMenu = new Menu();
        // Add power bar properties
        this.powerBarX = 50; // X-coordinate of the bar's top-left corner
        this.powerBarY = 400; // Y-coordinate of the bar's top-left corner
        this.powerBarWidth = 20; // Width of the bar
        this.powerBarHeight = 200; // Height of the bar
        this.currentPowerLevel = 0; // Current power level (initially 0)
        this.chargingShot = false; // Flag to indicate if the player is charging the shot
    
}

Game_Singleton.prototype.start = function (divName, canvasName, x, y) {
    this.size = new Vector2(x,y);
    Canvas2D.initialize(divName, canvasName);
    this.loadAssets();
    this.assetLoadingLoop();
};

Game_Singleton.prototype.initialize = function () {
    this.gameWorld = new GameWorld();
    this.policy = new GamePolicy();
    
    this.initMenus();

    AI.init(this.gameWorld, this.policy);
};

Game_Singleton.prototype.initMenus = function(inGame){

    let labels = generateMainMenuLabels("Classic 8-Ball");

    let buttons = generateMainMenuButtons(inGame);

    this.mainMenu.init
    (
        sprites.mainMenuBackground,
        labels,
        buttons,
        sounds.jazzTune
    );
}

Game_Singleton.prototype.loadSprite = function (imageName) {
    console.log("Loading sprite: " + imageName);
    var image = new Image();
    image.src = imageName;
    this.spritesStillLoading += 1;
    image.onload = function () {
        Game.spritesStillLoading -= 1;
    };
    return image;
};

Game_Singleton.prototype.assetLoadingLoop = function () {
    if (!this.spritesStillLoading > 0)
        requestAnimationFrame(Game.assetLoadingLoop);
    else {
        Game.initialize();
        requestAnimationFrame(this.mainMenu.load.bind(this.mainMenu));
    }
};

Game_Singleton.prototype.handleInput = function(){

    if(Keyboard.down(Keys.escape)){
        GAME_STOPPED = true;
        Game.initMenus(true);
        requestAnimationFrame(Game.mainMenu.load.bind(this.mainMenu));
    }
}

Game_Singleton.prototype.updatePowerBar = function () {
    // Check if the player is charging the shot (e.g., touch is active)
    if (Touch.isTouchDown &&
        Touch.touchPosition.x > this.powerBarX &&
        Touch.touchPosition.x < this.powerBarX + this.powerBarWidth &&
        Touch.touchPosition.y > this.powerBarY &&
        Touch.touchPosition.y < this.powerBarY + this.powerBarHeight) {
        // Calculate the power level based on touch position within the bar
        var touchY = Touch.touchPosition.y;
        var maxBarY = this.powerBarY + this.powerBarHeight;
        this.currentPowerLevel = Math.min(1, (maxBarY - touchY) / this.powerBarHeight);

        // Set the flag to indicate the player is charging the shot
        this.chargingShot = true;
    } else {
        // Player released the touch or moved outside the power bar area
        // Reset the power level and the charging flag
        this.currentPowerLevel = 0;
        this.chargingShot = false;
    }
};


Game_Singleton.prototype.startNewGame = function(){
    Canvas2D._canvas.style.cursor = "auto";

    Game.gameWorld = new GameWorld();
    Game.policy = new GamePolicy();

    Canvas2D.clear();
    Canvas2D.drawImage(
        sprites.controls, 
        new Vector2(Game.size.x/2,Game.size.y/2), 
        0, 
        1, 
        new Vector2(sprites.controls.width/2,sprites.controls.height/2)
    );

    setTimeout(()=>{
        AI.init(Game.gameWorld, Game.policy);

        if(AI_ON && AI_PLAYER_NUM == 0){
            AI.startSession();
        }
        Game.mainLoop();
    },5000);
}

Game_Singleton.prototype.continueGame = function(){
    Canvas2D._canvas.style.cursor = "auto";

    requestAnimationFrame(Game.mainLoop);
}

Game_Singleton.prototype.mainLoop = function () {
    

    if(DISPLAY && !GAME_STOPPED){
        Game.gameWorld.handleInput(DELTA);
        Game.gameWorld.update(DELTA);
        Canvas2D.clear();
        Game.gameWorld.draw();
        Mouse.reset();
        Game.handleInput();
        requestAnimationFrame(Game.mainLoop);
    }
};

var Game = new Game_Singleton();

