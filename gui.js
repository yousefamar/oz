OZ.gui = {

	init: function () {
		var overlay = document.getElementById('overlay');
		this.statsTick = new Stats();
		//statsTick.domElement.style.position = 'absolute';
		//statsTick.domElement.style.top = 0;
		//statsRender.domElement.style.zIndex = 100;
		//statsRender.setMode(1);
		
		this.statsRender = new Stats();
		//statsRender.domElement.style.position = 'absolute';
		//statsRender.domElement.style.top = 0;
		//statsRender.domElement.style.zIndex = 100;
		//statsRender.setMode(1);
		
		overlay.insertBefore(this.statsRender.domElement, overlay.firstChild);
		overlay.insertBefore(this.statsTick.domElement, overlay.firstChild);
	}
};