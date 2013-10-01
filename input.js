OZ.input = {
	init: function () {
		document.addEventListener('mousedown', this.mousedown, false);
		document.addEventListener('touchstart', function (event) { event.preventDefault(); this.mousedown(event.targetTouches[0]); }, false);
		document.addEventListener('mousemove', this.mousemove, false);
		document.addEventListener('touchmove', function (event) { this.mousemove(event.targetTouches[0]); }, false);
		document.addEventListener('mouseup', this.mouseup, false);
		document.addEventListener('touchend', function (event) { this.mouseup(event.targetTouches[0]); }, false);
		document.addEventListener('mousewheel', this.mousewheel,false);
	},

	isMouseDown: false,

	mousedown: function (event) {
		// TODO: Check if this works properly in FireFox too
		OZ.input.mouseX = event.offsetX||event.layerX||0;
		OZ.input.mouseY = event.offsetY||event.layerY||0;

		OZ.input.isMouseDown = true;

		OZ.scene.hoveredNode && (OZ.scene.focusedNode = OZ.scene.hoveredNode.node);
	},

	mousemove: (function () {
		var rotDegFactor = 0.5 * Math.PI/180;
		
		var projector = new THREE.Projector();

		return function (event) {
			var mouseX = event.offsetX||event.layerX||0;
			var mouseY = event.offsetY||event.layerY||0;

			if (event.which) {
				/* Rotate camera around focused node */

				// TODO: Retain angular velocity.
				OZ.camRig.yawObj.rotation.y -= rotDegFactor * (mouseX - OZ.input.mouseX);
				OZ.camRig.pitchObj.rotation.x -= rotDegFactor * (mouseY - OZ.input.mouseY);
				// TODO: Think this through again, some weird stuff happens if you let it rotate all the way.
				// TODO: Blatant optimisation.
				OZ.camRig.pitchObj.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, OZ.camRig.pitchObj.rotation.x));

				OZ.scene.setHoveredNode(null);
			} else {
				/* Pick hovered node */
				var ray = projector.pickingRay(new THREE.Vector3((2 * mouseX/OZ.canvasWidth) - 1, -((2 * mouseY/OZ.canvasHeight) - 1), 0.5), OZ.camera);
				var objects = ray.intersectObjects(OZ.scene.children);
				
				var nothingPicked = true;
				for (var i = 0, len = objects.length; i < len; i++) {
					if (objects[i].object instanceof THREE.Mesh) {
						OZ.scene.setHoveredNode(objects[i].object);
						nothingPicked = false;
						break;
					}
				}

				if (nothingPicked)
					OZ.scene.setHoveredNode(null);
			}
			OZ.input.mouseX = mouseX;
			OZ.input.mouseY = mouseY;
		};
	})(),

	mouseup: function () {
		OZ.input.isMouseDown = false;
	},

	mousewheel: function (event) {
		event.preventDefault();

		OZ.camera.position.z -= event.wheelDeltaY/12;

		OZ.camera.position.z = OZ.camera.position.z < 10 ? 10 : OZ.camera.position.z > 200 ? 200 : OZ.camera.position.z;
	}
};