OZ.graph = {};

OZ.graph.Node = function (obj) {
	this.label = obj.label || '';
	this.desc = obj.desc || '';
	this.parent = null;
	this.children = [];
	this.radius = 10;

	for (var i = 0, len = obj.children.length; i < len; i++)
		this.addChild(new OZ.graph.Node(obj.children[i]));
	
	this.x = OZ.canvasWidth/2 + Math.random()*500 - 250;
	this.y = OZ.canvasHeight/2 + Math.random()*500 - 250;
	this.netForce = { x: 0, y: 0 };
};

OZ.graph.Node.prototype.addChild = function (child) {
	child.parent = this;
	this.children.push(child);
	return this;
};

OZ.graph.Node.prototype.forEachPre = function (func) {
	if (func(this))
		return true;
	for (var i = 0, len = this.children.length; i < len; i++)
		if (this.children[i].forEachPre(func))
			return true;
};

OZ.graph.Node.prototype.forEachPost = function (func) {
	for (var i = 0, len = this.children.length; i < len; i++)
		if (this.children[i].forEachPost(func))
			return true;
	if (func(this))
		return true;
};

OZ.graph.Node.prototype.distTo = function (node) {
	return Math.sqrt((node.x - this.x)*(node.x - this.x) + (node.y - this.y)*(node.y - this.y));
};

OZ.graph.Node.prototype.addForce = function (otherNode) {
	var dist = this.distTo(otherNode) || 0.0001;
	var distX = (this.x - otherNode.x) || 0.0001, distY = (this.y - otherNode.y) || 0.0001;
	var dirX = distX/dist, dirY = distY/dist;

	this.netForce.x += 100*this.radius*otherNode.radius*dirX/(dist*dist);
	this.netForce.y += 100*this.radius*otherNode.radius*dirY/(dist*dist);

	if (this.children.indexOf(otherNode) >= 0) {
		var force = 0.1 * (dist - 100);

		otherNode.netForce.x += dirX*force;
		otherNode.netForce.y += dirY*force;

		this.netForce.x -= dirX*force;
		this.netForce.y -= dirY*force;
	}
};

OZ.graph.Node.prototype.contains = function (x, y) {
	return Math.sqrt((x - this.x)*(x - this.x) + (y - this.y)*(y - this.y)) <= this.radius;
};

OZ.GraphScene = function () {
	THREE.Scene.call(this);
};

OZ.GraphScene.prototype = Object.create(THREE.Scene.prototype);

OZ.GraphScene.prototype.loadGraph = function (callback) {
	callback();
};

OZ.GraphScene.prototype.tick = function (delta) {
	
};

OZ.GraphScene.prototype.animate = function (delta) {
	
};