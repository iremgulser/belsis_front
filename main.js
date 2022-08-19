
const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const source = new ol.source.Vector();

const vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ //polygon
            color: 'rgba(255, 255, 255, 0.5)',
        }),
        stroke: new ol.style.Stroke({ //line
            color: 'red',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ //point
                color: '#ffcc33',
            }),
        }),
    }),
});

const modify = new ol.interaction.Modify({ source: source });

var map = new ol.Map({
    target: 'map',
    layers: [raster, vector],
    view: new ol.View({
        center: ol.proj.fromLonLat([37, 39]),
        zoom: 6
    })
});

map.addInteraction(modify);

let draw, snap; // global so we can remove them later
const typeSelect = document.getElementById('type');

typeSelect.onchange = function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
    map.un('click', callBack)
};

function callBack() {

}

function addInteractions() {
    draw = new ol.interaction.Draw({
        source: source,
        type: typeSelect.value,
    });
    map.addInteraction(draw);
    snap = new ol.interaction.Snap({ source: source });
    map.addInteraction(snap);
    draw.on('drawend', drawend);
}
function drawend() {
    modal.style.display = "block";
}
// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    DELETEParcel()
}
function DELETEParcel() {
    var datas = source.getFeatures()
    source.removeFeature(datas[datas.length - 1])

    modal.style.display = "none";
}
// When clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        DELETEParcel()
    }
}



function POST(data) {
    $.ajax({
        type: "POST",
        url: "https://localhost:5001/api/Parcel",
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'JSON',
        success: function (e) {
            $('#myTable tbody').append('<tr><td>' + e + '</td><td>' + data.City + '</td></tr>');
        },
    });
}

function DELETE(data) {
    $.ajax({
        type: 'DELETE',
        url: 'https://localhost:5001/api/Parcel',
        dataType: 'JSON',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function () {
            alert("Parcellation was deleted.");
        }
    })
}

function UPDATE(data) {
    $.ajax({
        type: 'DELETE',
        url: 'https://localhost:5001/api/Parcel',
        dataType: 'JSON',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function () {
            alert("Parcellation was updated.");
        }
    })
}

function GET() {
    $.ajax({
        type: 'GET',
        url: 'https://localhost:5001/api/Parcel',
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (data) {
            if (data) {
                data.forEach(function (e) { $('#myTable tbody').append('<tr><td>' + e.id + '</td><td>' + e.city + '</td></tr>'); });
            }
            // $('#myTable tbody').append('<tr><td>' + e + '</td><td>' + data.City + '</td></tr>');

        }
    });
}

var Save = document.getElementById("Save");
Save.onclick = function () {
    var data = {
        "id": 0,
        "City": $("#City").val(),
        "Town": $("#Town").val(),
        "Neighbourhood": $("#Neighbourhood").val(),
    }
    modal.style.display = "none";




    POST(data);
}

GET();
