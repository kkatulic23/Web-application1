var ds = require("fs");
exports.dohvatiSve = function (Kategorija) {
	var tekst = ds.readFileSync("resursi/alati.csv", "utf-8");
	var redovi = tekst
		.split("\n")
		.map((r) => r.trim())
		.filter((r) => r !== "");
	var podaci = [];
	for (let red of redovi) {
		red = red.trim();
		let stupac = red.split(";");
		if (Kategorija) {
			if (stupac[2].toLowerCase() === Kategorija.toLowerCase()) {
				podaci.push({
					naziv: stupac[0],
					opis: stupac[1],
					kategorija: stupac[2],
					url: stupac[3],
					godina: stupac[4],
				});
			}
		} else {
			podaci.push({
				naziv: stupac[0],
				opis: stupac[1],
				kategorija: stupac[2],
				url: stupac[3],
				godina: stupac[4],
			});
		}
	}
	return podaci;
};
exports.dohvatiPoNazivu = function (Naziv) {
	var tekst = this.dohvatiSve();
	for (var red of tekst) {
		if (red.naziv.toLowerCase() === Naziv.toLowerCase()) {
			return red;
		}
	}
	return null;
};
exports.ukloniPoNazivu = function (Naziv) {
	var tekst = this.dohvatiSve();
	var podaci = [];
	var uspjeh = false;
	for (let red of tekst) {
		if (red.naziv.toLowerCase() === Naziv.toLowerCase()) {
			uspjeh = true;
		} else {
			podaci.push(red);
		}
	}
	if (uspjeh) {
		tekst = "";
		for (let red of podaci) {
			tekst +=
				red.naziv +
				";" +
				red.opis +
				";" +
				red.kategorija +
				";" +
				red.url +
				";" +
				red.godina +
				"\n";
		}
		ds.writeFileSync("resursi/alati.csv", tekst, {
			flag: "w",
			encoding: "utf8",
		});
	}
	return uspjeh;
};
exports.dodajNovi = function (Novi) {
	if (
		!Novi.naziv ||
		!Novi.opis ||
		!Novi.kategorija ||
		!Novi.url ||
		!Novi.godina
	) {
		return false;
	}
	var noviAI =
		Novi.naziv +
		";" +
		Novi.opis +
		";" +
		Novi.kategorija +
		";" +
		Novi.url +
		";" +
		Novi.godina +
		"\n";
	ds.writeFileSync("resursi/alati.csv", noviAI, {
		flag: "a",
		encoding: "utf8",
	});
	return true;
};
exports.azurirajPostojeci = function (Naziv, Zamjena) {
	if (
		!Zamjena.naziv ||
		!Zamjena.opis ||
		!Zamjena.kategorija ||
		!Zamjena.url ||
		!Zamjena.godina
	) {
		return false;
	}
	var tekst = this.dohvatiSve();
	var upis = "";
	for (let red of tekst) {
		if (red.naziv.toLowerCase() === Naziv.toLowerCase()) {
			red.naziv = Zamjena.naziv;
			red.opis = Zamjena.opis;
			red.kategorija = Zamjena.kategorija;
			red.url = Zamjena.url;
			red.godina = Zamjena.godina;
		}
		upis +=
			red.naziv +
			";" +
			red.opis +
			";" +
			red.kategorija +
			";" +
			red.url +
			";" +
			red.godina +
			"\n";
	}
	ds.writeFileSync("resursi/alati.csv", upis, {
		flag: "w",
		encoding: "utf8",
	});
	return true;
};
