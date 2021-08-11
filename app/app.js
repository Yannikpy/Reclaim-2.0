document.getElementById('cookiebutton').addEventListener('click', function(){document.getElementById('cookiehinweis').style.display = 'none'})

var n = 0;

// check if artwork name is given in 
const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
artwork = urlParams.get('id') ;
if (artwork) {
	console.log("hier würde "+ id +" angezeigt")
}


// init map
const map = L.map('map',{
ScrollWheelZoom: true,
attributionControl: false,
zoomControl: false
}).setView([50.9385, 6.935], 13);

// add tileLayer for blue Color
const mypane = map.createPane('color');
L.tileLayer('https://htmlcolors.com/color-image/96cfc1.png',{
	minZoom: 11,
	maxZoom: 20,
	pane: 'color',
}).addTo(map)

// add Stamen tileLayer
osm = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
attribution: 'Map tiles by <a target="_blank" rel="noopener noreferrer" href="http://stamen.com">Stamen Design</a>, <a target="_blank" rel="noopener noreferrer" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
subdomains: 'abcd',
minZoom: 11,
maxZoom: 20,
ext: 'png',
}).addTo(map)

// add Logo and Info Icon
const mapContainer = map.getContainer();
const logoBtn = document.getElementById('logoBtn'); 
mapContainer.appendChild(logoBtn);
const infoBtn = document.getElementById('infoBtn'); 
mapContainer.appendChild(infoBtn);
const langBtn = document.getElementById('langBtn'); 
mapContainer.appendChild(langBtn);
// add event listener
infoBtn.addEventListener('click', infoPopup);
langBtn.addEventListener('click', changeLang);

// draw route and points on map

// init Icons
var pointIcon = L.icon({
	iconUrl: 'symbols/Punkt.svg',
	iconSize:     [20, 20], // size of the icon
	iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
	});
	
var pointIconL = L.icon({
	iconUrl: 'symbols/Punkt.svg',
	iconSize:     [30, 30], // size of the icon
	iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
	});

latlngs_for_Polyline = [];
route = [];
for (const loc of locations) {
	if (loc.QID != "") {
		latlngs_for_Polyline.push(loc.location);
		
	}
}

var polyline = L.polyline(latlngs_for_Polyline, {className: 'my_polyline'}).addTo(map);

// show current position
var personIcon = L.icon({
	iconUrl: 'symbols/Standpunkt.svg',
	iconSize:     [20, 35], // size of the icon
	iconAnchor:   [10, 25], // point of the icon which will correspond to marker's location
	});
var current_position;
// ask for permission to locate and center therer
function onLocationFound(e) {
	if (current_position) {
		map.removeLayer(current_position);
	}
	current_position = L.marker(e.latlng, {icon: personIcon}).addTo(map)		
};

function onLocationError(e){
	console.log("hier wird dir erklärt wie es geht")
}
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate({watch: true});

// Icons for Stations
var stationMarkers = new L.FeatureGroup();
map.addLayer(stationMarkers);

var stationIcon = L.icon({
iconUrl: 'stations/Bf-Ehrenfeld.svg',
iconSize:     [200, 40], // size of the icon
iconAnchor:   [40, 30], // point of the icon which will correspond to marker's location
});
stationMarker = L.marker([50.951646, 6.918369], {icon: stationIcon})
stationMarkers.addLayer(stationMarker);
//L.marker([50.951646, 6.918369]).addTo(map);


var stationIcon = L.icon({
iconUrl: 'stations/Bf-Hansaring_U-S.svg',
iconSize:     [200, 40], // size of the icon
iconAnchor:   [40, 30], // point of the icon which will correspond to marker's location
});
stationMarker = L.marker([50.949079, 6.952367], {icon: stationIcon})
stationMarkers.addLayer(stationMarker);

var stationIcon = L.icon({
iconUrl: 'stations/U-Ebertplatz.svg',
iconSize:     [200, 40], // size of the icon
iconAnchor:   [40, 30], // point of the icon which will correspond to marker's location
});
stationMarker = L.marker([50.950637, 6.959220], {icon: stationIcon})
stationMarkers.addLayer(stationMarker);

var venloerIcon = L.icon({
iconUrl: 'stations/U-Venloer-Str.svg',
iconSize:     [200, 40], // size of the icon
iconAnchor:   [40, 30], // point of the icon which will correspond to marker's location
});
venloer = L.marker([50.950032, 6.916579], {icon: venloerIcon})
stationMarkers.addLayer(venloer);

