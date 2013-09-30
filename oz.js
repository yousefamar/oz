var OZ = {};

(function (canvas) {

	var TICK_INTERVAL_MS = 1000.0/60.0;

	var renderer, camera, scene;

	function init() {
		OZ.gui.init();

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize((this.canvasWidth = window.innerWidth), (this.canvasHeight = window.innerHeight));
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		//renderer.sortObjects = false;
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

		window.addEventListener('resize', function(){
			camera.aspect = window.innerWidth/window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize((this.canvasWidth = window.innerWidth), (this.canvasHeight = window.innerHeight));
		}, false);

		document.body.appendChild(renderer.domElement);

		scene = new OZ.GraphScene();

		scene.loadGraph(function () {
			setTimeout(tick, TICK_INTERVAL_MS);
			requestAnimationFrame(render);
		});
	}

	var tickClock = new THREE.Clock();

	function tick() {
		// FIXME: Chrome throttles the interval down to 1s on inactive tabs.
		setTimeout(tick, TICK_INTERVAL_MS);

		OZ.gui.statsTick.begin();
		var delta = tickClock.getDelta();
		scene.tick(delta);
		OZ.gui.statsTick.end();
	}

	var animClock = new THREE.Clock();

	function render() {
		requestAnimationFrame(render);

		OZ.gui.statsRender.begin();
		var delta = animClock.getDelta();
		scene.animate(delta);
		renderer.render(scene, camera);
		OZ.gui.statsRender.end();
	}

	this.main = function () {
		init();	
	};

}).call(OZ);