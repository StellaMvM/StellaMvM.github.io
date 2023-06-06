
//inicializar mapa en cordenadas en ul div mapa
var mapa1 = L.map('mapa', {
    center: [-16.290154, -63.588653],
    zoom: 8
});
//fondo para el mapa (L.tileLayer)
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
var google = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}');
var opentopomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
var cartocdn = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');

var mapaBaseOscuro = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png');

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    //maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(mapa1);

//crear marcador (L.marker)
var plaza_pagador = L.marker([-17.951415, -67.110858], { title: "Plaza Sebastián Pagador" }).bindPopup("<b>Esta es la Plaza Sebastián Pagador</b>");//.addTo(mapa1);



//////////////////////////////////////////////////////////////////////////////////
///añade evento onClick al mapa
///captura coordenadas del mapa y envia a tres INPUTs
var mapa_nodos = L.circle();
var mapa_vertices = L.polyline([0, 0]);

var mapa_nodoYo = L.circle();
var mapa_nodoCercano = L.circle();
var mapa_nodoYoFin = L.circle();
var mapa_nodoCercanoFin = L.circle();

var mapa_rutaSolucion = L.polyline([0, 0]);
var mapa_rutaSolucionVector = [];
var mapa_circuloInicio = L.circle();
var mapa_circuloInicioVector = [];
var mapa_circuloFin = L.circle();
var mapa_circuloFinVector = [];

var nodoYo;
var nodoCercano;
var nodoYoFin;
var nodoCercanoFin;
var start;
var finish;

