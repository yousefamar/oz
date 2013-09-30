OZ.input = {
	init: function () {
		document.addEventListener('mousedown', this.mousedown, false);
		document.addEventListener('touchstart', function (event) { event.preventDefault(); this.mousedown(event.targetTouches[0]); }, false);
		document.addEventListener('mousemove', this.mousemove, false);
		document.addEventListener('touchmove', function (event) { this.mousemove(event.targetTouches[0]); }, false);
		document.addEventListener('mouseup', this.mouseup, false);
		document.addEventListener('touchend', function (event) { this.mouseup(event.targetTouches[0]); }, false);
	},

	mousedown: function (event) {
		// TODO: Check if this works properly in FireFox too
		this.mouseX = event.offsetX||event.layerX||0;
		this.mouseY = event.offsetY||event.layerY||0;
	},

	mousemove: (function () {
		var rotDegFactor = 0.5 * Math.PI/180;

		return function (event) {
			if (!event.which) return;
			var mouseX = event.offsetX||event.layerX||0;
			var mouseY = event.offsetY||event.layerY||0;

			OZ.camRig.yawObj.rotation.y -= rotDegFactor * (mouseX - this.mouseX);
			OZ.camRig.pitchObj.rotation.x += rotDegFactor * (mouseY - this.mouseY);
			// TODO: Think this through again, some weird stuff happens if you let it rotate all the way.
			// TODO: Blatant optimisation.
			OZ.camRig.pitchObj.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, OZ.camRig.pitchObj.rotation.x));

			this.mouseX = mouseX;
			this.mouseY = mouseY;
		};
	})(),

	mouseup: function (event) {
		dragee = null;
	}
};