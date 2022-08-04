

const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const source = new ol.source.Vector();
const modify = new ol.interaction.Modify({ source: source });

var trmap = new ol.Map({
    target: 'map',
    layers: [raster],
    view: new ol.View({
        center: ol.proj.fromLonLat([37, 39]),
        zoom: 6
    })
});

map.addInteraction(modify);
