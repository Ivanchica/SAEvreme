$(document).ready(function() {

	var podaci,
		grad,
		url,
		temperatura,
		tMin,
		tMax,
		slika,
		pritisak,
		latitude,
		longitude;
	var inputPolje = $('#inp'); //polje za unos grada

	inputPolje.focus(); //dobija fokus kad se stranica ucita

	navigator.geolocation.getCurrentPosition (
		//ako je uspesno odredjena geolokacija, zove funkciju 'uspesno'
		//u protivnom zove funkciju 'neuspesno'
		uspesno, neuspesno
	);

	function uspesno(pozicija) {
		latitude = pozicija.coords.latitude;
		longitude = pozicija.coords.longitude;
		//link ka sajtu sa trenutnim vremenskim podacima
		url = "http://api.openweathermap.org/data/2.5/weather?lat=" 
			+ latitude + "&lon=" + longitude;
		//zove funkciju koja prikazuje podatke o vremenu za mesto gde se korisnik nalazi
		prikaziPodatke(url);
		//isto to radi sa prognozom za naredna 3 dana
		urlPrognoza = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="
			+ latitude  + "&lon=" + longitude + "&cnt=3&mode=json";	
		prognoza(urlPrognoza);
	};

	function neuspesno(greska) {
		inputPolje.css('font-size', '1em');
		inputPolje.val(greska.message);
		$('#dugme').focus();
	};

	//kad korsnik klikne 'ok' (za mobilne...), dobija rezultat
	$('#dugme').on('click', function() {
		grad = inputPolje.val();
		url = "http://api.openweathermap.org/data/2.5/weather?q=" + grad;
		inputPolje.val("")
				.css('font', '1.5em ms-sans-serif');
		//trazi prognozu za naredna tri dana
		urlPrognoza = "http://api.openweathermap.org/data/2.5/forecast/daily?q="
			+ grad + "&cnt=3&mode=json";
		prognoza(urlPrognoza);	//radi prognozu
		prikaziPodatke(url);	//trenutni podaci
	});

	//kad korisnik pritisne Enter u tekstualnom polju, dobija rezultat
	inputPolje.on('keypress', function(taster) {
		if (taster.which == 13) {
			grad = inputPolje.val();
			url = "http://api.openweathermap.org/data/2.5/weather?q=" + grad;
			urlPrognoza = "http://api.openweathermap.org/data/2.5/forecast/daily?q="
			+ grad + "&cnt=3&mode=json";
			prognoza(urlPrognoza);	//radi prognozu
			prikaziPodatke(url);	//trenutni podaci
		};
	});

	//kad korisnik klikne na tekst. polje, resetuje ga
	inputPolje.on('click', function() {
		$(this).val("")
				.css('font', '1.5em ms-sans-serif');
	});

	//funkcija koja prikazuje podatke o vremenu
	function prikaziPodatke(url) {
		$.getJSON(url, function(podaci) {
			//ako je uspeo da nadje podatke za navedeni grad/mesto
			if (podaci.cod != 404) {
				temperatura = parseInt(podaci.main.temp - 273.13);
				$('#temperatura').html(temperatura + "&deg" + "C");

				slika = "http://openweathermap.org/img/w/" + podaci.weather[0].icon+ ".png";
				$('#slika').css('background-image', 'url(' + slika + ')')
							.css('background-size', 'cover');
				pritisak = parseInt(podaci.main.pressure);
				$('#pritisak').text(pritisak + " mbar");

				inputPolje.val(podaci.name);
			}
			else {
				//resetuje vrednosti, ako ne postoji grad/mesto
				$('#temperatura').html('#err');
				$('#slika').css('background-image', 'url("#")');
				$('#pritisak').text("");
				inputPolje.val("");
			};
		});
	};

	//ispisuje prognozu za naredna tri dana
	function prognoza(urlPrognoza) {
		$.getJSON(urlPrognoza, function(podaci) {
			//ako je uspeo da nadje podatke za navedeni grad/mesto
			if (podaci.cod != 404) {
				for (i = 0; i < 3; i++) {
					tMin = parseInt(podaci.list[i].temp.min - 273.13);
					tMax = parseInt(podaci.list[i].temp.max - 273.13);
					$('#dan' + (i+1) + 'tekst').html(tMin + "/" +tMax + "&deg" + "C");
					slika = "http://openweathermap.org/img/w/" + 
						podaci.list[i].weather[0].icon+ ".png";
					$('#dan' + (i+1) + 'slika').css('background-image', 'url(' + slika + ')')
							.css('background-size', 'cover');
				};
			}
			else {
				//resetuje vrednosti, ako ne postoji grad/mesto
				for (i = 0; i < 3; i++) {
					$('#dan' + (i+1) + 'tekst').html(" ");
					$('#dan' + (i+1) + 'slika').css('background-image', 'url(#)');
				};
			};
		});
	};

});