var OZ = {};

(function (canvas) {

	var TICK_INTERVAL_MS = 1000.0/60.0;

	var self = this;

	var renderer, camera, camRig, scene;

	function init() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize((self.canvasWidth = window.innerWidth), (self.canvasHeight = window.innerHeight));
		//renderer.sortObjects = false;
		camera = self.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

		window.addEventListener('resize', function(){
			camera.aspect = window.innerWidth/window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize((self.canvasWidth = window.innerWidth), (self.canvasHeight = window.innerHeight));
		}, false);

		document.body.appendChild(renderer.domElement);

		scene = self.scene = new self.GraphScene();

		scene.add(new THREE.AmbientLight(0x111111));
		scene.add(new THREE.DirectionalLight(0xFFFFFF));
		var underLight = new THREE.DirectionalLight(0xFFFFFF, 0.125);
		underLight.position.set(-1, -1, -1);
		scene.add(underLight);
		var underLight = new THREE.DirectionalLight(0xFFFFFF, 0.125);
		underLight.position.set(-1, -1, 1);
		scene.add(underLight);
		var underLight = new THREE.DirectionalLight(0xFFFFFF, 0.125);
		underLight.position.set(1, -1, -1);
		scene.add(underLight);
		var underLight = new THREE.DirectionalLight(0xFFFFFF, 0.125);
		underLight.position.set(1, -1, 1);
		scene.add(underLight);


		camRig = self.camRig = {
			yawObj: new THREE.Object3D(),
			pitchObj: new THREE.Object3D()
		};
		camRig.yawObj.add(camRig.pitchObj);
		camera.position.z = 150;
		camera.lookAt(new THREE.Vector3());
		camRig.pitchObj.add(camera);
		scene.add(camRig.yawObj);


		scene.loadGraph(function () {
			self.gui.init();
			self.input.init();

			setTimeout(tick, TICK_INTERVAL_MS);
			requestAnimationFrame(render);
		});
	}

	var tickClock = new THREE.Clock();

	function tick() {
		// FIXME: Chrome throttles the interval down to 1s on inactive tabs.
		setTimeout(tick, TICK_INTERVAL_MS);

		self.gui.statsTick.begin();
		var delta = tickClock.getDelta();
		scene.tick(delta);
		self.gui.statsTick.end();
	}

	var animClock = new THREE.Clock();

	function render() {
		requestAnimationFrame(render);

		self.gui.statsRender.begin();
		var delta = animClock.getDelta();
		scene.animate(delta);

		// TODO: Make the camera push nodes away so they don't fly in your face.
		//if (!self.input.isMouseDown)
		//	camRig.yawObj.rotation.y += 500 * (Math.PI/180) * (delta/1000);


		renderer.render(scene, camera);
		self.gui.statsRender.end();
	}

	this.main = function () {
		init();	
	};

}).call(OZ);