
function obtenerDatos(pstrview,pintId, pobjDispositivo){

	var xmlhttp;

	if (window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open('GET', 'data/GetData.php?view=' + pstrview + '&id=' + pintId, true);

	xmlhttp.responseType="text";

	xmlhttp.onreadystatechange = function() {


	if (xmlhttp.readyState==4 && xmlhttp.status==200)
        	{
			var arr= $.parseJSON(xmlhttp.responseText);

			if (pstrview=='devices'){
				DibujaDispositivos(arr);
			} else if (pstrview=='temperature'){
                 		 var PosGPS = new google.maps.LatLng(pobjDispositivo['latitude'], pobjDispositivo['longitude']);
                                 overlayDispositivoInfo[pintId] = new CustomMarkerDispositivoInfo(PosGPS, map, pintId, pobjDispositivo,arr[0]);
                         	 google.maps.event.addListener(overlayDispositivoInfo[pintId], 'click', (function (pintId, PosGPS, pobjDispositivo) { return function () { removeShowOverlayDispositivoInfo(pintId, PosGPS, pobjDispositivo); } })(pintId, PosGPS, pobjDispositivo));
			}			
        	}
        	else if(xmlhttp.readyState < 4)
        	{
        	}else{
			alert("Se ha producido un error cargando los datos.");
		}
	}
	xmlhttp.send();
}


function CustomMarkerDispositivo(latlng, map, id, objDispositivo) {
    this.latlng_ = latlng;
    this.id = id;
    this.Dispositivo = objDispositivo;
    this.setMap(map);
}

CustomMarkerDispositivo.prototype = new google.maps.OverlayView();

CustomMarkerDispositivo.prototype.draw = function () {

    var me = this;
    var div = this.div_;

    if (!div) {

        div = this.div_ = document.createElement('DIV');

        div.style.border = "none";
        div.style.position = "absolute";
        div.style.paddingLeft = "0px";
        div.style.cursor = 'pointer';
        div.style.zIndex = '1';

        var strHTML = "<div style='width:10px; height:25px; overflow:auto;'>";
        strHTML = strHTML + "<div style='width:12px;height:20px; margin:0;padding:0px;'>";
	strHTML = strHTML + "<img alt='";
        //strHTML = strHTML + this.Dispositivo['deviceID'] + " -  " + this.Dispositivo['name'];
        strHTML = strHTML + "' style=' width: 10px;height: 24px;' src='images/Termometro.png' />";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";
        
        google.maps.event.addDomListener(div, "click", function (event) {
            google.maps.event.trigger(me, "click");
        });

        div.innerHTML = strHTML;

        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    }

    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);


    if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
    }
};

