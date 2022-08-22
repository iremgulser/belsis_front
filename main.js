var wktFortmat = new ol.format.WKT()

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
        center: ol.proj.fromLonLat([38, 39]),
        zoom: 5.8,
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
var modal = document.getElementById("addModal");



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

function addNewRow(id, city, town, neighbourhood) {
    $("table").append(" <tr id='" + id + "'><td>" + id + "</td><td>" + city + "</td><td>" + town + "</td><td>" + neighbourhood + "</td><td><button type='button' onclick='editwindow(" + id + ")'>Edit</button></td><td><button type='button' onclick='DELETE(" + id + ")'>Delete</button></td></tr>");
}
function removeRow(id) {
    $("#" + id).remove();

}

var Editid = 0;
function editwindow(id) {
    $("#updateModal").show();
    Editid = id;

}

function POST(data) {
    $.ajax({
        type: "POST",
        url: "https://localhost:5001/api/Parcel/",
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'JSON',
        success: function (id) {
            addNewRow(id, data.city, data.town, data.neighbourhood, data.wkt);
        },
    });
}

function DELETE(id) {
    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: 'https://localhost:5001/api/Parcel/' + id,
        success: function () {
            removeRow(id);
            alert("The parcel has been removed.")
        }
    })
}

function PUT(data) {
    $.ajax({
        type: 'PUT',
        url: 'https://localhost:5001/api/Parcel/' + data.id,
        dataType: 'JSON',
        contentType: 'application/json',
        data: JSON.stringify(data),

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
                data.forEach(function (e) {
                    addNewRow(e.id, e.city, e.town, e.neighbourhood);
                    const parcel = wktFortmat.readFeature(e.wktString, {
                        dataProjection: 'EPSG:3857',
                        featureProjection: 'EPSG:3857',
                    });
                    source.addFeature(parcel)

                });
            }
            // $('#myTable tbody').append('<tr><td>' + e + '</td><td>' + data.City + '</td></tr>');

        }
    });
}

var Add = document.getElementById("Add");
Add.onclick = function () {
    var datas = source.getFeatures()
    const x = wktFortmat.writeFeature(datas[datas.length - 1])

    var data = {
        "id": 0,
        "city": $("#addModal #city").val(),
        "town": $("#addModal #town").val(),
        "neighbourhood": $("#addModal #neighbourhood").val(),
        "WktString": x,
    }
    modal.style.display = "none";

    POST(data);
}

modify.on('modifyend', function (e) {
    let editWktId = e.features.getArray()[0].A.parcelId
    let editWktcity = e.features.getArray()[0].A.parcelcity
    let editWkttown = e.features.getArray()[0].A.parceltown
    let editWktneighbourhood = e.features.getArray()[0].A.pareselneighbourhood
    let editWkt = wkt.writeFeature(e.features.getArray()[0])
    let wktEditJson = { parcelId: editWktId, parceltown: editWktcity, parceltown: editWkttown, parcelneighbourhood: editWktneighbourhood, wktString: editWkt }
    $.ajax({
        type: "post",
        url: "https://localhost:44393/api/parcel/update",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(wktEditJson),
        success: successWktUpdate,
        dataType: "json",
    })
});







var Update = document.getElementById("Update");
Update.onclick = function () {
    var data = {
        "id": Editid,
        "city": $("#updateModal #city").val(),
        "town": $("#updateModal #town").val(),
        "neighbourhood": $("#updateModal #neighbourhood").val(),
    }
    $("#updateModal").hide();

    PUT(data);
}


GET();
