const raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

const kaynak = new ol.source.Vector();
const modify = new ol.interaction.Modify({ source: kaynak });

    var map = new ol.Map({
        target: 'map',
        layers: [raster],
        view: new ol.View({
            center: ol.proj.fromLonLat([37.41, 8.82]),
            zoom: 0
        })
    });

    map.addInteraction(modify);
