(function () {
	window.addEventListener("load", init);

	/**
	 * Adds click listeners to each project box
	 */
	function init() {
		let projectBoxes = document.querySelectorAll(".project-box");
		for (let projectBox of projectBoxes) projectBox.addEventListener("click", openProject);
	}

	/**
	 * When a user clicks on the project box div, it will redirect them to the correct project page.
	 * If they click on the github logo, it will only open the github for that project on a separate page.
	 */
	function openProject() {
		let href = "";

		let githubButton = this.querySelector(".github");

		if (githubButton && githubButton.matches(":hover")) {
			// do not open project since github button was clicked
		} else {
			switch (this.id) {
				case "gone-phishing": {
					return window.open("https://github.com/muzzy3k/Gone-Phishing");
				}
			}

			window.location = href;
		}
	}
})();