CustomMarkerDispositivo.prototype.remove = function () {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

CustomMarkerDispositivo.prototype.getPosition = function () {
    return this.latlng_;
};


function CustomMarkerDispositivoInfo(latlng, map, id, objDispositivo, objMedida) {
    
	if (!objMedida){
		var objMedida= obtenerDatos('temperature', objDispositivo['deviceID'], objDispositivo);
	}else{
    		this.latlng_ = latlng;
    		this.id = id;
    		this.Dispositivo = objDispositivo;
    		this.Medida=objMedida;
    		this.setMap(map);
	}
}

CustomMarkerDispositivoInfo.prototype = new google.maps.OverlayView();

CustomMarkerDispositivoInfo.prototype.draw = function() {

    var me = this;

    // Check if the div has been created.

    var div = this.div_;
    if (!div) {
        div = this.div_ = document.createElement('DIV');
        div.style.border = "none";
        div.style.position = "absolute";
        div.style.paddingLeft = "0px";
        div.style.cursor = 'pointer';
        div.style.zIndex = '2';

        var strHTML = '';
        strHTML = strHTML + "<div style='width:370px;padding:0;margin:0; font-weight:bold; font-size:7pt;overflow:visible;'>";

        strHTML = strHTML + "<div style='width:40px; height:110px; float:left;padding: 5px 0 0 0;margin:0;'>";
        strHTML = strHTML + "<img src='images/Flechita.png' width='40' height='110'/>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "<div style='width:320px;float:left;padding:0;margin:0;overflow:auto;'>";
        strHTML = strHTML + "<div style='width:280px;height:110px; padding:4px;margin:0; background-color:#000; border-radius:10px;overflow:auto;'>";
        strHTML = strHTML + "<div style='width:270px;height:100px; padding:5px;margin:0; background-color:#FFF; border-radius:10px;overflow:auto;'>";



        strHTML = strHTML + "<div style='width:260px;font-weight: bold; font-size:10pt;'>";
        strHTML = strHTML + this.Dispositivo['name'];
        strHTML = strHTML + "</div>";

        strHTML = strHTML + "<div style='padding:5px 0 1px 0;'>";
        strHTML = strHTML + "<div style='width:250px;clear:left;float:left;color:#FFF;font-size:16pt; font-weight: bold;'>";
        strHTML = strHTML + "<div style='padding:5px; text-align:left;font-size:8pt;color:#000; float:left;'>";
        strHTML = strHTML + "<b>Temperatura: </b>";
        strHTML = strHTML + "<span style=' font-weight:normal;'>"+ this.Medida['value'] + " º" + this.Medida['units'] + "</span>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "<div style='padding:5px; text-align:left;font-size:8pt;color:#000; float:left;'>";
        strHTML = strHTML + "<b>Fecha de la medida: </b>";
        strHTML = strHTML + "<span style=' font-weight:normal;'>"+ this.Medida['time']  + "</span>";
        strHTML = strHTML + "</div>";

        strHTML = strHTML + "<div style='padding:5px; text-align:left;font-size:8pt;color:#000; float:left;'>";
        strHTML = strHTML + "</div>";
        //strHTML = strHTML + "<div style='width:260px;height: 47px;background-color:#FFF; padding:15px 0 0 0; overflow:auto; text-align:center;'>";
        //strHTML = strHTML + "<img style='width: 155px;height: 37px;' src='images/LogoAbertis.png' />";
        //strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";

        google.maps.event.addDomListener(div, "click", function (event) {
            google.maps.event.trigger(me, "click");
        });



        div.innerHTML = strHTML;
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    }

    // Position the overlay 
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {

        div.style.left = point.x + 10 + 'px';
        div.style.top = point.y - 13 + 'px';
    }

};

CustomMarkerDispositivoInfo.prototype.remove = function () {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

CustomMarkerDispositivoInfo.prototype.getPosition = function () {
    return this.latlng_;
};


function DibujaDatos() {
             DibujaDispositivos();
}


function DeleteDispositivos() {
         if (overlayDispositivo) {
             for (i in overlayDispositivo) {
                 overlayDispositivo[i].setMap(null);
             }
             overlayDispositivo.length = 0;
         }
}

function DibujaDispositivos(arrDispositivos) {

	if (!arrDispositivos){
		var arrDispositivos= obtenerDatos('devices', 10);
	}else{

             for (var i = 0; i < arrDispositivos.length; i++) {

                 var objDispositivo = arrDispositivos[i]
                 var PosGPS = new google.maps.LatLng(objDispositivo['latitude'], objDispositivo['longitude']);
                 var id = objDispositivo['deviceID'];



                 if (typeof overlayDispositivo[id] != 'undefined') {
                     if (overlayDispositivo[id].map == null) {
                         overlayDispositivo[id].setMap(map);
                     } else {
                         overlayDispositivo[id].setMap(null);
                         overlayDispositivo[id].setMap(map);
                     }
                 } else {
                     overlayDispositivo[id] = new CustomMarkerDispositivo(PosGPS, map, id, objDispositivo);
                     google.maps.event.addListener(overlayDispositivo[id], 'click', (function (id, PosGPS, objDispositivo) { return function () { removeShowOverlayDispositivoInfo(id, PosGPS, objDispositivo); } })(id, PosGPS, objDispositivo));
                 }


                 if (typeof overlayDispositivoInfo[id] != 'undefined') {
                     if (overlayDispositivoInfo[id].map == null) {
                         //overlayDispositivoInfo[id] = new CustomMarkerDispositivoInfo(PosGPS, map, id, objDispositivo);
                         //overlayDispositivoInfo[id].setMap(null);
                     } else {
                         //overlayDispositivoInfo[id].setMap(null);
                         //overlayDispositivoInfo[id] = new CustomMarkerDispositivoInfo(PosGPS, map, id, objDispositivo);
                         //google.maps.event.addListener(overlayDispositivoInfo[id], 'click', (function (id, PosGPS, objDispositivo) { return function () { removeShowOverlayDispositivoInfo(id, PosGPS, objDispositivo); } })(id, PosGPS, objDispositivo));

                     }
                 }



             }

	}
}


  
     function removeOverlayDispositivo() {
         overlayDispositivo.setMap(null);
     }

  
     function removeShowOverlayDispositivoInfo(id, PosGPS, objDispositivo) {
//Para evitar que al mostrar una leyenda se oculten las demás
//comentar desde aquí
         if (overlayDispositivoInfo) {
             for (i in overlayDispositivoInfo) {
                 if (i != id) {
                     if (overlayDispositivoInfo[i]) {
                         overlayDispositivoInfo[i].setMap(null);
                     }
                 }
             }
         }
//hasta aquí

         if (typeof overlayDispositivoInfo[id] != 'undefined') {
             if (overlayDispositivoInfo[id].map == null) {
                 //overlayDispositivoInfo[id].setMap(map);
		 //Volvemos a crear el objeto, para obtener la medida actualizada.
		 var PosGPS = new google.maps.LatLng(objDispositivo['latitude'], objDispositivo['longitude']);
                 overlayDispositivoInfo[id] = new CustomMarkerDispositivoInfo(PosGPS, map, id, objDispositivo);
                 google.maps.event.addListener(overlayDispositivoInfo[id], 'click', (function (id, PosGPS, objDispositivo) { return function () { removeShowOverlayDispositivoInfo(id, PosGPS, objDispositivo); } })(id, PosGPS, objDispositivo));
             } else {
                 overlayDispositivoInfo[id].setMap(null);
             }
         } else {
             overlayDispositivoInfo[id] = new CustomMarkerDispositivoInfo(PosGPS, map, id, objDispositivo);
             google.maps.event.addListener(overlayDispositivoInfo[id], 'click', (function (id, PosGPS, objDispositivo) { return function () { removeShowOverlayDispositivoInfo(id, PosGPS, objDispositivo); } })(id, PosGPS, objDispositivo));
         }
     }