var hbIcon = L.icon({
iconUrl: 'stations/U-Hans-Boeckler-Platz.svg',
iconSize:     [200, 40], // size of the icon
iconAnchor:   [40, 30], // point of the icon which will correspond to marker's location
});
hb = L.marker([50.943284, 6.933427], {icon: hbIcon});
stationMarkers.addLayer(hb);




// dont show icons depending on zoom-Level

map.on('zoomend', function() {
	if (map.getZoom() < 11 ){
			map.removeLayer(stationMarkers);
	}
	else {
			map.addLayer(stationMarkers);
		}
});



// init info pupup
function infoPopup() {
	lang = document.getElementById('langBtn').innerHTML
	infotext = (lang =="en") ? infotext_de : infotext_en;

}


// function to change language
function changeLang() {
	lang = document.getElementById('langBtn').innerHTML
	lang = (lang == "de") ? "en" : "de";
	document.getElementById('langBtn').innerHTML = lang
	initMarkers(lang)
		
}


// function that takes creates html-string from information about artwork
function createContent(n, artist, title, text, info, insta, website) {

	var content = "<img class='image' src='images/" + 2 + ".jpg'>	<br> <br> <div id='infoBlock'>  <div class='titleParent'><p> " + n + "</p><div id='titleBlock'><p>" + artist + "<br><i> "+ title + " </i> </p></div></div><br><div class='textblock'> <p>" + text + "</p> </div>" + "</div>"
	var buttons = "<input src='symbols/X.svg' class='closeBtn' type='image'></input> <input src='symbols/Audioguide.svg' class='audioBtn' type='image'></input> "
	
	if (insta != "—" || website != "—") {
		var logos = "<div class='buttoncontainerInsta'> "
		if (insta != "—") {
		logos = logos + "<a target='_blank' rel='noopener noreferrer'  href='https://www.instagram.com/"+ insta +"'> <img id='insta' src='symbols/Instagram.svg'></img></a>" 
		}
		if (website != "—") {
		logos = logos + "<a target='_blank' rel='noopener noreferrer'  href='"+ website +"'><img id='wwww' src='symbols/wwww.svg'></img> </a>"
		}
		logos = logos + "</div>"
	}
	//var buttonsNext = " <div class=buttoncontainer> <input src='symbols/Pfeil_links.svg' class='myprevbutton' type='image'></input> <input src= 'symbols/Pfeil_rechts.svg' class='mynextbutton' type='image'></input> </div>";	
	
	if (info) {
	content = content + "<div id='buttonBoxPlatform'>" + buttons + "</div>" 
	content = content + logos
	content = "<div id='myContentPlatform'>" + content  + "</div>"
	content = content + "<div id='platformInfo'><p3>"+ info +"</p3></div>";
	}
	else {
	content = content + "<div id='buttonBox'>" + buttons + "</div>" 
	content = content + logos
	content = "<div class='myContent'>" + content + "</div>"
	}
	return content
	}



// init all markers in correct Language
// prepare Popup on buttom of map
var markerOptions = {icon: pointIcon}

var route = [];
var markers = new L.FeatureGroup();
map.addLayer(markers);

function initMarkers(lang) {
	map.closePopup();
	markers.clearLayers();
	route = [];
	slides = [];
	var i = 0;
	for (loc of locations) {
		if (loc.adress == "") { // these are stations
			marker = eval(loc.id)
			var infotext = "<div class='myContent'> " + buttons + " <p4>" + loc.title + "<br> <br>" + loc.text_en + "</p4>" + buttonsNext + "</div>"
			marker.type = "station"
			route.push(marker);
			var slide = "<div class='swiper-slide'>" + i + "<br> <br>" + loc.id + "</div>"
			var slide = "<div class='swiper-slide'> <div class='my-stuff'></div></div>"
			
			slides.push(slide)
			
		}
		else { // these are points
			
			var marker = L.marker(loc.location, markerOptions).addTo(map)
			marker.id = i;
			marker.type = "art"
			marker.on('click', openmyPopup)
			markers.addLayer(marker)
			route.push(marker);
			
			//var popup_content = createContent(i + 1, "Künster:in", "Titel", "Beschreibungstext, der sehr sehr sehr sehrsehr sehr sehr sehrsehr sehr sehr sehrsehr sehr sehr sehrsehr sehr sehr sehrsehr sehr sehr sehr lang ist", false, "insta", "website")
			var content = " <p> Diese Karte ist für Mobiltelefone optimiert. Also schnapp Dir deine Freunde, dein Handy und dein Fahrrad und folge der Reclaim Route von Ehrenfeld über das Belgische Viertel bis hin zum Ebertplatz! <br> <br> This map is optimized for mobile phones. So, all you have got to do is grab your friends, your phone and your bike and follow the Reclaim Route from Ehrenfeld via the Belgian Quarter to Ebertplatz!</p>"

			var popup_content = "<div class='myContent'>" + content + content + "</div>"

			var slide = "<div class='swiper-slide'> <div class='my-stuff'>"+content + content+"</div></div>"
			slides.push(slide)
		}

		
		i++;
	}
	swiper.addSlide(1, slides)
	//eventlisteners
	var buttons = document.querySelectorAll(".closeBtn")
	for (const button of buttons){
		button.addEventListener('click', closemyPopup)
	}
	var buttons = document.querySelectorAll(".audioBtn")
	for (const button of buttons){
		button.addEventListener('click', playGuide)
	}
}





