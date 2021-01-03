export let canvas = document.getElementById('canvasMain');
export let canvasShip = document.getElementById('canvasShip');
export let canvasBackground = document.getElementById('canvasBackground');

Number.prototype.toRads = function() {
    return this * Math.PI / 180;
}