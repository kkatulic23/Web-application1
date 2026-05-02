window.addEventListener("load", function () {
	var ime = document.getElementById("ime");
	var prezime = document.getElementById("prezime");
	var mail = document.getElementById("mail");
	var naziv = document.getElementById("naziv");
	var izbor = document.getElementById("izbor");
	var alat = document.getElementById("alat");
	var opcionalan = document.getElementById("opcionalanAI");
	var ocjena = document.getElementById("ocjena");
	var opis = document.getElementById("opis");

	function greska(element, porukaElement, poruka) {
		element.style.backgroundColor = "orange";
		porukaElement.innerHTML = poruka;
		porukaElement.style.display = "block";
		return false;
	}
	function greskaNema(element, porukaElement) {
		element.style.backgroundColor = "";
		porukaElement.innerHTML = "";
		porukaElement.style.display = "none";
		return true;
	}

	function validirajIme() {
		let tekst = ime.value;
		let poruka = document.getElementById("porukaIme");
		if (
			tekst != undefined &&
			/^[A-Za-zČĆĐŠŽčćđšž\s]+$/.test(tekst) &&
			tekst[0].toUpperCase() === tekst[0]
		) {
			return greskaNema(ime, poruka);
		} else {
			return greska(ime, poruka, "Pogrešno uneseno ime!");
		}
	}
	function validirajPrezime() {
		let tekst = prezime.value;
		let poruka = document.getElementById("porukaPrezime");
		if (
			tekst != undefined &&
			/^[A-Za-zČĆĐŠŽčćđšž\s]+$/.test(tekst) &&
			tekst[0].toUpperCase() === tekst[0]
		) {
			return greskaNema(prezime, poruka);
		} else {
			return greska(prezime, poruka, "Pogrešno uneseno prezime!");
		}
	}
	function validirajMail() {
		let tekst = mail.value;
		let poruka = document.getElementById("porukaMail");
		if (tekst != undefined && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tekst)) {
			return greskaNema(mail, poruka);
		} else {
			return greska(mail, poruka, "Pogrešno unesen e-mail!");
		}
	}
	function validirajNaziv() {
		let tekst = naziv.value;
		let poruka = document.getElementById("porukaNaziv");
		if (
			tekst != undefined &&
			/^[A-Za-zČĆĐŠŽčćđšž\s]+$/.test(tekst) &&
			tekst[0].toUpperCase() === tekst[0]
		) {
			return greskaNema(naziv, poruka);
		} else {
			return greska(naziv, poruka, "Pogrešno unesen naziv organizacije/tima!");
		}
	}
	function pokaziOpcionalan() {
		let tekst = izbor.value;
		if (tekst !== "Ostalo") {
			alat.value = "";
			opcionalan.style.display = "none";
			return greskaNema(alat, document.getElementById("porukaIzbor"));
		} else {
			opcionalan.style.display = "block";
		}
	}
	function validirajAlat() {
		let tekst = alat.value;
		let poruka = document.getElementById("porukaIzbor");
		if (opcionalan.style.display !== "block") {
			return greskaNema(alat, poruka);
		}
		if (
			tekst != undefined &&
			/^[A-Za-zČĆĐŠŽčćđšž\s]+$/.test(tekst) &&
			tekst[0].toUpperCase() === tekst[0]
		) {
			return greskaNema(alat, poruka);
		} else {
			return greska(alat, poruka, "Pogrešno unesen naziv AI alata!");
		}
	}
	function validirajOcjenu() {
		let ocjenaVr = ocjena.value;
		let poruka = document.getElementById("porukaOcjena");
		if (
			ocjenaVr != undefined &&
			/^\d+(\.\d{1,2})?$/.test(ocjenaVr) &&
			ocjenaVr >= 1 &&
			ocjenaVr <= 10
		) {
			return greskaNema(ocjena, poruka);
		} else {
			return greska(ocjena, poruka, "Pogrešno unesena ocjena!");
		}
	}
	function validirajOpis() {
		let tekst = opis.value;
		let poruka = document.getElementById("porukaOpis");
		let uvjetURL = /https?:\/\/[^\s]+?\.(hr|com|org)\b/;
		let uvjetTekst = /^[A-Za-zČĆŽŠĐčćžšđ0-9\s.,!?()":;/\\@#%&=\-_'\[\]\n\r]*$/;
		if (tekst.length < 200 || tekst.length > 1000) {
			return greska(
				opis,
				poruka,
				"Tekst sadrži manje od 200 ili više od 1000 znakova!"
			);
		} else if (tekst.includes("$") || tekst.includes("€")) {
			return greska(opis, poruka, "Tekst sadrži znakove $ ili €!");
		} else if (!uvjetTekst.test(tekst)) {
			return greska(opis, poruka, "Tekst sadrži nedopuštene znakove!");
		} else if (!uvjetURL.test(tekst)) {
			return greska(
				opis,
				poruka,
				"Tekst mora sadržavati ispravan URL koji završava na .hr, .com ili .org."
			);
		} else {
			return greskaNema(opis, poruka);
		}
	}

	ime.addEventListener("keyup", validirajIme);
	prezime.addEventListener("keyup", validirajPrezime);
	mail.addEventListener("keyup", validirajMail);
	naziv.addEventListener("keyup", validirajNaziv);
	izbor.addEventListener("change", pokaziOpcionalan);
	alat.addEventListener("keyup", validirajAlat);
	ocjena.addEventListener("keyup", validirajOcjenu);
	opis.addEventListener("keyup", validirajOpis);

	var obrazac = document.getElementById("obrazac2");
	obrazac.addEventListener("reset", function () {
		alat.value = "";
		opcionalan.style.display = "none";
		greskaNema(ime, document.getElementById("porukaIme"));
		greskaNema(prezime, document.getElementById("porukaPrezime"));
		greskaNema(mail, document.getElementById("porukaMail"));
		greskaNema(naziv, document.getElementById("porukaNaziv"));
		greskaNema(alat, document.getElementById("porukaIzbor"));
		greskaNema(ocjena, document.getElementById("porukaOcjena"));
		greskaNema(opis, document.getElementById("porukaOpis"));
	});
	obrazac.addEventListener("submit", function (event) {
		const rezultati = [
			validirajIme(),
			validirajPrezime(),
			validirajMail(),
			validirajNaziv(),
			validirajAlat(),
			validirajOcjenu(),
			validirajOpis(),
		].every((v) => v);
		if (rezultati === false) {
			event.preventDefault();
			alert("Nisu upisane dobre vrijednosti u označena polja!");
		}
	});
});