// audio guide
var audio = new Audio('audio/1.mp3');
var audioPlaying = false;

function playGuide(){
	gtag('event', 'AudioGuide');
	if (audioPlaying) {
		audio.pause()
		audioPlaying = false;
		}
	else {
		audio.play();
		audioPlaying = true;
	}
}

// Main function, centers points, and adds eventlisteners for Popupbutton
function openmyPopup(e){
		document.getElementById('swiper-container').style.visibility = "visible";
		//console.log("click: " +  e.sourceTarget.id)
		swiper.slideTo(e.sourceTarget.id + 1, 0, false)
}

function closemyPopup(){
	document.getElementById('swiper-container').style.visibility = "hidden";
	
	//center view over target
	marker = route[n]
	let xy = marker.getLatLng();
	map.setView(L.latLng(xy.lat, xy.lng), 17, {animate:true, duration:0.6});

	if (route[n].type == "art") {
		route[n].setIcon(pointIcon)
	}

	audio.pause();
	audioPlaying = false;
}


// detect desktop
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (!isMobile) {
	
	var languagetext = " <p6> Diese Karte ist für Mobiltelefone optimiert. Also schnapp Dir deine Freunde, dein Handy und dein Fahrrad und folge der Reclaim Route von Ehrenfeld über das Belgische Viertel bis hin zum Ebertplatz! <br> <br> This map is optimized for mobile phones. So, all you have got to do is grab your friends, your phone and your bike and follow the Reclaim Route from Ehrenfeld via the Belgian Quarter to Ebertplatz!</p6>"

}


// init swiper
const swiper = new Swiper('.swiper-container', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,  
  });

  var startScroll, touchStart, touchCurrent;
  swiper.slides.on('touchstart', function (e) {
	  startScroll = this.scrollTop;
	  touchStart = e.targetTouches[0].pageY;
  }, true);
  swiper.slides.on('touchmove', function (e) {
	  touchCurrent = e.targetTouches[0].pageY;
	  var touchesDiff = touchCurrent - touchStart;
	  var slide = this;
	  var onlyScrolling = 
			  ( slide.scrollHeight > slide.offsetHeight ) &&
			  (
				  ( touchesDiff < 0 && startScroll === 0 ) ||
				  ( touchesDiff > 0 && startScroll === ( slide.scrollHeight - slide.offsetHeight ) ) ||
				  ( startScroll > 0 && startScroll < ( slide.scrollHeight - slide.offsetHeight ) )
			  );
	  if (onlyScrolling) {
		  e.stopPropagation();
	  }
  }, true);

swiper.on('slideChange', function () {
		//console.log("prev:" + n)
		
		if (document.getElementById('swiper-container').style.visibility == "visible") {
			//make previus point smaller and set bigIcon for new point
			if (route[n].type == "art") {
				route[n].setIcon(pointIcon)
			}
			n = swiper.realIndex;
			//console.log("new:" + n)
			if (route[n].type == "art"){	
				route[n].setIcon(pointIconL);
			}
	
			//center view over target
			marker = route[n]
			let xy = marker.getLatLng();
			map.setView(L.latLng(xy.lat - 0.0015, xy.lng), 17, {animate:true, duration:0.6});


			// audio guide
			audio.pause();
			audioPlaying = false;
			lang = document.getElementById('langBtn').innerHTML
	
			audio = new Audio('audio/'+((lang=="de") ? 'english/': 'german/' )+ 3  +'.mp3');
			
		}			
  });

  initMarkers("de")

  