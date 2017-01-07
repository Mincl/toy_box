// drawer are draw frame by fps
var _drawer = undefined;
var _central = undefined;
var _fps = 60;

function main() {
	var canvas = document.getElementById('screen');
	_drawer = new Drawer(canvas);
	_central = new Central();
	setInterval(function(){ _drawer.draw(); }, 1000 / _fps);

	var p = new Player(canvas.width/2.-10, canvas.height-30);
	var e = new NonPlayer(canvas.width/2.-10, 20);

	setInterval(function() { p.shoot_bullet(); }, 100);
	setInterval(function() { p.shoot_bomb(); }, 500);
	// moving object
	canvas.addEventListener('mousemove', function(e) {
		var rect = canvas.getBoundingClientRect();
		var middleX = e.clientX - rect.left;
		var middleY = e.clientY - rect.top;
		var xy = p.getXYByMiddle(middleX, middleY);
		p.setXY(xy.x, xy.y);
	});
	// var x_vector = 2;
	// var y_vector = 1;
	// setInterval(function(){
	// 	if (c.x+c.width > canvas.width || c.x < 0) {
	// 		x_vector *= -1;
	// 	}
	// 	if (c.y+c.height > canvas.height || c.y < 0) {
	// 		y_vector *= -1;
	// 	}
	// 	c.x += x_vector;
	// 	c.y += y_vector;
	// }, 10);
}
