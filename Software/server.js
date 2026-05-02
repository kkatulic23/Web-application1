function dajPort(korime) {
	var os = require("os");
	const HOST = os.hostname();
	let port = null;
	if (HOST != "spider") {
		port = 12222;
	} else {
		const portovi = require("/var/www/OWT/2025/portovi.js");
		port = portovi[korime];
	}
	return port;
}

const port = dajPort("kkatulic23");

const express = require("express");
const path = require("path");
const ds = require("fs");
const modul = require(__dirname + "/js/server/modul.cjs");

const server = express();

server.use("/JSklijent", express.static(__dirname + "/js/klijent"));
server.use("/dizajn", express.static(__dirname + "/css"));
server.use("/resursi", express.static(__dirname + "/resursi"));

server.get("/", (zahtjev, odgovor) => {
	odgovor.redirect("/index.html");
});
server.get("/index.html", (zahtjev, odgovor) => {
	odgovor.sendFile(__dirname + "/html/index.html");
});
server.get("/dokumentacija.html", (zahtjev, odgovor) => {
	odgovor.sendFile(__dirname + "/html/dokumentacija.html");
});
server.get("/oAutoru.html", (zahtjev, odgovor) => {
	odgovor.sendFile(__dirname + "/html/oAutoru.html");
});
server.get("/detalji.html", (zahtjev, odgovor) => {
	odgovor.sendFile(__dirname + "/html/detalji.html");
});
server.get("/recenzija.html", (zahtjev, odgovor) => {
	odgovor.sendFile(__dirname + "/html/opcionalne/recenzija.html");
});
server.get("/studijeSlucaja.html", (zahtjev, odgovor) => {
	odgovor.sendFile(__dirname + "/html/opcionalne/studijeSlucaja.html");
});
server.get("/obrazacValidacija", (zahtjev, odgovor) => {
	odgovor.sendFile(__dirname + "/html/opcionalne/studijeSlucaja.html");
});

server.use(express.urlencoded({ extended: true }));

var zaglavljeHTML = ds.readFileSync(
	__dirname + "/js/server/predlosci/zaglavlje.html"
);
var podnozjeHTML = ds.readFileSync(
	__dirname + "/js/server/predlosci/podnozje.html"
);
server.get("/alati", (zahtjev, odgovor) => {
	odgovor.write(zaglavljeHTML);
	odgovor.write('<form action="/alati" method="get">');
	odgovor.write(
		'<input type="text" id="kategorija" name="kategorija" placeholder="Upišite naziv kategorije" value="" />'
	);
	odgovor.write('<button type="submit">Filtriraj</button>');
	odgovor.write("</form>");
	odgovor.write("<ol>");
	var podaci;
	if (zahtjev.query.kategorija) {
		podaci = modul.dohvatiSve(zahtjev.query.kategorija);
	} else {
		podaci = modul.dohvatiSve();
	}
	for (let red of podaci) {
		odgovor.write(
			"<li>" +
				red.naziv +
				"(" +
				red.godina +
				")" +
				" - " +
				red.kategorija +
				" <a href='/alati/detalji?naziv=" +
				red.naziv +
				"' target=_blank>Detalji</a>" +
				'<form action="/alati/ukloni" method="post" style="display:inline">' +
				'<input type="hidden" id="naziv" name="naziv" value="' +
				red.naziv +
				'"/>' +
				'<button type="submit">Ukloni</button>' +
				"</form>" +
				"</li>"
		);
	}
	odgovor.write("</ol>");
	odgovor.write(podnozjeHTML);
	odgovor.end();
});
server.get("/alati/detalji", (zahtjev, odgovor) => {
	odgovor.write(zaglavljeHTML);
	var podaci = modul.dohvatiPoNazivu(zahtjev.query.naziv);
	if (podaci) {
		odgovor.write("Naziv: " + podaci.naziv + "<br>");
		odgovor.write("Opis: " + podaci.opis + "<br>");
		odgovor.write("Kategorija: " + podaci.kategorija + "<br>");
		odgovor.write(
			"URL: <a href=" + podaci.url + " target=_blank>" + podaci.url + "</a><br>"
		);
		odgovor.write("Godina pokretanja: " + podaci.godina + "<br>");
	} else {
		odgovor.write("Traženi AI alat nije pronađen!");
	}
	odgovor.write(podnozjeHTML);
	odgovor.end();
});
server.post("/alati/ukloni", (zahtjev, odgovor) => {
	if (modul.ukloniPoNazivu(zahtjev.body.naziv)) {
		odgovor.redirect("/alati");
	}
});
server.use(express.json());
server.get("/api/alati", (zahtjev, odgovor) => {
	odgovor.type("json");
	odgovor.status(200);
	odgovor.json(modul.dohvatiSve());
});
server.post("/api/alati", (zahtjev, odgovor) => {
	odgovor.type("json");
	var alat = zahtjev.body;
	if (modul.dodajNovi(alat)) {
		odgovor.status(201);
		odgovor.send(alat);
	} else {
		odgovor.status(400);
		odgovor.json({ greska: "Neispravni ili nepotpuni podaci za alat." });
	}
});
server.put("/api/alati", (zahtjev, odgovor) => {
	odgovor.type("json");
	odgovor.status(405);
	odgovor.json({ greska: "Metoda nije dopuštena za popis alata." });
});
server.delete("/api/alati", (zahtjev, odgovor) => {
	odgovor.type("json");
	odgovor.status(405);
	odgovor.json({ greska: "Metoda nije dopuštena za popis alata." });
});
server.get("/api/alati/:naziv", (zahtjev, odgovor) => {
	odgovor.type("json");
	var alat = modul.dohvatiPoNazivu(zahtjev.params.naziv);
	if (alat) {
		odgovor.status(200);
		odgovor.send(alat);
	} else {
		odgovor.status(404);
		odgovor.json({ greska: "AI alat s traženim nazivom nije pronađen." });
	}
});
server.post("/api/alati/:naziv", (zahtjev, odgovor) => {
	odgovor.type("json");
	odgovor.status(405);
	odgovor.json({ greska: "Metoda nije dopuštena za specifičan alat." });
});
server.put("/api/alati/:naziv", (zahtjev, odgovor) => {
	odgovor.type("json");
	var alat = zahtjev.body;
	if (!modul.dohvatiPoNazivu(zahtjev.params.naziv)) {
		odgovor.status(404);
		odgovor.json({
			greska: "AI alat s traženim nazivom nije pronađen za ažuriranje.",
		});
	} else if (modul.azurirajPostojeci(zahtjev.params.naziv, alat)) {
		odgovor.status(200);
		odgovor.send(alat);
	} else {
		odgovor.status(400);
		odgovor.json({ greska: "Neispravni podaci za ažuriranje." });
	}
});
server.delete("/api/alati/:naziv", (zahtjev, odgovor) => {
	odgovor.type("json");
	if (modul.ukloniPoNazivu(zahtjev.params.naziv)) {
		odgovor.status(204).send();
	} else {
		odgovor.status(404);
		odgovor.json({
			greska: "AI alat s traženim nazivom nije pronađen za brisanje.",
		});
	}
});
server.listen(port, () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
server.use((zahtjev, odgovor) => {
	odgovor.status(404);
	odgovor.write('<meta charset="UTF-8">');
	odgovor.write("<h1>Stranica ne postoji!</h1>");
	odgovor.write('<a href="/">Vrati me na početnu stranicu</a>');
	odgovor.end();
});