function onMapClick(e) {
    //////////////////////////////////////////////capturar coordenadas
    /*
    var latLngToLayerPoint = mapa1.latLngToLayerPoint(e.latlng);
    document.getElementById('txtPoint').value = latLngToLayerPoint;

    var layerPointToLatLng = mapa1.layerPointToLatLng(e.layerPoint);
    document.getElementById('txtLatLng').value = layerPointToLatLng;

    var containerPointToLayerPoint = mapa1.containerPointToLayerPoint(e.layerPoint);
    document.getElementById('txtPointToLayerPoint').value = containerPointToLayerPoint;
    */
    //////////////////////////////////////////////

    //eliminar anteriores rutas
    mapa_rutaSolucionVector.forEach(element => {
        element.remove();
    });
    ///////////////////////////////



    if (nodoYo && nodoYoFin) {
        nodoYo = null;
        nodoYoFin = null;
    }

    if (!nodoYo) {
        nodoYo = [e.latlng.lat, e.latlng.lng];
        console.log("nodo yo: " + nodoYo);
        nodoCercano = nodoMasCercanoIndiceGeoJson(nodoYo);
        console.log("nodo cercano: " + nodoCercano.id);
        start = nodoCercano;
        //console.log(start);


        mapa_circuloInicioVector.forEach(element => {
            element.remove();
        });
        //mapa_circuloInicio.remove();
        showStartGeoJson(start);

        mapa_nodoYo.remove();
        mapa_nodoYo = L.circle(nodoYo, 12, {
            color: 'black',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO: YO").openPopup();
        mapa_nodoYo.addTo(mapa1);

        mapa_nodoCercano.remove();
        mapa_nodoCercano = L.circle(nodoCercano.latlng, 12, {
            color: 'black',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO CERCANO").openPopup();
        mapa_nodoCercano.addTo(mapa1);
    }

    else if (!nodoYoFin) {
        nodoYoFin = [e.latlng.lat, e.latlng.lng];
        nodoCercanoFin = nodoMasCercanoIndiceGeoJson(nodoYoFin);
        finish = nodoCercanoFin;

        mapa_circuloFinVector.forEach(element => {
            element.remove();
        });
        //mapa_circuloFin.remove();
        showFinishGeoJson(finish);

        //console.log(finish);
        var graph = readyGraphGeoJson(verticesGeoJson);
        var shortestPath = solveGeoJson(graph, start.id, finish.id);

        showPathGeoJson(start.id, shortestPath.path);
        /*
        function ResolverYPintarRutaCortaGeoJson(start, finish) {
            //console.log("metodo ResolverYPintarRutaCortaGeoJson");
            showStartFinishGeoJson(start, finish);
            var graph = readyGraphGeoJson(verticesGeoJson);
            var shortestPath = solveGeoJson(graph, start, finish);
            showPathGeoJson(start, shortestPath.path);
            //console.log("metodo ResolverYPintarRutaCortaGeoJson");
        }
        */
        ///pintar nodo yo       
        mapa_nodoYoFin.remove();
        mapa_nodoYoFin = L.circle(nodoYoFin, 12, {
            color: 'black',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO: YO").openPopup();
        mapa_nodoYoFin.addTo(mapa1);

        mapa_nodoCercanoFin.remove();
        mapa_nodoCercanoFin = L.circle(nodoCercanoFin.latlng, 12, {
            color: 'black',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO CERCANO").openPopup();
        mapa_nodoCercanoFin.addTo(mapa1);

    }

    /////////////////////anterior onclick
    /*
    if (nodoYo && nodoYoFin) {
        nodoYo = null;
        nodoYoFin = null;
    }

    if (!nodoYo) {
        nodoYo = [e.latlng.lat, e.latlng.lng];
        nodoCercano = nodoMasCercanoIndice(nodoYo);
        start = nodoCercano;
        //console.log(start);

        mapa_circuloInicioVector.forEach(element => {
            element.remove();
        });
        //mapa_circuloInicio.remove();
        showStart(start);

        mapa_nodoYo.remove();
        mapa_nodoYo = L.circle(nodoYo, 12, {
            color: 'black',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO: YO").openPopup();
        mapa_nodoYo.addTo(mapa1);

        mapa_nodoCercano.remove();
        mapa_nodoCercano = L.circle(nodes[nodoCercano].coord, 12, {
            color: 'black',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO CERCANO").openPopup();
        mapa_nodoCercano.addTo(mapa1);
    }
    else if (!nodoYoFin) {
        nodoYoFin = [e.latlng.lat, e.latlng.lng];
        nodoCercanoFin = nodoMasCercanoIndice(nodoYoFin);
        finish = nodoCercanoFin;

        mapa_circuloFinVector.forEach(element => {
            element.remove();
        });
        //mapa_circuloFin.remove();
        showFinish(finish);

        //console.log(finish);
        var graph = readyGraph(vertices);
        var shortestPath = solve(graph, start, finish);

        showPath(start, shortestPath.path);

        ///pintar nodo yo       
        mapa_nodoYoFin.remove();
        mapa_nodoYoFin = L.circle(nodoYoFin, 12, {
            color: 'black',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO: YO").openPopup();
        mapa_nodoYoFin.addTo(mapa1);

        mapa_nodoCercanoFin.remove();
        mapa_nodoCercanoFin = L.circle(nodes[nodoCercanoFin].coord, 12, {
            color: 'black',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO CERCANO").openPopup();
        mapa_nodoCercanoFin.addTo(mapa1);
    }
    */

}

mapa1.on('click', onMapClick);
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
///medir distancia
/*
var firstLatLng,
    secondLatLng;
map.on('click', function (e) {
    if (!firstLatLng) {
        firstLatLng = e.latlng;
        L.marker(firstLatLng).addTo(map).bindPopup('Point A<br/>' + e.latlng).openPopup();
    } else {
        secondLatLng = e.latlng;
        L.marker(secondLatLng).addTo(map).bindPopup('Point B<br/>' + e.latlng).openPopup();
    }

    if (firstLatLng && secondLatLng) {
        // Dibujamos una línea entre los dos puntos
        L.polyline([firstLatLng, secondLatLng], {
            color: 'red'
        }).addTo(map);

        medirDistancia();
    }
})
//////////////////////////////////////////////////////////////////////////////////
function medirDistancia() {
    var distance = map.distance(firstLatLng, secondLatLng);
    document.getElementById('distance').innerHTML = distance;
}
*/
//////////////////////////////////////////////////////////////////////////////////


var nodes = [
    { coord: [-17.987981, -67.136351] },
    { coord: [-17.987119, -67.135552] },
    { coord: [-17.987292, -67.137059] },
    { coord: [-17.986563, -67.136925] },
    { coord: [-17.98664, -67.135289] },
    { coord: [-17.987996, -67.135975] },
    { coord: [-17.986522, -67.136657] }
];

var vertices = [
    { ini: 0, fin: 1, distancia: mapa1.distance(nodes[0].coord, nodes[1].coord) },
    { ini: 0, fin: 2, distancia: mapa1.distance(nodes[0].coord, nodes[2].coord) },
    { ini: 0, fin: 3, distancia: mapa1.distance(nodes[0].coord, nodes[3].coord) },
    { ini: 1, fin: 2, distancia: mapa1.distance(nodes[1].coord, nodes[2].coord) },
    { ini: 2, fin: 4, distancia: mapa1.distance(nodes[2].coord, nodes[4].coord) },
    //{ ini: 3, fin: 6, distancia: mapa1.distance(nodes[2].coord, nodes[4].coord) },
    { ini: 4, fin: 5, distancia: mapa1.distance(nodes[4].coord, nodes[5].coord) },
    { ini: 5, fin: 6, distancia: mapa1.distance(nodes[5].coord, nodes[6].coord) },
];

function Pruebas() {
    mapa1.flyTo([-17.987981, -67.136351], 18);

    //MostrarNodos();
    //MostrarVertices();

    //ResolverYPintarRutaCorta(0, 4);
    //ResolverYPintarRutaCorta(0, 6);
    //ResolverYPintarRutaCorta(0, 3);

    MostrarVerticesGeoJson();
    MostrarNodosGeoJson();
    //ResolverYPintarRutaCortaGeoJson(301, 306);///bien
    //ResolverYPintarRutaCortaGeoJson(287, 290);///bien
    //ResolverYPintarRutaCortaGeoJson(287, 293);///bien
    //ResolverYPintarRutaCortaGeoJson(287, 301);///bien
    //ResolverYPintarRutaCortaGeoJson(296, 288);///bien
    //ResolverYPintarRutaCortaGeoJson(288, 296);///bien
    
    //ResolverYPintarRutaCortaGeoJson(276, 318);///malo
    //ResolverYPintarRutaCortaGeoJson(122, 318);///malo

    //ResolverYPintarRutaCortaGeoJson(287, 208);///bien
    //ResolverYPintarRutaCortaGeoJson(208, 287);///bien

    /*
    console.log(nodosGeoJson);
    console.log(nodosGeoJson.features);
    nodosGeoJson.features.forEach(element => {
        console.log(element);
    });
    nodosGeoJson.features.forEach(element => {
        console.log(element.properties);
        console.log(element.geometry);
    });
    */
    //console.log("metodo pruebas");


}

function PruebasEstatico1() {
    mapa1.flyTo([-17.987981, -67.136351], 18);

    MostrarNodos();
    MostrarVertices();

    var nodoYo = [-17.98792, -67.136759];
    ObtenerMiUbicacionActual();
    var nodoCercano = nodoMasCercanoIndice(nodoYo);

    var start = nodoCercano;
    var finish = 6;

    mapa_circuloInicio.remove();
    mapa_circuloFin.remove();
    showStartFinish(start, finish);

    var graph = readyGraph(vertices);
    var shortestPath = solve(graph, start, finish);
    //debugger;    
    showPath(start, shortestPath.path);

    ///////////////////////////////////////////////////
    ///proximidad prueba

    ///pintar nodo yo
    mapa_nodoYo.remove();
    mapa_nodoCercano.remove();

    mapa_nodoYo = L.circle(nodoYo, 12, {
        color: 'black',
        opacity: 3,
        fillColor: 'black',
        fillOpacity: .5
    }).bindPopup("NODO: YO").openPopup().addTo(mapa1);

    ///pintar nodo yo cercano
    //console.log(nodoCercano);
    mapa_nodoCercano = L.circle(nodes[nodoCercano].coord, 12, {
        color: 'black',
        opacity: 3,
        fillColor: 'black',
        fillOpacity: .5
    }).bindPopup("NODO CERCANO").openPopup().addTo(mapa1);
}

function ResolverYPintarRutaCorta(start, finish) {
    showStartFinish(start, finish);
    var graph = readyGraph(vertices);
    var shortestPath = solve(graph, start, finish);
    showPath(start, shortestPath.path);
}

function ResolverYPintarRutaCortaGeoJson(start, finish) {
    //console.log("metodo ResolverYPintarRutaCortaGeoJson");
    showStartFinishGeoJson(start, finish);
    var graph = readyGraphGeoJson(verticesGeoJson);
    var shortestPath = solveGeoJson(graph, start, finish);
    showPathGeoJson(start, shortestPath.path);
    //console.log("metodo ResolverYPintarRutaCortaGeoJson");
}

function MostrarNodos() {
    //mapa_nodos.remove();
    nodes.forEach((element, indice) => {
        L.circle([element.coord[0], element.coord[1]], 3, {
            color: 'blue',
            opacity: 3,
            fillColor: 'black',
            fillOpacity: .5
        }).bindPopup("NODO: " + indice).openPopup().addTo(mapa1);
    });
}

function MostrarVertices() {

    /*
    var verticeConDistancia = []
    vertices.forEach(element => {
        var aux = { ini: 0, fin: 0, distancia: 0 };
        aux.ini = element.ini;
        aux.fin = element.fin;
        aux.distancia = mapa1.distance(nodes[element.ini].coord, nodes[element.fin].coord);
        verticeConDistancia.push(aux);
    });
    */
    vertices.forEach(element => {
        L.polyline([nodes[element.ini].coord, nodes[element.fin].coord], {
            color: '#00aae4'
        }).bindPopup("DISTANCIA: " + element.distancia).openPopup().addTo(mapa1);
    });
}

function MostrarNodosGeoJson() {
    var MarkerOptions = {
        radius: 2,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    var mapa_carreras = L.geoJSON(nodosGeoJson, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.OBJECTID == 123) {
                //console.log(feature.properties.OBJECTID + "  " + latlng);
            }
            return L.circleMarker(latlng, MarkerOptions);
        },
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE: ' +
                feature.properties.OBJECTID;
            layer.bindPopup(popupContent);
        }
    }
    ).addTo(mapa1);
}


var verticesGeoJson = [
    {
        ini: 1,
        fin: 2,
        distancia: 0
    },
    {
        ini: 2,
        fin: 3,
        distancia: 0
    },
    {
        ini: 4,
        fin: 5,
        distancia: 0
    },
    {
        ini: 3,
        fin: 4,
        distancia: 0
    },
    {
        ini: 4,
        fin: 7,
        distancia: 0
    },
    {
        ini: 5,
        fin: 6,
        distancia: 0
    },
    {
        ini: 6,
        fin: 7,
        distancia: 0
    },
    {
        ini: 7,
        fin: 8,
        distancia: 0
    },
    {
        ini: 8,
        fin: 9,
        distancia: 0
    },
    {
        ini: 9,
        fin: 10,
        distancia: 0
    },
    {
        ini: 10,
        fin: 11,
        distancia: 0
    },
    {
        ini: 2,
        fin: 17,
        distancia: 0
    },
    {
        ini: 1,
        fin: 17,
        distancia: 0
    },
    {
        ini: 17,
        fin: 16,
        distancia: 0
    },
    {
        ini: 16,
        fin: 15,
        distancia: 0
    },
    {
        ini: 15,
        fin: 19,
        distancia: 0
    },
    {
        ini: 15,
        fin: 11,
        distancia: 0
    },
    {
        ini: 11,
        fin: 12,
        distancia: 0
    },
    {
        ini: 12,
        fin: 14,
        distancia: 0
    },
    {
        ini: 14,
        fin: 13,
        distancia: 0
    },
    {
        ini: 11,
        fin: 18,
        distancia: 0
    },
    {
        ini: 15,
        fin: 18,
        distancia: 0
    },
    {
        ini: 18,
        fin: 22,
        distancia: 0
    },
    {
        ini: 19,
        fin: 57,
        distancia: 0
    },
    {
        ini: 19,
        fin: 26,
        distancia: 0
    },
    {
        ini: 26,
        fin: 57,
        distancia: 0
    },
    {
        ini: 22,
        fin: 25,
        distancia: 0
    },
    {
        ini: 14,
        fin: 20,
        distancia: 0
    },
    {
        ini: 20,
        fin: 21,
        distancia: 0
    },
    {
        ini: 21,
        fin: 22,
        distancia: 0
    },
    {
        ini: 22,
        fin: 23,
        distancia: 0
    },
    {
        ini: 23,
        fin: 21,
        distancia: 0
    },
    {
        ini: 21,
        fin: 24,
        distancia: 0
    },
    {
        ini: 24,
        fin: 23,
        distancia: 0
    },
    {
        ini: 23,
        fin: 25,
        distancia: 0
    },
    {
        ini: 26,
        fin: 25,
        distancia: 0
    },
    {
        ini: 25,
        fin: 24,
        distancia: 0
    },
    {
        ini: 20,
        fin: 27,
        distancia: 0
    },
    {
        ini: 27,
        fin: 28,
        distancia: 0
    },
    {
        ini: 28,
        fin: 30,
        distancia: 0
    },
    {
        ini: 28,
        fin: 29,
        distancia: 0
    },
    {
        ini: 29,
        fin: 32,
        distancia: 0
    },
    {
        ini: 24,
        fin: 32,
        distancia: 0
    },
    {
        ini: 30,
        fin: 31,
        distancia: 0
    },
    {
        ini: 29,
        fin: 31,
        distancia: 0
    },
    {
        ini: 30,
        fin: 34,
        distancia: 0
    },
    {
        ini: 31,
        fin: 33,
        distancia: 0
    },
    {
        ini: 33,
        fin: 35,
        distancia: 0
    },
    {
        ini: 45,
        fin: 32,
        distancia: 0
    },
    {
        ini: 32,
        fin: 33,
        distancia: 0
    },
    {
        ini: 33,
        fin: 45,
        distancia: 0
    },
    {
        ini: 34,
        fin: 37,
        distancia: 0
    },
    {
        ini: 37,
        fin: 36,
        distancia: 0
    },
    {
        ini: 36,
        fin: 38,
        distancia: 0
    },
    {
        ini: 35,
        fin: 38,
        distancia: 0
    },
    {
        ini: 35,
        fin: 35,
        distancia: 0
    },
    {
        ini: 38,
        fin: 39,
        distancia: 0
    },
    {
        ini: 36,
        fin: 40,
        distancia: 0
    },
    {
        ini: 40,
        fin: 41,
        distancia: 0
    },
    {
        ini: 36,
        fin: 41,
        distancia: 0
    },
    {
        ini: 35,
        fin: 42,
        distancia: 0
    },
    {
        ini: 42,
        fin: 33,
        distancia: 0
    },
    {
        ini: 44,
        fin: 42,
        distancia: 0
    },
    {
        ini: 40,
        fin: 39,
        distancia: 0
    },
    {
        ini: 39,
        fin: 44,
        distancia: 0
    },
    {
        ini: 39,
        fin: 42,
        distancia: 0
    },
    {
        ini: 42,
        fin: 45,
        distancia: 0
    },
    {
        ini: 24,
        fin: 54,
        distancia: 0
    },
    {
        ini: 44,
        fin: 45,
        distancia: 0
    },
    {
        ini: 44,
        fin: 43,
        distancia: 0
    },
    {
        ini: 39,
        fin: 43,
        distancia: 0
    },
    {
        ini: 43,
        fin: 46,
        distancia: 0
    },
    {
        ini: 46,
        fin: 47,
        distancia: 0
    },
    {
        ini: 44,
        fin: 50,
        distancia: 0
    },
    {
        ini: 50,
        fin: 49,
        distancia: 0
    },
    {
        ini: 46,
        fin: 48,
        distancia: 0
    },
    {
        ini: 48,
        fin: 91,
        distancia: 0
    },
    {
        ini: 91,
        fin: 92,
        distancia: 0
    },
    {
        ini: 92,
        fin: 93,
        distancia: 0
    },
    {
        ini: 91,
        fin: 93,
        distancia: 0
    },
    {
        ini: 49,
        fin: 51,
        distancia: 0
    },
    {
        ini: 51,
        fin: 79,
        distancia: 0
    },
    {
        ini: 86,
        fin: 79,
        distancia: 0
    },
    {
        ini: 86,
        fin: 51,
        distancia: 0
    },
    {
        ini: 51,
        fin: 78,
        distancia: 0
    },
    {
        ini: 78,
        fin: 52,
        distancia: 0
    },
    {
        ini: 45,
        fin: 52,
        distancia: 0
    },
    {
        ini: 52,
        fin: 70,
        distancia: 0
    },
    {
        ini: 70,
        fin: 54,
        distancia: 0
    },
    {
        ini: 53,
        fin: 70,
        distancia: 0
    },
    {
        ini: 53,
        fin: 55,
        distancia: 0
    },
    {
        ini: 55,
        fin: 25,
        distancia: 0
    },
    {
        ini: 55,
        fin: 56,
        distancia: 0
    },
    {
        ini: 56,
        fin: 58,
        distancia: 0
    },
    {
        ini: 58,
        fin: 57,
        distancia: 0
    },
    {
        ini: 55,
        fin: 67,
        distancia: 0
    },
    {
        ini: 67,
        fin: 68,
        distancia: 0
    },
    {
        ini: 68,
        fin: 69,
        distancia: 0
    },
    {
        ini: 69,
        fin: 70,
        distancia: 0
    },
    {
        ini: 69,
        fin: 76,
        distancia: 0
    },
    {
        ini: 68,
        fin: 76,
        distancia: 0
    },
    {
        ini: 56,
        fin: 65,
        distancia: 0
    },
    {
        ini: 65,
        fin: 66,
        distancia: 0
    },
    {
        ini: 58,
        fin: 60,
        distancia: 0
    },
    {
        ini: 60,
        fin: 57,
        distancia: 0
    },
    {
        ini: 61,
        fin: 60,
        distancia: 0
    },
    {
        ini: 60,
        fin: 59,
        distancia: 0
    },
    {
        ini: 58,
        fin: 59,
        distancia: 0
    },
    {
        ini: 61,
        fin: 57,
        distancia: 0
    },
    {
        ini: 61,
        fin: 59,
        distancia: 0
    },
    {
        ini: 61,
        fin: 63,
        distancia: 0
    },
    {
        ini: 64,
        fin: 63,
        distancia: 0
    },
    {
        ini: 63,
        fin: 62,
        distancia: 0
    },
    {
        ini: 61,
        fin: 63,
        distancia: 0
    },
    {
        ini: 59,
        fin: 62,
        distancia: 0
    },
    {
        ini: 63,
        fin: 132,
        distancia: 0
    },
    {
        ini: 62,
        fin: 133,
        distancia: 0
    },
    {
        ini: 63,
        fin: 62,
        distancia: 0
    },
    {
        ini: 132,
        fin: 134,
        distancia: 0
    },
    {
        ini: 133,
        fin: 134,
        distancia: 0
    },
    {
        ini: 134,
        fin: 137,
        distancia: 0
    },
    {
        ini: 137,
        fin: 138,
        distancia: 0
    },
    {
        ini: 138,
        fin: 139,
        distancia: 0
    },
    {
        ini: 65,
        fin: 62,
        distancia: 0
    },
    {
        ini: 65,
        fin: 131,
        distancia: 0
    },
    {
        ini: 131,
        fin: 135,
        distancia: 0
    },
    {
        ini: 135,
        fin: 136,
        distancia: 0
    },
    {
        ini: 136,
        fin: 139,
        distancia: 0
    },
    {
        ini: 134,
        fin: 136,
        distancia: 0
    },
    {
        ini: 135,
        fin: 134,
        distancia: 0
    },
    {
        ini: 131,
        fin: 133,
        distancia: 0
    },
    {
        ini: 55,
        fin: 66,
        distancia: 0
    },
    {
        ini: 66,
        fin: 71,
        distancia: 0
    },
    {
        ini: 71,
        fin: 72,
        distancia: 0
    },
    {
        ini: 71,
        fin: 74,
        distancia: 0
    },
    {
        ini: 71,
        fin: 68,
        distancia: 0
    },
    {
        ini: 74,
        fin: 75,
        distancia: 0
    },
    {
        ini: 75,
        fin: 76,
        distancia: 0
    },
    {
        ini: 75,
        fin: 126,
        distancia: 0
    },
    {
        ini: 74,
        fin: 73,
        distancia: 0
    },
    {
        ini: 73,
        fin: 72,
        distancia: 0
    },
    {
        ini: 65,
        fin: 72,
        distancia: 0
    },
    {
        ini: 72,
        fin: 129,
        distancia: 0
    },
    {
        ini: 131,
        fin: 129,
        distancia: 0
    },
    {
        ini: 129,
        fin: 128,
        distancia: 0
    },
    {
        ini: 73,
        fin: 126,
        distancia: 0
    },
    {
        ini: 128,
        fin: 126,
        distancia: 0
    },
    {
        ini: 129,
        fin: 130,
        distancia: 0
    },
    {
        ini: 128,
        fin: 127,
        distancia: 0
    },
    {
        ini: 130,
        fin: 127,
        distancia: 0
    },
    {
        ini: 126,
        fin: 125,
        distancia: 0
    },
    {
        ini: 127,
        fin: 125,
        distancia: 0
    },
    {
        ini: 125,
        fin: 149,
        distancia: 0
    },
    {
        ini: 149,
        fin: 150,
        distancia: 0
    },
    {
        ini: 149,
        fin: 151,
        distancia: 0
    },
    {
        ini: 150,
        fin: 151,
        distancia: 0
    },
    {
        ini: 151,
        fin: 152,
        distancia: 0
    },
    {
        ini: 152,
        fin: 143,
        distancia: 0
    },
    {
        ini: 139,
        fin: 141,
        distancia: 0
    },
    {
        ini: 141,
        fin: 143,
        distancia: 0
    },
    {
        ini: 138,
        fin: 142,
        distancia: 0
    },
    {
        ini: 137,
        fin: 140,
        distancia: 0
    },
    {
        ini: 142,
        fin: 145,
        distancia: 0
    },
    {
        ini: 142,
        fin: 143,
        distancia: 0
    },
    {
        ini: 143,
        fin: 144,
        distancia: 0
    },
    {
        ini: 145,
        fin: 144,
        distancia: 0
    },
    {
        ini: 140,
        fin: 142,
        distancia: 0
    },
    {
        ini: 140,
        fin: 146,
        distancia: 0
    },
    {
        ini: 146,
        fin: 145,
        distancia: 0
    },
    {
        ini: 146,
        fin: 158,
        distancia: 0
    },
    {
        ini: 158,
        fin: 179,
        distancia: 0
    },
    {
        ini: 140,
        fin: 159,
        distancia: 0
    },
    {
        ini: 159,
        fin: 181,
        distancia: 0
    },
    {
        ini: 181,
        fin: 158,
        distancia: 0
    },
    {
        ini: 181,
        fin: 182,
        distancia: 0
    },
    {
        ini: 182,
        fin: 180,
        distancia: 0
    },
    {
        ini: 159,
        fin: 180,
        distancia: 0
    },
    {
        ini: 180,
        fin: 179,
        distancia: 0
    },
    {
        ini: 180,
        fin: 187,
        distancia: 0
    },
    {
        ini: 180,
        fin: 183,
        distancia: 0
    },
    {
        ini: 183,
        fin: 186,
        distancia: 0
    },
    {
        ini: 186,
        fin: 185,
        distancia: 0
    },
    {
        ini: 185,
        fin: 184,
        distancia: 0
    },
    {
        ini: 184,
        fin: 188,
        distancia: 0
    },
    {
        ini: 184,
        fin: 187,
        distancia: 0
    },
    {
        ini: 187,
        fin: 189,
        distancia: 0
    },
    {
        ini: 179,
        fin: 191,
        distancia: 0
    },
    {
        ini: 189,
        fin: 190,
        distancia: 0
    },
    {
        ini: 191,
        fin: 190,
        distancia: 0
    },
    {
        ini: 191,
        fin: 192,
        distancia: 0
    },
    {
        ini: 190,
        fin: 192,
        distancia: 0
    },
    {
        ini: 190,
        fin: 197,
        distancia: 0
    },
    {
        ini: 197,
        fin: 198,
        distancia: 0
    },
    {
        ini: 198,
        fin: 199,
        distancia: 0
    },
    {
        ini: 199,
        fin: 200,
        distancia: 0
    },
    {
        ini: 198,
        fin: 201,
        distancia: 0
    },
    {
        ini: 201,
        fin: 202,
        distancia: 0
    },
    {
        ini: 202,
        fin: 200,
        distancia: 0
    },
    {
        ini: 200,
        fin: 170,
        distancia: 0
    },
    {
        ini: 201,
        fin: 171,
        distancia: 0
    },
    {
        ini: 201,
        fin: 170,
        distancia: 0
    },
    {
        ini: 191,
        fin: 193,
        distancia: 0
    },
    {
        ini: 193,
        fin: 194,
        distancia: 0
    },
    {
        ini: 175,
        fin: 194,
        distancia: 0
    },
    {
        ini: 175,
        fin: 174,
        distancia: 0
    },
    {
        ini: 174,
        fin: 194,
        distancia: 0
    },
    {
        ini: 174,
        fin: 195,
        distancia: 0
    },
    {
        ini: 194,
        fin: 195,
        distancia: 0
    },
    {
        ini: 174,
        fin: 173,
        distancia: 0
    },
    {
        ini: 173,
        fin: 195,
        distancia: 0
    },
    {
        ini: 195,
        fin: 196,
        distancia: 0
    },
    {
        ini: 173,
        fin: 162,
        distancia: 0
    },
    {
        ini: 162,
        fin: 172,
        distancia: 0
    },
    {
        ini: 172,
        fin: 173,
        distancia: 0
    },
    {
        ini: 172,
        fin: 171,
        distancia: 0
    },
    {
        ini: 171,
        fin: 196,
        distancia: 0
    },
    {
        ini: 162,
        fin: 160,
        distancia: 0
    },
    {
        ini: 160,
        fin: 155,
        distancia: 0
    },
    {
        ini: 155,
        fin: 174,
        distancia: 0
    },
    {
        ini: 155,
        fin: 156,
        distancia: 0
    },
    {
        ini: 156,
        fin: 157,
        distancia: 0
    },
    {
        ini: 157,
        fin: 177,
        distancia: 0
    },
    {
        ini: 177,
        fin: 176,
        distancia: 0
    },
    {
        ini: 176,
        fin: 175,
        distancia: 0
    },
    {
        ini: 175,
        fin: 193,
        distancia: 0
    },
    {
        ini: 176,
        fin: 178,
        distancia: 0
    },
    {
        ini: 178,
        fin: 179,
        distancia: 0
    },
    {
        ini: 157,
        fin: 158,
        distancia: 0
    },
    {
        ini: 144,
        fin: 156,
        distancia: 0
    },
    {
        ini: 145,
        fin: 157,
        distancia: 0
    },
    {
        ini: 150,
        fin: 148,
        distancia: 0
    },
    {
        ini: 148,
        fin: 144,
        distancia: 0
    },
    {
        ini: 153,
        fin: 155,
        distancia: 0
    },
    {
        ini: 153,
        fin: 154,
        distancia: 0
    },
    {
        ini: 148,
        fin: 154,
        distancia: 0
    },
    {
        ini: 148,
        fin: 147,
        distancia: 0
    },
    {
        ini: 147,
        fin: 153,
        distancia: 0
    },
    {
        ini: 161,
        fin: 162,
        distancia: 0
    },
    {
        ini: 161,
        fin: 147,
        distancia: 0
    },
    {
        ini: 77,
        fin: 81,
        distancia: 0
    },
    {
        ini: 76,
        fin: 81,
        distancia: 0
    },
    {
        ini: 76,
        fin: 77,
        distancia: 0
    },
    {
        ini: 77,
        fin: 85,
        distancia: 0
    },
    {
        ini: 86,
        fin: 85,
        distancia: 0
    },
    {
        ini: 85,
        fin: 84,
        distancia: 0
    },
    {
        ini: 81,
        fin: 84,
        distancia: 0
    },
    {
        ini: 81,
        fin: 82,
        distancia: 0
    },
    {
        ini: 84,
        fin: 83,
        distancia: 0
    },
    {
        ini: 82,
        fin: 83,
        distancia: 0
    },
    {
        ini: 76,
        fin: 80,
        distancia: 0
    },
    {
        ini: 80,
        fin: 126,
        distancia: 0
    },
    {
        ini: 126,
        fin: 125,
        distancia: 0
    },
    {
        ini: 78,
        fin: 77,
        distancia: 0
    },
    {
        ini: 80,
        fin: 121,
        distancia: 0
    },
    {
        ini: 82,
        fin: 121,
        distancia: 0
    },
    {
        ini: 49,
        fin: 87,
        distancia: 0
    },
    {
        ini: 85,
        fin: 87,
        distancia: 0
    },
    {
        ini: 87,
        fin: 88,
        distancia: 0
    },
    {
        ini: 84,
        fin: 88,
        distancia: 0
    },
    {
        ini: 88,
        fin: 89,
        distancia: 0
    },
    {
        ini: 89,
        fin: 90,
        distancia: 0
    },
    {
        ini: 90,
        fin: 83,
        distancia: 0
    },
    {
        ini: 89,
        fin: 91,
        distancia: 0
    },
    {
        ini: 90,
        fin: 92,
        distancia: 0
    },
    {
        ini: 80,
        fin: 123,
        distancia: 0
    },
    {
        ini: 121,
        fin: 123,
        distancia: 0
    },
    {
        ini: 121,
        fin: 120,
        distancia: 0
    },
    {
        ini: 123,
        fin: 120,
        distancia: 0
    },
    {
        ini: 125,
        fin: 124,
        distancia: 0
    },
    {
        ini: 149,
        fin: 124,
        distancia: 0
    },
    {
        ini: 120,
        fin: 122,
        distancia: 0
    },
    {
        ini: 122,
        fin: 124,
        distancia: 0
    },
    {
        ini: 124,
        fin: 123,
        distancia: 0
    },
    {
        ini: 122,
        fin: 148,
        distancia: 0
    },
    {
        ini: 122,
        fin: 116,
        distancia: 0
    },
    {
        ini: 122,
        fin: 117,
        distancia: 0
    },
    {
        ini: 120,
        fin: 117,
        distancia: 0
    },
    {
        ini: 117,
        fin: 116,
        distancia: 0
    },
    {
        ini: 118,
        fin: 117,
        distancia: 0
    },
    {
        ini: 119,
        fin: 112,
        distancia: 0
    },
    {
        ini: 119,
        fin: 118,
        distancia: 0
    },
    {
        ini: 112,
        fin: 118,
        distancia: 0
    },
    {
        ini: 116,
        fin: 147,
        distancia: 0
    },
    {
        ini: 147,
        fin: 115,
        distancia: 0
    },
    {
        ini: 115,
        fin: 116,
        distancia: 0
    },
    {
        ini: 115,
        fin: 114,
        distancia: 0
    },
    {
        ini: 114,
        fin: 113,
        distancia: 0
    },
    {
        ini: 113,
        fin: 110,
        distancia: 0
    },
    {
        ini: 110,
        fin: 112,
        distancia: 0
    },
    {
        ini: 110,
        fin: 163,
        distancia: 0
    },
    {
        ini: 96,
        fin: 119,
        distancia: 0
    },
    {
        ini: 96,
        fin: 121,
        distancia: 0
    },
    {
        ini: 96,
        fin: 94,
        distancia: 0
    },
    {
        ini: 94,
        fin: 108,
        distancia: 0
    },
    {
        ini: 108,
        fin: 109,
        distancia: 0
    },
    {
        ini: 109,
        fin: 110,
        distancia: 0
    },
    {
        ini: 110,
        fin: 111,
        distancia: 0
    },
    {
        ini: 92,
        fin: 97,
        distancia: 0
    },
    {
        ini: 92,
        fin: 95,
        distancia: 0
    },
    {
        ini: 95,
        fin: 106,
        distancia: 0
    },
    {
        ini: 106,
        fin: 107,
        distancia: 0
    },
    {
        ini: 107,
        fin: 111,
        distancia: 0
    },
    {
        ini: 97,
        fin: 99,
        distancia: 0
    },
    {
        ini: 99,
        fin: 98,
        distancia: 0
    },
    {
        ini: 99,
        fin: 95,
        distancia: 0
    },
    {
        ini: 98,
        fin: 106,
        distancia: 0
    },
    {
        ini: 95,
        fin: 94,
        distancia: 0
    },
    {
        ini: 107,
        fin: 109,
        distancia: 0
    },
    {
        ini: 99,
        fin: 100,
        distancia: 0
    },
    {
        ini: 98,
        fin: 101,
        distancia: 0
    },
    {
        ini: 100,
        fin: 101,
        distancia: 0
    },
    {
        ini: 101,
        fin: 102,
        distancia: 0
    },
    {
        ini: 102,
        fin: 105,
        distancia: 0
    },
    {
        ini: 102,
        fin: 103,
        distancia: 0
    },
    {
        ini: 103,
        fin: 104,
        distancia: 0
    },
    {
        ini: 105,
        fin: 104,
        distancia: 0
    },
    {
        ini: 98,
        fin: 105,
        distancia: 0
    },
    {
        ini: 105,
        fin: 111,
        distancia: 0
    },
    {
        ini: 105,
        fin: 167,
        distancia: 0
    },
    {
        ini: 167,
        fin: 111,
        distancia: 0
    },
    {
        ini: 167,
        fin: 168,
        distancia: 0
    },
    {
        ini: 168,
        fin: 169,
        distancia: 0
    },
    {
        ini: 105,
        fin: 166,
        distancia: 0
    },
    {
        ini: 104,
        fin: 170,
        distancia: 0
    },
    {
        ini: 166,
        fin: 168,
        distancia: 0
    },
    {
        ini: 168,
        fin: 169,
        distancia: 0
    },
    {
        ini: 169,
        fin: 161,
        distancia: 0
    },
    {
        ini: 163,
        fin: 164,
        distancia: 0
    },
    {
        ini: 164,
        fin: 165,
        distancia: 0
    },
    {
        ini: 165,
        fin: 161,
        distancia: 0
    },
    {
        ini: 92,
        fin: 108,
        distancia: 0
    },
    {
        ini: 90,
        fin: 94,
        distancia: 0
    },
    {
        ini: 83,
        fin: 96,
        distancia: 0
    }
];

function MostrarVerticesGeoJson() {

    /*
    var verticeConDistancia = []
    vertices.forEach(element => {
        var aux = { ini: 0, fin: 0, distancia: 0 };
        aux.ini = element.ini;
        aux.fin = element.fin;
        aux.distancia = mapa1.distance(nodes[element.ini].coord, nodes[element.fin].coord);
        verticeConDistancia.push(aux);
    });
    */
    verticesGeoJson.forEach(element => {
        var nodoA;
        var nodoB;
        //debugger;
        L.geoJSON(nodosGeoJson, {
            pointToLayer: function (feature, latlng) {
                if (feature.properties.OBJECTID == element.ini) {
                    //console.log(feature.properties.OBJECTID + "  " + latlng);
                    nodoA = latlng;
                }
                if (feature.properties.OBJECTID == element.fin) {
                    //console.log(feature.properties.OBJECTID + "  " + latlng);
                    nodoB = latlng;
                }
                //return L.circleMarker(latlng, MarkerOptions);
            }
        }
        );
        element.distancia = mapa1.distance(nodoA, nodoB);
        //console.log(" distancia " + element.distancia);
        L.polyline([nodoA, nodoB], {
            color: '#00aae4'
        }).bindPopup("DISTANCIA: " + element.distancia).openPopup().addTo(mapa1);
    });
}

function ObtenerMiUbicacionActual() {
    var browserLat;
    var browserLong;

    navigator.geolocation.getCurrentPosition(function (position) {
        browserLat = position.coords.latitude;
        browserLong = position.coords.longitude;

        marker_actual = L.marker([browserLat, browserLong]).addTo(mapa1);
        marker_actual.bindPopup('Hola Tu estas aqui ').openPopup().addTo(mapa1);
        //mapa1.setView([browserLat, browserLong], 18);

        console.log(browserLat);
        console.log(browserLong);
    }, function (err) {
        console.error(err);
    });
    return [browserLat, browserLong];
}

function nodoMasCercanoIndice(latLngA) {
    var distanciaMin = 99999999999;
    var nodoB = [0, 0];
    var indiceNodo = 0;
    nodes.forEach((element, indice) => {
        //console.log(latLngA);
        //console.log(element.coord);
        var aux = mapa1.distance(latLngA, element.coord)
        //console.log("distancia " + aux);
        if (aux < distanciaMin && aux != 0) {
            distanciaMin = aux;
            nodoB[0] = element.coord[0];
            nodoB[1] = element.coord[1];
            indiceNodo = indice;
        }
    });
    //console.log("distancia minima " + distanciaMin);
    //return nodoB;
    return indiceNodo;
}

function nodoMasCercanoIndiceGeoJson(latLngA) {
    var distanciaMin = 99999999999;
    var nodoB = { id: 0, latlng: [0, 0] };

    console.log("nodoMasCercanoIndiceGeoJson");
    nodosGeoJson.features.forEach(element => {
        var aux = [];//invertir las coordenadas del geojson
        aux[0] = element.geometry.coordinates[1];
        aux[1] = element.geometry.coordinates[0];
        var dist = mapa1.distance(latLngA, aux)
        if (dist < distanciaMin && dist != 0) {
            //console.log("NODO: " + element.properties.OBJECTID + " distancia " + dist);
            distanciaMin = dist;
            nodoB.latlng = aux;
            nodoB.id = element.properties.OBJECTID;
        }
    });

    return nodoB;
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

function showStartFinish(start, finish) {
    //mapa_circuloInicio = L.circle(nodes[start].coord, { radius: 9, color: "#00ff00", fillOpacity: 1 }).bindPopup(start + '  Start Point').addTo(mapa1);
    //mapa_circuloFin = L.circle(nodes[finish].coord, { radius: 9, color: "#ff0000", fillOpacity: 1 }).bindPopup(finish + '  Finish Point').addTo(mapa1);
    mapa_circuloInicioVector.push(L.circle(nodes[start].coord, { radius: 9, color: "#00ff00", fillOpacity: 1 }).bindPopup(start + '  Start Point').addTo(mapa1));
    mapa_circuloFinVector.push(L.circle(nodes[finish].coord, { radius: 9, color: "#ff0000", fillOpacity: 1 }).bindPopup(finish + '  Finish Point').addTo(mapa1));
}

function showStartFinishGeoJson(start, finish) {
    var nodoA, nodoB;
    //console.log("metodo ResolverYPintarRutaCortaGeoJson");
    L.geoJSON(nodosGeoJson, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.OBJECTID == start) {
                //console.log(feature.properties.OBJECTID + "  " + latlng);
                nodoA = latlng;
            }
            if (feature.properties.OBJECTID == finish) {
                //console.log(feature.properties.OBJECTID + "  " + latlng);
                nodoB = latlng;
            }
        }
    }
    );
    mapa_circuloInicioVector.push(L.circle(nodoA, { radius: 9, color: "#00ff00", fillOpacity: 1 }).bindPopup(start + '  Start Point').addTo(mapa1));
    mapa_circuloFinVector.push(L.circle(nodoB, { radius: 9, color: "#ff0000", fillOpacity: 1 }).bindPopup(finish + '  Finish Point').addTo(mapa1));
}

function showStart(start) {
    //mapa_circuloInicio = L.circle(nodes[start].coord, { radius: 9, color: "#00ff00", fillOpacity: 1 }).bindPopup(start + '  Start Point').addTo(mapa1);
    mapa_circuloInicioVector.push(L.circle(nodes[start].coord, { radius: 9, color: "#00ff00", fillOpacity: 1 }).bindPopup(start + '  Start Point').addTo(mapa1));
}

function showStartGeoJson(start) {
    mapa_circuloInicioVector.push(L.circle(start.latlng, { radius: 9, color: "#00ff00", fillOpacity: 1 }).bindPopup(start + '  Start Point').addTo(mapa1));
}

function showFinish(finish) {
    //mapa_circuloFin = L.circle(nodes[finish].coord, { radius: 9, color: "#ff0000", fillOpacity: 1 }).bindPopup(finish + '  Finish Point').addTo(mapa1);
    mapa_circuloFinVector.push(L.circle(nodes[finish].coord, { radius: 9, color: "#ff0000", fillOpacity: 1 }).bindPopup(finish + '  Finish Point').addTo(mapa1));
}

function showFinishGeoJson(finish) {
    mapa_circuloFinVector.push(L.circle(finish.latlng, { radius: 9, color: "#ff0000", fillOpacity: 1 }).bindPopup(finish + '  Finish Point').addTo(mapa1));
}

function showPath(start, path) {
    var lineCoords = [];
    lineCoords.push(nodes[start].coord);
    for (var i = 0; i < path.length; i++) {
        var nodeName = path[i];
        lineCoords.push(nodes[nodeName].coord);
    }
    //mapa_rutaSolucion = L.polyline(lineCoords, { color: 'blue' }).addTo(mapa1);
    mapa_rutaSolucionVector.push(L.polyline(lineCoords, { color: 'blue' }).addTo(mapa1));
}

function showPathGeoJson(start, path) {
    var lineCoords = [];
    var nodoAux = BuscarUnNodoEnGeoJson(start);
    lineCoords.push(nodoAux.latlng);

    var otro_mapa = BuscarVariosNodosEnGeoJson(path);

    //console.log("NODO ini " + nodoAux.id + " cords " + nodoAux.latlng);
    //console.log("ruta: " + otro_mapa);

    otro_mapa.forEach(element => {
        lineCoords.push(element);
    });
    /*
    console.log("ruta final: ");
    lineCoords.forEach((element, indice) => {
        console.log("ruta final: NODO " + (path[indice]) + " cords " + element);
    });
    */
    //mapa_rutaSolucion = L.polyline(lineCoords, { color: 'blue' }).addTo(mapa1);

    mapa_rutaSolucionVector.push(L.polyline(lineCoords, { color: 'blue' }).addTo(mapa1));
}

function BuscarUnNodoEnGeoJson(id) {
    var nodoA = [];//0=id // 1=latlng
    L.geoJSON(nodosGeoJson, {//////////////////////devuelve solo atributos 
        pointToLayer: function (feature, latlng) {
            if (feature.properties.OBJECTID == id) {
                nodoA[0] = feature.properties.OBJECTID;
                nodoA[1] = latlng
                //console.log(nodoA[0] + "  " + nodoA[1]);
            }
        }
    }
    );
    return { id: nodoA[0], latlng: nodoA[1] };
}

function BuscarVariosNodosEnGeoJson(listaDeCodigos) {
    //// NO SE PUEDE USAR L.GEOJSON DENTRO DE UN FOR!!!!!!!!!!!!!!
    var lista = [];
    //console.log("asdasd");
    listaDeCodigos.forEach(numero => {
        //console.log(numero);
        nodosGeoJson.features.forEach(element => {
            if (element.properties.OBJECTID == numero) {
                //console.log(element.properties.OBJECTID);
                //console.log(element.geometry.coordinates);
                var aux = [];//invertir las coordenadas del geojson
                aux[0] = element.geometry.coordinates[1];
                aux[1] = element.geometry.coordinates[0];
                lista.push(aux);
            }
        });
    });
    return lista;
    /*
    L.geoJSON(nodosGeoJson, {
        pointToLayer: function (feature, latlng) {
            //console.log(listaDeCodigos+ " iiii " + feature.properties.OBJECTID);
            if (listaDeCodigos.includes("" + feature.properties.OBJECTID)) {
                //console.log(" incluye " + feature.geometry.coordinates);                
                lista.push(latlng);
            }
            else {
                //console.log(" no incluye " + feature.geometry.coordinates);
            }

        }
    });
    return lista;
    */
    //console.log("ss" + lista);
}

function solve(graph, s, f) {
    //debugger;
    var solutions = {};
    solutions[s] = [];
    solutions[s].dist = 0;
    while (true) {
        var parent = null;
        var nearest = null;
        var dist = Infinity;
        for (var n in solutions) {
            if (!solutions[n])
                continue
            var ndist = solutions[n].dist;
            var adj = graph[n];
            //console.log(graph[n]);
            for (var a in adj) {
                if (solutions[a])
                    continue;
                var d = adj[a] + ndist;
                if (d < dist) {
                    parent = solutions[n];
                    nearest = a;
                    dist = d;
                }
            }
        }
        if (dist === Infinity) {
            break;
        }
        solutions[nearest] = parent.concat(nearest);
        solutions[nearest].dist = dist;
    }
    //console.log(solutions[f]);
    var finish = solutions[f];
    return { results: solutions, path: finish, distance: finish.dist };
}

function solveGeoJson(graph, s, f) {
    //debugger;
    ///////////////////verificar funcionamiento
    var solutions = {};
    solutions[s] = [];
    solutions[s].dist = 0;
    while (true) {
        var parent = null;
        var nearest = null;
        var dist = Infinity;
        for (var n in solutions) {
            if (!solutions[n])
                continue
            var ndist = solutions[n].dist;
            var adj = graph[n];
            //console.log(graph[n]);
            for (var a in adj) {
                if (solutions[a])
                    continue;
                var d = adj[a] + ndist;
                if (d < dist) {
                    parent = solutions[n];
                    nearest = a;
                    dist = d;
                }
            }
        }
        if (dist === Infinity) {
            break;
        }
        solutions[nearest] = parent.concat(nearest);
        solutions[nearest].dist = dist;
    }
    var finish = solutions[f];
    //console.log("solucion grafo solve: " + solutions[f]);
    return { results: solutions, path: finish, distance: finish.dist };
}

function readyGraph(paths) {
    //debugger;
    var graph = {};
    for (var i in paths) {
        var path = paths[i];
        var start = path["ini"];
        var finish = path["fin"];
        var distance = path["distancia"];
        if (typeof graph[start] == "undefined") {
            graph[start] = {};
            graph[start][finish] = distance;
        } else {
            graph[start][finish] = distance;
        }
        if (typeof graph[finish] == "undefined") {
            graph[finish] = {};
            graph[finish][start] = distance;
        } else {
            graph[finish][start] = distance;
        }
    }
    return graph;
}

function readyGraphGeoJson(paths) {
    //debugger;
    ///////////////////verificar
    var graph = {};
    for (var i in paths) {
        var path = paths[i];
        var start = path["ini"];
        var finish = path["fin"];
        var distance = path["distancia"];
        //console.log("ini: " + start + " fin: " + finish + " distancia: "+ distance);
        if (typeof graph[start] == "undefined") {
            graph[start] = {};
            graph[start][finish] = distance;
        } else {
            graph[start][finish] = distance;
        }
        if (typeof graph[finish] == "undefined") {
            graph[finish] = {};
            graph[finish][start] = distance;
        } else {
            graph[finish][start] = distance;
        }
    }
    //console.log(graph);
    return graph;
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////




function getColor(d) {
    return d > 1000000 ? '#800026' :
        d > 500000 ? '#BD0026' :
            d > 200000 ? '#E31A1C' :
                d > 100000 ? '#FC4E2A' :
                    d > 50000 ? '#FD8D3C' :
                        d > 20000 ? '#FEB24C' :
                            d > 10000 ? '#FED976' :
                                '#FFEDA0';
}
function styleMunicipio(feature) {
    return {
        //fillColor: 'green',
        fillColor: getColor(feature.properties.Pobla2019),
        weight: 2,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.7
    };
}
/*
var mapa_municipios = L.geoJSON(municipios2, {
    style: styleMunicipio,
    onEachFeature: function (feature, layer) {
        const popupContent =
            '<b>Provicia: ' +
            feature.properties.NOM_PROV +
            '</b> <br> Municipio: ' +
            feature.properties.NOM_MUN;
        layer.bindPopup(popupContent);
    }
}
);//.addTo(mapa1);
*/



var mapa_bloques = L.geoJSON(bloques
);//.addTo(mapa1);

var mapa_rutas = L.geoJSON(rutas, {

    onEachFeature: function (feature, layer) {
        const popupContent =
            '<b>NOMBRE RUTA: ' +
            feature.properties.nombre_ruta;
        layer.bindPopup(popupContent);
    }
}
);//.addTo(mapa1);

var mapa_aulasBasicas = L.geoJSON(aulasBasicas, {
    style: function styleMunicipio(feature) {
        return {
            fillColor: 'white',
            weight: 3,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
        };
    },
    onEachFeature: function (feature, layer) {
        const popupContent =
            '<b>NOMBRE: ' +
            feature.properties.nombre;
        layer.bindPopup(popupContent);
    }
}
);//.addTo(mapa1);

var mapa_bloquesAdmin = L.geoJSON(bloquesAdmin, {
    style: function styleMunicipio(feature) {
        return {
            fillColor: 'red',
            weight: 3,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
        };
    },
    onEachFeature: function (feature, layer) {
        const popupContent =
            '<b>NOMBRE: ' +
            feature.properties.NOMBRE;
        layer.bindPopup(popupContent);
    }
}
);//.addTo(mapa1);

var mapa_carreras = L.geoJSON(carreras, {
    style: function styleMunicipio(feature) {
        return {
            fillColor: 'black',
            weight: 3,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    },
    onEachFeature: function (feature, layer) {
        const popupContent =
            '<b>NOMBRE: ' +
            feature.properties.Nombre;
        layer.bindPopup(popupContent);
    }
}
);//.addTo(mapa1);

var mapa_laboratorios = L.geoJSON(laboratorios, {
    onEachFeature: function (feature, layer) {
        const popupContent =
            '<b>NOMBRE: ' +
            feature.properties.NOMBRE +
            '</b> <br> CARRERA: ' +
            feature.properties.CARRERA;
        layer.bindPopup(popupContent);
    }
}
);//.addTo(mapa1);

var mapa_ambientes = L.geoJSON(ambientes, {
    onEachFeature: function (feature, layer) {
        const popupContent =
            '<b>NOMBRE AMBIENTE: ' +
            feature.properties.nombre_ambiente +
            '</b> <br> TIPO AMBIENTE: ' +
            feature.properties.tipo_ambiente +
            '</b> <br> PISO: ' +
            feature.properties.piso +
            '</b> <br> CARRERA: ' +
            feature.properties.carrera;
        layer.bindPopup(popupContent);
    }
}
);//.addTo(mapa1);

var mapasBase = {
    "OpenStreet": osm,
    "Google": google,
    //"Open": opentopomap,
    "Carto": cartocdn,
    "traasdasd": mapaBaseOscuro,
    "satelite": googleSat
};

var mapas = {
    //"Aulas Basicas": mapa_aulasBasicas,
    //"Bloques Admin": mapa_bloquesAdmin,
    //"Carreras": mapa_carreras,
    //"Laboratorios": mapa_laboratorios,
    //"Ambientes": mapa_ambientes,
    //"rutas": mapa_rutas
};


//CONTROL DE LOS MAPAS BASE Y CAPAS DE NUESTRO MAPA

L.control.layers(mapasBase, mapas, {
    position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
    collapsed: false // true
}).addTo(mapa1);


//sw de ambientes mostrados
var sw = 0;

function boton0() {
    console.log("hola");
    google.remove();
    opentopomap.remove();
    cartocdn.remove();
    mapaBaseOscuro.remove();
    osm.addTo(mapa1);
}

function MostrarBasicas() {
    //console.log("hola");
    mapa_aulasBasicas.remove();
    mapa_bloquesAdmin.remove();
    mapa_carreras.remove();
    mapa_laboratorios.remove();
    mapa_rutas.remove();
    mapa_ambientes.remove();
    mapa_aulasBasicas.addTo(mapa1);

    
    //resetear ambientes
    document.getElementById('txtBuscar').value = "";
    sw = 0;
    FiltrarAmbientes();
    mapa_ambientes.remove();
    
    MostrarRutasBasicas();
    MostrarAmbientesBasicas();
    mapa1.flyTo([-17.989770728676625, -67.136856658164021], 17);

}
function MostrarBloquesAdmin() {
    //console.log("hola");
    mapa_aulasBasicas.remove();
    mapa_bloquesAdmin.remove();
    mapa_carreras.remove();
    mapa_laboratorios.remove();
    mapa_rutas.remove();
    mapa_ambientes.remove();
    mapa_bloquesAdmin.addTo(mapa1);

    
    document.getElementById('txtBuscar').value = "";
    sw = 0;
    FiltrarAmbientes();
    mapa_ambientes.remove();
    
    MostrarRutasAdmin();
    MostrarAmbientesAdmin();
    mapa1.flyTo([-17.990715536186649, -67.136975413665837], 17);
}
function MostrarCarreras() {
    //console.log("hola");
    mapa_aulasBasicas.remove();
    mapa_bloquesAdmin.remove();
    mapa_carreras.remove();
    mapa_laboratorios.remove();
    mapa_rutas.remove();
    mapa_ambientes.remove();
    mapa_carreras.addTo(mapa1);

    
    document.getElementById('txtBuscar').value = "";
    sw = 0;
    FiltrarAmbientes();
    mapa_ambientes.remove();
    
    MostrarRutasCarreras();
    MostrarAmbientesCarreras();
    mapa1.flyTo([-17.990715536186649, -67.136975413665837], 17);
}
function MostrarLaboratorios() {
    //console.log("hola");
    mapa_aulasBasicas.remove();
    mapa_bloquesAdmin.remove();
    mapa_carreras.remove();
    mapa_laboratorios.remove();
    mapa_rutas.remove();
    mapa_ambientes.remove();
    mapa_laboratorios.addTo(mapa1);

    
    document.getElementById('txtBuscar').value = "";
    sw = 0;
    FiltrarAmbientes();
    mapa_ambientes.remove();
    
    MostrarRutasLaboratorios();
    MostrarAmbientesLaboratorios();
    mapa1.flyTo([-17.991979766988742, -67.136706781350171], 17);
}
function MostrarRutas() {
    //console.log("hola");
    mapa_aulasBasicas.remove();
    mapa_bloquesAdmin.remove();
    mapa_carreras.remove();
    mapa_laboratorios.remove();
    mapa_rutas.remove();
    mapa_ambientes.remove();

    /*
    //cargar rutas
    mapa_rutas = L.geoJSON(rutas, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE RUTA: ' +
                feature.properties.nombre_ruta;
            layer.bindPopup(popupContent);
        }
    }
    );//.addTo(mapa1);                    
    mapa_rutas.addTo(mapa1);
    */
    mapa_circuloFinVector.forEach(element => {
        element.remove();
    });
    mapa_circuloInicioVector.forEach(element => {
        element.remove();
    });

    MostrarNodosGeoJson();
    MostrarVerticesGeoJson();
    
    document.getElementById('txtBuscar').value = "";
    sw = 0;
    FiltrarAmbientes();
    mapa_ambientes.remove();
    mapa1.flyTo([-17.990715536186649, -67.136975413665837], 18);
}

function MostrarAmbientes() {
    //console.log("hola");
    if (sw === 0) {
        mapa_ambientes.addTo(mapa1);
        sw = 1;
    }
    else {
        mapa_ambientes.remove();
        sw = 0;
    }
}

function boton8() {
    //console.log("hola");
    plaza_pagador.remove();
    mapa_municipios.remove();
    mapa_lagos.remove();
    mapa_aeropuetos.remove();
    //mapa_fni.addTo(mapa1);
    mapa1.flyTo([-158.623412538417938, -85.472960840178814], 15);
}

function FiltrarAmbientes() {
    var e = document.getElementById('txtBuscar');

    mapa_ambientes.remove();

    mapa_ambientes = L.geoJSON(ambientes, {
        //style: styleMunicipio,
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE AMBIENTE: ' +
                feature.properties.nombre_ambiente +
                '</b> <br> TIPO AMBIENTE: ' +
                feature.properties.tipo_ambiente +
                '</b> <br> PISO: ' +
                feature.properties.piso +
                '</b> <br> CARRERA: ' +
                feature.properties.carrera;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.nombre_ambiente.toLowerCase().includes(e.value.toLowerCase())) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);
}


function MostrarRutasBasicas() {

    MostrarNodosGeoJson();
    MostrarVerticesGeoJson();

    mapa_circuloFinVector.forEach(element => {
        element.remove();
    });
    mapa_circuloInicioVector.forEach(element => {
        element.remove();
    });

    ResolverYPintarRutaCortaGeoJson(64, 13);
    ResolverYPintarRutaCortaGeoJson(64, 23);
    ResolverYPintarRutaCortaGeoJson(64, 69);
    ResolverYPintarRutaCortaGeoJson(64, 56);
    ResolverYPintarRutaCortaGeoJson(64, 102);
    ResolverYPintarRutaCortaGeoJson(64, 93);
    ResolverYPintarRutaCortaGeoJson(64, 156);
    /*
    mapa_rutas = L.geoJSON(rutas, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE RUTA: ' +
                feature.properties.nombre_ruta;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.nombre_ruta.includes("basicas") ||
                feature.properties.nombre_ruta.includes("aula 64") ||
                feature.properties.nombre_ruta.includes("aula 85") ||
                feature.properties.nombre_ruta.includes("aula 204")) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);    
    */                
}

function MostrarRutasLaboratorios() {

    MostrarNodosGeoJson();
    MostrarVerticesGeoJson();

    mapa_circuloFinVector.forEach(element => {
        element.remove();
    });
    mapa_circuloInicioVector.forEach(element => {
        element.remove();
    });
    
    ResolverYPintarRutaCortaGeoJson(64, 13);
    ResolverYPintarRutaCortaGeoJson(64, 29);
    ResolverYPintarRutaCortaGeoJson(64, 38);
    ResolverYPintarRutaCortaGeoJson(64, 50);
    ResolverYPintarRutaCortaGeoJson(64, 93);
    ResolverYPintarRutaCortaGeoJson(64, 74);
    ResolverYPintarRutaCortaGeoJson(64, 127);
    ResolverYPintarRutaCortaGeoJson(64, 102);
    ResolverYPintarRutaCortaGeoJson(64, 167);
    ResolverYPintarRutaCortaGeoJson(64, 156);
    ResolverYPintarRutaCortaGeoJson(64, 182);
    ResolverYPintarRutaCortaGeoJson(64, 175);    
    ResolverYPintarRutaCortaGeoJson(64, 184);    
    ResolverYPintarRutaCortaGeoJson(64, 191);    
    ResolverYPintarRutaCortaGeoJson(64, 202);    

    /*
    mapa_rutas = L.geoJSON(rutas, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE RUTA: ' +
                feature.properties.nombre_ruta;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.nombre_ruta.includes("laboratorios")) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);
    */
}

function MostrarRutasCarreras() {

    MostrarNodosGeoJson();
    MostrarVerticesGeoJson();

    mapa_circuloFinVector.forEach(element => {
        element.remove();
    });
    mapa_circuloInicioVector.forEach(element => {
        element.remove();
    });
    
    ResolverYPintarRutaCortaGeoJson(64, 2);
    ResolverYPintarRutaCortaGeoJson(64, 29);
    ResolverYPintarRutaCortaGeoJson(64, 79);
    ResolverYPintarRutaCortaGeoJson(64, 47);
    ResolverYPintarRutaCortaGeoJson(64, 124);
    ResolverYPintarRutaCortaGeoJson(64, 130);
    ResolverYPintarRutaCortaGeoJson(64, 167);
    ResolverYPintarRutaCortaGeoJson(64, 202);
    ResolverYPintarRutaCortaGeoJson(64, 187);

    /*
    mapa_rutas = L.geoJSON(rutas, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE RUTA: ' +
                feature.properties.nombre_ruta;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.nombre_ruta.includes("ing")) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);
    */
}

function MostrarRutasAdmin() {

    MostrarNodosGeoJson();
    MostrarVerticesGeoJson();

    mapa_circuloFinVector.forEach(element => {
        element.remove();
    });
    mapa_circuloInicioVector.forEach(element => {
        element.remove();
    });
    
    ResolverYPintarRutaCortaGeoJson(64, 66);
    ResolverYPintarRutaCortaGeoJson(64, 79);
    ResolverYPintarRutaCortaGeoJson(64, 47);
    ResolverYPintarRutaCortaGeoJson(64, 112);
    ResolverYPintarRutaCortaGeoJson(64, 182);
    ResolverYPintarRutaCortaGeoJson(64, 13);
    ResolverYPintarRutaCortaGeoJson(64, 29);
    ResolverYPintarRutaCortaGeoJson(64, 167);
    ResolverYPintarRutaCortaGeoJson(64, 124);
    /*
    mapa_rutas = L.geoJSON(rutas, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE RUTA: ' +
                feature.properties.nombre_ruta;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.nombre_ruta.includes("ruta ing mecanica electromecanica") ||
                feature.properties.nombre_ruta.includes("ruta ing de sistemas") ||
                feature.properties.nombre_ruta.includes("ruta ing geologica") ||
                feature.properties.nombre_ruta.includes("ruta ing civil") ||
                feature.properties.nombre_ruta.includes("ruta administracion basicas") ||
                feature.properties.nombre_ruta.includes("ruta decanato")) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);
    */
}




function MostrarAmbientesBasicas() {
    mapa_ambientes = L.geoJSON(ambientes, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE AMBIENTE: ' +
                feature.properties.nombre_ambiente +
                '</b> <br> TIPO AMBIENTE: ' +
                feature.properties.tipo_ambiente +
                '</b> <br> PISO: ' +
                feature.properties.piso +
                '</b> <br> CARRERA: ' +
                feature.properties.carrera;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.carrera.includes("BASICAS") ||
                feature.properties.nombre_ambiente.includes("aula 85")) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);
}

function MostrarAmbientesLaboratorios() {
    mapa_ambientes = L.geoJSON(ambientes, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE AMBIENTE: ' +
                feature.properties.nombre_ambiente +
                '</b> <br> TIPO AMBIENTE: ' +
                feature.properties.tipo_ambiente +
                '</b> <br> PISO: ' +
                feature.properties.piso +
                '</b> <br> CARRERA: ' +
                feature.properties.carrera;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.nombre_ambiente.includes("lab") ||
                feature.properties.nombre_ambiente.includes("laboratorio")) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);
}

function MostrarAmbientesCarreras() {
    mapa_ambientes = L.geoJSON(ambientes, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE AMBIENTE: ' +
                feature.properties.nombre_ambiente +
                '</b> <br> TIPO AMBIENTE: ' +
                feature.properties.tipo_ambiente +
                '</b> <br> PISO: ' +
                feature.properties.piso +
                '</b> <br> CARRERA: ' +
                feature.properties.carrera;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.carrera.includes("INGEN")) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);
}

function MostrarAmbientesAdmin() {
    mapa_ambientes = L.geoJSON(ambientes, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<b>NOMBRE AMBIENTE: ' +
                feature.properties.nombre_ambiente +
                '</b> <br> TIPO AMBIENTE: ' +
                feature.properties.tipo_ambiente +
                '</b> <br> PISO: ' +
                feature.properties.piso +
                '</b> <br> CARRERA: ' +
                feature.properties.carrera;
            layer.bindPopup(popupContent);
        },
        filter: function filtro(feature) {
            if (feature.properties.tipo_ambiente.includes("oficina_doc") ||
                feature.properties.tipo_ambiente.includes("area_admin")) {
                return true;
            }
        }
    }).addTo(mapa1);
    //console.log(e);
}
