<?php header('Content-Type: text/html;charset=utf-8');?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/1999/xhtml/">

<html xmlns="http://www.w3.org/1999/xhtml" lang="es" xml:lang="es">

<head>
<?php
	include ("inc/config.php");
?>

<title>BCN Temperature Sensors</title>
<?php include ("inc/head.php"); ?>

<script language="javascript" type="text/javascript">


        var directionDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;

        var haight = new google.maps.LatLng(40.41116, -3.707113);

        var overlayDispositivo = new Array();
        var overlayDispositivoInfo = new Array();

        var geocoder;


        function Iniciar() {

            var mapOptions = {
                zoom: 14,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            map = new google.maps.Map(document.getElementById('map'), mapOptions);

            //Barcelona
            var pos = new google.maps.LatLng(41.414932, 2.146791);
            map.setCenter(pos);

            map.setZoom(13);

            DibujaDatos();
        }

        google.maps.event.addDomListener(window, 'load', Iniciar);

    </script>
</head>
<body>

<?php include ("controles/cabecera.inc"); ?>
<div id="contenido">

    <div id="contentmap">
        <div id="map" style="width: 100%; height: 100%;"></div>
        <div id="legend0">
        </div>
    </div>

</div>
<div class="clear"></div>
<?php include ("controles/pie.inc");?>
</body>
</html>