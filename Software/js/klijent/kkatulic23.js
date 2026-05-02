window.addEventListener("DOMContentLoaded", function () {
	if (location.pathname === "/index.html") {
		const slajdovi = ["cilj-element-1", "cilj-element-2", "cilj-element-3"];
		var indeks = 0;
		function promjenaSlajdova() {
			if (indeks == 2) {
				indeks = 0;
			} else {
				indeks++;
			}
			location.hash = slajdovi[indeks];
		}
		var tajmer = setInterval(promjenaSlajdova, 5000);
		var sljedeca = document.getElementsByClassName("strelica-sljedeca");
		var prethodna = document.getElementsByClassName("strelica-prethodna");
		for (let strelica of sljedeca) {
			strelica.style.cursor = "pointer";
			strelica.addEventListener("click", function () {
				clearInterval(tajmer);
				promjenaSlajdova();
				tajmer = setInterval(promjenaSlajdova, 5000);
			});
		}
		for (let strelica of prethodna) {
			strelica.style.cursor = "pointer";
			strelica.addEventListener("click", function () {
				clearInterval(tajmer);
				if (indeks == 0) {
					indeks = 2;
				} else {
					indeks--;
				}
				location.hash = slajdovi[indeks];
				tajmer = setInterval(promjenaSlajdova, 5000);
			});
		}
	}

	if (location.pathname === "/oAutoru.html") {
		var mini = document.getElementsByClassName("mini zidanje")[0];
		var slike = mini.getElementsByTagName("img");
		var izlaz = document.createElement("span");
		izlaz.innerHTML = "x";
		izlaz.style.zIndex = "101";
		izlaz.style.color = "grey";
		izlaz.style.position = "fixed";
		izlaz.style.top = "-20px";
		izlaz.style.right = "calc(50% - 500px)";
		izlaz.style.fontSize = "50px";
		izlaz.style.cursor = "pointer";
		izlaz.style.display = "none";
		var lightbox = document.createElement("img");
		lightbox.style.zIndex = "100";
		lightbox.style.top = "0";
		lightbox.style.right = "calc(50% - 512px)";
		lightbox.style.justifyItems = "center";
		lightbox.style.alignItems = "center";
		lightbox.style.position = "fixed";
		lightbox.style.width = "1024px";
		lightbox.style.display = "none";
		document.body.appendChild(lightbox);
		document.body.appendChild(izlaz);
		for (let slika of slike) {
			slika.addEventListener("click", function () {
				lightbox.style.display = "flex";
				izlaz.style.display = "flex";
				lightbox.src = slika.src;
			});
		}

		izlaz.addEventListener("click", function () {
			izlaz.style.display = "none";
			lightbox.style.display = "none";
		});
	}

	const elementi = document.getElementsByClassName("interaktivnost_detalji");
	for (let i = 0; i < elementi.length; i++) {
		const tekst = elementi[i].textContent.trim();
		const rijeci = tekst.split(/\s+/);
		const pregled = rijeci.slice(0, 6).join(" ");
		elementi[i].textContent = pregled;
		const ostalo = document.createElement("span");
		ostalo.textContent = "...";
		ostalo.style.cursor = "pointer";
		ostalo.addEventListener("click", () => {
			elementi[i].textContent = tekst;
		});
		elementi[i].appendChild(ostalo);
	}

	var trenutna = location.pathname;
	var navigacija = document.getElementsByTagName("nav")[0];
	var linkovi = navigacija.getElementsByTagName("a");
	for (let link of linkovi) {
		let href = link.getAttribute("href");
		if (href == trenutna) {
			link.style.border = "2px solid red";
			link.style.color = "red";
			link.style.padding = "5px";
		}
	}
});
