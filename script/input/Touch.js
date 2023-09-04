// touch.js

"use strict";

// Variables to track touch input and power level
var isTouching = false;
var powerLevel = 0;

// Function to handle touch move events
function handleTouchMove(evt) {
    var canvasScale = Canvas2D.scale;
    var canvasOffset = Canvas2D.offset;
    var touch = evt.touches[0];
    var tx = (touch.pageX - canvasOffset.x) / canvasScale.x;
    var ty = (touch.pageY - canvasOffset.y) / canvasScale.y;

    // Calculate power level based on the Y-coordinate of the touch
    powerLevel = (ty / Canvas2D._canvas.height) * maxPower; // Adjust maxPower as needed

    // You can add more logic here based on your game's requirements
}

// Function to handle touch start events
function handleTouchStart(evt) {
    handleTouchMove(evt);
    isTouching = true;
}

// Function to handle touch end events
function handleTouchEnd(evt) {
    handleTouchMove(evt);
    isTouching = false;

    // Use the calculated power level for shooting when touch ends
    if (powerLevel > 0) {
        // Perform shooting action with powerLevel
    }
}

// Rest of your Touch_Singleton code...

// Add event listeners to your canvas element
canvasElement.addEventListener("touchstart", handleTouchStart, false);
canvasElement.addEventListener("touchmove", handleTouchMove, false);
canvasElement.addEventListener("touchend", handleTouchEnd, false);

Object.defineProperty(Touch_Singleton.prototype, "position",
    {
        get: function () {
            return this._position;
        }
    });

var Touch = new Touch_Singleton();
