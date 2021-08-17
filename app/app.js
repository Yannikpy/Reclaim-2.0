document.getElementById('cookiebutton').addEventListener('click', function(){document.getElementById('cookiehinweis').style.display = 'none'})

var n = 0;

// check if artwork name is given in 
const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
artwork_qr = urlParams.get('id') ;


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
const langBtn = document.getElementById('langBtn'); 
mapContainer.appendChild(langBtn);
// add event listener
const infoBtn = document.getElementById('infoBtn'); 
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
			latlngs_for_Polyline.push(loc.location);
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
	document.getElementById('info-popup').style.display = "block";
}


// function to change language
function changeLang() {
	_n = swiper.realIndex
	lang = document.getElementById('langBtn').innerHTML
	lang = (lang == "de") ? "en" : "de";
	document.getElementById('langBtn').innerHTML = lang
	initMarkers(lang)
	swiper.slideTo(_n, 0, false)
		
}


// function that takes creates html-string from information about artwork
function createContent(order, id, artist, title, text, info, insta, website, isMobile) {
	if (isMobile){
		content = document.getElementById('myContentTemplateMobile').innerHTML
	}
	else {
		content = document.getElementById('myContentTemplateDesktop').innerHTML
	}
	
	content = content.replace("_n_", order)
	content = content.replace("_id_",id)
	content = content.replace("_artist_",artist)
	content = content.replace("_title_",title)
	content = content.replace("_text_",text)
	content = content.replace("_insta_",insta)
	content = content.replace("_website_",website)
	if (info != ""){
		content = content.replace("none", "block")
		content = content.replace("_info_",info)
		content = content.replace("myContent","myContentWithInfo")
		content = content.replace("audioAndXBox","audioAndXBoxWithInfo")
	}
	
	return content
	}



// init all markers in correct Language
// prepare Popup on buttom of map

var route = [];
var markers = new L.FeatureGroup();
map.addLayer(markers);

function initMarkers(lang) {
	var	imgWidth = window.innerWidth
	isMobile = (imgWidth <= 600)
	
	swiper.removeAllSlides();
	markers.clearLayers();
	route = [];
	slides = [];
	var i = 0;
	for (loc of locations) {
		if (loc.artist == "") { // these are stations
			if (isMobile){
			marker = eval(loc.id)
			marker.type = "station"
			route.push(marker);	
			content = document.getElementById('myStationTemplate').innerHTML
			content = content.replace("_text_", lang == "de" ? loc.text_de: loc.text_en)
			content = content.replace("_title_", loc.title)
			slides.push(content)
			}
			else {
				i--;
			}
			
			
		}
		else { // these are points
			var marker = L.marker(loc.location, {icon: pointIcon}).addTo(map)
			marker.id = i;
			marker.type = "art"
			marker.on('click', openmyPopup)
			markers.addLayer(marker)
			route.push(marker);
	
			if (lang=="de"){
				var content = createContent(loc.order, loc.id, loc.artist, loc.title, loc.text_de, loc.info_de, loc.insta, loc.website, isMobile)
			}
			else {
				var content = createContent(loc.order, loc.id, loc.artist, loc.title, loc.text_en, loc.info_en, loc.insta,loc.website, isMobile)
			}
			
			slides.push(content)
			if (artwork_qr == loc.id){
				n = i 
			}
		}

		i++;
	}

	swiper.addSlide(0, slides)

	infoPopup = document.getElementById("info-popup")
	var infotext = (lang = "de") ? infotext_de : infotext_en;
	content = infoPopup.innerHTML
	content = content.replace("_title_", infotext.title)
	content = content.replace("_text1_", infotext.text1)
	content = content.replace("_text2_", infotext.text2)
	content = content.replace("_text3_", infotext.text3)
	infoPopup.innerHTML = content

	


	//eventlisteners
	var buttons = document.querySelectorAll(".closeBtn")
	for (const button of buttons){
		button.addEventListener('click', closemyPopup)
	}
	var buttons = document.querySelectorAll(".audioBtn")
	for (const button of buttons){
		button.addEventListener('click', playGuide)
	}
	var buttons = document.querySelectorAll(".myprevbutton")
	for (const button of buttons){
		button.addEventListener('click', e => swiper.slidePrev())
	}
	var buttons = document.querySelectorAll(".mynextbutton")
	for (const button of buttons){
		button.addEventListener('click', e => swiper.slideNext())
	}

	
	if (isMobile){
		var images = document.querySelectorAll(".image")
		for (const image of images) {
		image.addEventListener('click', event => event.target.classList.toggle('image-clear'))
		}
		var	imgWidth = window.innerWidth - 140
		var	imgHeight = imgWidth * (1436/2230)
		var imageContainers = document.querySelectorAll(".image-container")
		for (imageContainer of imageContainers) {
			imageContainer.style.width = imgWidth + "px";
			imageContainer.style.height = imgHeight + "px";
		}
	}
	else {
		var imgHeight = document.querySelector(".image").style.height
		var buttons = document.querySelectorAll(".audioAndXBox")
	}
	if (artwork_qr){
		document.getElementById('swiper-container').style.visibility = "visible";
		swiper.slideTo(n, 0, false)
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

// On Slidechange, centers points, and adds eventlisteners for Popupbutton
function openmyPopup(e){
		document.getElementById('swiper-container').style.visibility = "visible";
		//console.log("click: " +  e.sourceTarget.id)
		swiper.slideTo(e.sourceTarget.id + 1, 0, false)
}

function closemyPopup(){
	if   (document.getElementById('info-popup').style.display == "block"){
		document.getElementById('info-popup').style.display = "none";
		
	}
	else if (document.getElementById('swiper-container').style.visibility == "visible"){
		slide = document.querySelector('.swiper-slide-active')
		slide.querySelector('.image').style.transition = "0s";
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
	
	
	
	
}


// detect desktop
var	imgWidth = window.innerWidth
isMobile = (imgWidth <= 600)



// init swiper
const swiper = new Swiper('.swiper-container', {
	// Optional parameters
	direction: 'horizontal',
	cssMode: isMobile? true:  false,
	loop: true,
	//touchMoveStopPropagation: true,
  });



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
			var	imgWidth = window.innerWidth
			offsety = (imgWidth <= 600)? 0.0015: 0;
			offsetx = (imgWidth <= 600)? 0: 0.001; 
			marker = route[n]
			let xy = marker.getLatLng();
			map.setView(L.latLng(xy.lat - offsety, xy.lng - offsetx), 17, {animate:true, duration:0.6});


			// audio guide
			audio.pause();
			audioPlaying = false;
			lang = document.getElementById('langBtn').innerHTML
	
			audio = new Audio('audio/'+((lang=="de") ? 'english/': 'german/' )+ 3  +'.mp3');
			
			//slide = document.querySelector('.swiper-slide-active')
			//slide.querySelector('.image').style.transition = "2s";
		}			
  });

  initMarkers("de")


  