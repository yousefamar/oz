OZ.graph = {};

OZ.GraphScene = function () {
	THREE.Scene.call(this);
};

OZ.GraphScene.prototype = Object.create(THREE.Scene.prototype);

OZ.GraphScene.prototype.loadGraph = function (callback) {
	var self = this;

	var socket = io.connect('cyan.io:80');
	socket.on('localGraph', function (graph) {
		self.graph = graph;

		var tempIDMap = {};

		for (var i = 0, len = graph.nodes.length; i < len; i++) {
			var node = graph.nodes[i];
			node.linked = {};

			var mesh = node.mesh = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({ color: 0x00FFFF }));
			mesh.position.set(Math.random()*500 - 250, Math.random()*500 - 250, Math.random()*500 - 250);
			mesh.netForce = new THREE.Vector3();
			self.add(mesh);

			tempIDMap[node.id] = node;
		};

		for (var i = 0, len = graph.links.length; i < len; i++) {
			// var mesh = graph.nodes[i].mesh = new THREE.SphereMesh(new THREE.SphereGeometry(0.1), new THREE.MeshPhongMaterial({ color: 0x00FFFF }));
			// mesh.position.set(Math.random()*5000 - 2500, Math.random()*5000 - 2500, Math.random()*5000 - 2500);
			// mesh.netForce = new THREE.Vector3();

			var link = graph.links[i];

			tempIDMap[link.source].linked[link.target] = link.targetNode = tempIDMap[link.target];
			tempIDMap[link.target].linked[link.source] = link.sourceNode = tempIDMap[link.source];

			var geometry = new THREE.Geometry();
			geometry.vertices.push(tempIDMap[link.source].mesh.position);
			geometry.vertices.push(tempIDMap[link.target].mesh.position);

			link.mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xC0C0C0 }));
			self.add(link.mesh);
		};

		self.focusedNode = graph.nodes[0];

		console.log(graph);

		callback();
	});
	socket.emit('move', 0);
};

OZ.GraphScene.prototype.tick = function (delta) {
	// I can't believe this worked the first try...

	for (var i = 0, len0 = this.graph.nodes.length; i < len0; i++) {
		var node0 = this.graph.nodes[i];
		var mesh0 = node0.mesh;

		for (var j = i+1, len1 = this.graph.nodes.length; j < len1; j++) {
			var node1 = this.graph.nodes[j];
			var mesh1 = node1.mesh;

			var dist = mesh0.position.distanceTo(mesh1.position) || 0.0001;
			var distSq = dist*dist;

			var distX = (mesh0.position.x - mesh1.position.x) || 0.0001;
			var distY = (mesh0.position.y - mesh1.position.y) || 0.0001;
			var distZ = (mesh0.position.z - mesh1.position.y) || 0.0001;

			var dirX = distX/dist, dirY = distY/dist, dirZ = distZ/dist;

			mesh0.netForce.x += dirX/distSq;
			mesh0.netForce.y += dirY/distSq;
			mesh0.netForce.z += dirZ/distSq;

			mesh1.netForce.x -= dirX/distSq;
			mesh1.netForce.y -= dirY/distSq;
			mesh1.netForce.z -= dirZ/distSq;

			if (node1.id in node0.linked) {
				var force = 0.01 * (dist - 10);
				
				mesh1.netForce.x += dirX*force;
				mesh1.netForce.y += dirY*force;
				mesh1.netForce.z += dirZ*force;

				mesh0.netForce.x -= dirX*force;
				mesh0.netForce.y -= dirY*force;
				mesh0.netForce.z -= dirZ*force;
			}
		}
	}

	for (var i = 0, len0 = this.graph.nodes.length; i < len0; i++) {
		var mesh = this.graph.nodes[i].mesh;

		mesh.position.add(mesh.netForce);
		mesh.netForce.set(0, 0, 0);
	}

	for (var i = 0, len0 = this.graph.links.length; i < len0; i++) {
		var link = this.graph.links[i];

		link.mesh.geometry.vertices[0].copy(link.sourceNode.mesh.position);
		link.mesh.geometry.vertices[1].copy(link.targetNode.mesh.position);
		link.mesh.geometry.verticesNeedUpdate = true;
	}
};

OZ.GraphScene.prototype.animate = function (delta) {
	
};