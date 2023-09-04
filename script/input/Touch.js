// touch.js

"use strict";

function handleTouchMove(evt) {
    var canvasScale = Canvas2D.scale;
    var canvasOffset = Canvas2D.offset;
    var touch = evt.touches[0];
    var tx = (touch.pageX - canvasOffset.x) / canvasScale.x;
    var ty = (touch.pageY - canvasOffset.y) / canvasScale.y;
    Touch._position = new Vector2(tx, ty);
}

function handleTouchStart(evt) {
    handleTouchMove(evt);

    // You can add more logic here based on your game's requirements
}

function handleTouchEnd(evt) {
    handleTouchMove(evt);

    // You can add more logic here based on your game's requirements
}

function Touch_Singleton() {
    this._position = Vector2.zero;
    document.addEventListener("touchmove", handleTouchMove, false);
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchend", handleTouchEnd, false);
}

Object.defineProperty(Touch_Singleton.prototype, "position",
    {
        get: function () {
            return this._position;
        }
    });

var Touch = new Touch_Singleton();
