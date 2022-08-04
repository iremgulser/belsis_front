
const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const source = new ol.source.Vector();

const vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ //polygon icin
            color: 'rgba(255, 255, 255, 0.5)',
        }),
        stroke: new ol.style.Stroke({ //dis cizgiler icin
            color: 'red',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ //point icin
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
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 0
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