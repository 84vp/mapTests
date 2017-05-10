

var mymap = L.map('mapid').setView([50.45054, 30.52294], 10);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidmFsZXJpaSIsImEiOiJjajJkdGkzaDYwNnMxMzhsdmF6ajN0NXMyIn0.iLRyNaOG-OecI4g2_ri8_g'
}).addTo(mymap);

mymap.on('click', onMapClick);

function onMapClick(e) {
    // console.log("You clicked the map at " + e.latlng);
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    $("input[name='lat']").val(lat.toFixed(4));
    $("input[name='lng']").val(lng.toFixed(4));
    $("input[name='title']").focus().val("Point #"+idnumb);
}

var idnumb = 0;
var idsArrey =[];
var polilang = [];

function idCounter() {
    // console.log("sidCounter is rune");
    var coutNum = idnumb;
    console.log("coutNum:"+coutNum);
    console.log("idsArrey lrnghth:"+idsArrey.length);
    if (idsArrey.length > coutNum){
        console.log("somme point was delete")
        delete idsArrey[-0];
        console.log("idsArrey lrnghth:"+idsArrey.length);
    }
};

// Script for adding marker on map click
function onMapClickNew(e) {
    var lat = $("input[name='lat']").val();
    var lng = $("input[name='lng']").val();
    var coord =  [+lat, +lng];
    var geojsonFeature = {
        "id":idnumb,
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": coord
        }
    }

    var marker;
    var idName = idnumb;
    var title = $("input[name='title']").val();
    L.geoJson(geojsonFeature, {
        pointToLayer: function(feature, latlng){

            marker = L.marker(coord, {
                title: title,
                id: idName,
                alt: "Resource Location",
                riseOnHover: true,
                draggable: true,
                icon: new L.DivIcon({
                    className: 'newIconMarker',
                    html: '<div>'+idnumb+'</div>',
                })
            }).bindPopup("<b>Title:</b>"+title+"<br><input type='button' value='Delete' class='marker-delete-button'/>");
            marker.on("popupopen", onPopupOpen);
            return marker;
        }
    }).addTo(mymap);
    ++idnumb;
    idsArrey.push(idName);
    polilang.push(coord);
    console.log("polilang:"+polilang+"; idsArrey:"+idsArrey);
    idCounter();
    cleanInputs();
}
function cleanInputs() {
    $('#markersForm')[0].reset();

}

// Function to handle delete as well as other events on marker popup open
function onPopupOpen() {
    var tempMarker = this;
    $(".marker-delete-button:visible").click(function () {
        console.log(tempMarker.options.id);
        mymap.removeLayer(tempMarker);
        --idnumb;
        var remuveId = tempMarker.options.id;
        polilang.splice(remuveId,1);
        console.log("polilang langht"+polilang.length)
        createPolilang()
    });
}

function getAllMarkers() {

    var allMarkersObjArray = [];//new Array();
    var allMarkersGeoJsonArray = [];//new Array();

    $.each(mymap._layers, function (ml) {
        //console.log(map._layers)
        if (mymap._layers[ml].feature) {

            allMarkersObjArray.push(this)
            allMarkersGeoJsonArray.push(JSON.stringify(this.toGeoJSON()))
        }
    })

    console.log(allMarkersGeoJsonArray);
    alert("total Markers : " + allMarkersGeoJsonArray.length + "\n\n" + allMarkersGeoJsonArray + "\n\n Also see your console for object view of this array" );
}

$(".get-markers").on("click", getAllMarkers);
$(".get-polileng").on("click", createPolilang);

var polyline = {}
function createPolilang() {
    remuvePoliline()
    setTimeout(function() {
        polyline = L.polyline(polilang, {color: '#FF9800'}).addTo(mymap);
    }, 500);

}
function remuvePoliline() {
    mymap.removeLayer(polyline);

}


