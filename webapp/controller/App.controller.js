var arrFlowmeterInfo, arrParentFlowmeterInfo;
var map;

function initMap(oEvent) {

    console.log('onInitMap googlemapsapi Event');
    var controller = window.myController;
    controller.generateMap(controller);
}

sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.aqua.h2oflowmetermap.controller.App", {
            onInit: function () {

                console.log('onInit mapViewController Event');
                window.myController = this;
                map = null;

                var sServiceUrl = "/v2/aquaservice/";
                // var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
                var oModel = this.getOwnerComponent().getModel();
                var oJson;

                try {
                    oModel.read("/H2OFlowmeterData",
                        {
                            success: function (oData) {
                                oJson = oData;
                                console.log('Flowmeter Data retrieved successfully');

                                arrFlowmeterInfo = oJson.results;
                                arrParentFlowmeterInfo = arrFlowmeterInfo;

                                console.log('onAfterRendering Event');
                                jQuery.sap.includeScript("https://maps.googleapis.com/maps/api/js?key=&callback=initMap");
                            },
                            error: function (err) {
                                icon = icon || 'ERROR';
                                jQuery.sap.require('sap.m.MessageBox');
                                sap.m.MessageBox.show(err, {
                                    icon: icon,
                                    title: 'Error!!'
                                });
                            }
                        }
                    );
                } catch (ex) {
                    alert(ex);
                }

                // try {
                //     oModel.read("/H2OFlowmeterData",
                //         undefined,
                //         undefined,
                //         false,
                //         function _OnSuccess(oData, response) {
                //             oJson = oData;
                //             console.log('Flowmeter Data retrieved successfully');

                //             arrFlowmeterInfo = oJson.results;
                //             arrParentFlowmeterInfo = arrFlowmeterInfo;

                //             console.log('onAfterRendering Event');
                //             jQuery.sap.includeScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDNkXzlDoUeZNnDsPHrZa97qCa2ewfr2pU&callback=initMap");
                //         },
                //         function _OnError(event) {
                //             var errorMsg;
                //             if (event && event.getParameter) {
                //                 var responseText = event.getParameter('response').responseText;
                //                 var jsonModel = new sap.ui.model.json.JSONModel();
                //                 jsonModel.setJSON(responseText);
                //                 errorMsg = jsonModel.getProperty('/error/message/value');
                //             } else {
                //                 errorMsg = 'Error in retrieving data';
                //             }

                //             icon = icon || 'ERROR';
                //             jQuery.sap.require('sap.m.MessageBox');
                //             sap.m.MessageBox.show(errorMsg, {
                //                 icon: icon,
                //                 title: 'Error!!'
                //             });

                //         }
                //     );
                // } catch (ex) {
                //     alert(ex);
                // }

                // arrFlowmeterInfo = oJson.results;
                // arrParentFlowmeterInfo = arrFlowmeterInfo;

            },

            onAfterRendering: function () {
                // console.log('onAfterRendering Event');
                // jQuery.sap.includeScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDNkXzlDoUeZNnDsPHrZa97qCa2ewfr2pU&callback=initMap");
                
            },

            // End of onAfterRendering
            onExit: function () {
                console.log('onExit Event');
                map = null;
            },

            generateMap: function (oController) {

                console.log('Generate Map Event');
                var oController = this;

                var geocoder = new google.maps.Geocoder();
                var infowindow = new google.maps.InfoWindow();
                var mapOptions = {
                    center: new google.maps.LatLng(12.920734, 77.665049),
                    zoom: 15,
                    mapTypeId: 'terrain'
                };
                map = new google.maps.Map(oController.getView().byId("map_canvas").getDomRef(), mapOptions);
                oController.getView().byId("map_canvas").addStyleClass("myMap");

                console.log('Map created!!');

                var marker, i;
                /*
                        marker = new google.maps.Marker({
                                position: new google.maps.LatLng(12.920734, 77.665049),
                                animation: google.maps.Animation.DROP,
                                label:'F',
                                title:'Test',
                                map: map
                            });
                        	
                        marker = new google.maps.Marker({
                                position: new google.maps.LatLng(12.922982, 77.669491),
                                animation: google.maps.Animation.DROP,
                                label:'F',
                                title:'Test2',
                                map: map
                            });		
                            */
                /*	i = 0;
                            marker = new google.maps.Marker({
                                position: new google.maps.LatLng(arrFlowmeterInfo[i].FmLatitude,arrFlowmeterInfo[i].FmLatitude),
                                animation: google.maps.Animation.DROP,
                                label:'F',
                                title:arrFlowmeterInfo[i].FmID,
                                map: map
                            }); */

                for (i = 0; i < arrFlowmeterInfo.length; i++) {

                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(arrFlowmeterInfo[i].FmLatitude, arrFlowmeterInfo[i].FmLongitude),
                        animation: google.maps.Animation.DROP,
                        label: 'F',
                        map: map
                    });

                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            //var details = arrFlowmeterInfo[i].FmID;
                            var sNRW = arrFlowmeterInfo[i].Leakge + " " + 'kL';
                            var sRevenueLoss = arrFlowmeterInfo[i].Currency + " " + arrFlowmeterInfo[i].RevenueLoss;
                            var sLeakageTag = (arrFlowmeterInfo[i].Leakage === "0") ? "visibility:hidden;" : "";
                            var sLeakage = arrFlowmeterInfo[i].Leakage + " " + 'kL';
                            var sSupply = arrFlowmeterInfo[i].Supply + " " + 'kL';
                            var sConsumption = arrFlowmeterInfo[i].Consumption + " " + 'kL';

                            var details = '<table style="width: 250px;">' +
                                '<tbody>' +
                                '<tr>' +
                                '<td style="width: 222px; text-align: right;">Flowmeter ID :</td>' +
                                '<td style="width: 149px; padding-left: 10px;"><strong>' + arrFlowmeterInfo[i].FmID + '</strong></td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="width: 222px; text-align: right;">Supply :</td>' +
                                '<td style="width: 149px; padding-left: 10px;"><span style="color: #808080;">' + sSupply + '</span></td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td style="width: 222px; text-align: right;">Consumption :</td>' +
                                '<td style="width: 149px; padding-left: 10px;"><span style="color: #808080;">' + sConsumption + '</span></td>' +
                                '</tr>';

                            if (arrFlowmeterInfo[i].Leakage !== "0") {

                                details = details +
                                    // [Leakage Data]
                                    '<tr style=' + sLeakageTag + '>' +
                                    '<td style="width: 222px; text-align: right;">&nbsp;</td>' +
                                    '<td style="width: 149px;">&nbsp;</td>' +
                                    '</tr>' +
                                    '<tr style=' + sLeakageTag + '>' +
                                    '<td style="width: 222px; text-align: right;">Leakage :</td>' +
                                    '<td style="width: 149px; padding-left: 10px;"><strong><span style="color: #ff0000;">' + sLeakage +
                                    '</span></strong></td>' + //Should only visible when there is a leakage 
                                    '</tr>' +
                                    '<tr style=' + sLeakageTag + '>' +
                                    '<td style="width: 222px; text-align: right;">Revenue Loss :</td>' +
                                    '<td style="width: 149px; padding-left: 10px;"><strong><span style="color: #ff0000;">' + sRevenueLoss +
                                    '</span></strong></td>' + //Should only visible when there is a leakage 
                                    '</tr>';
                            };
                            // '<tr>' +
                            // '<td style="width: 222px; text-align: right;">Analysis Order :</td>' +
                            // '<td style="width: 149px; padding-left: 10px;"><span style="color: #808080;">10004781</span></td>' +
                            // '</tr>' +
                            // 			'<tr>' +
                            // 			'<td style="width: 222px; text-align: right;">&nbsp;</td>' +
                            // 			'<td style="width: 149px;">&nbsp;</td>' +
                            // 			'</tr>' +
                            // 			'<tr>' +
                            // 			'<td style="width: 222px; text-align: right;">Pressure :</td>' +
                            // 			'<td style="width: 149px; padding-left: 10px;"><span style="color: #808080;">NA</span></td>' +
                            // 			'</tr>' +
                            // 			'<tr>' +
                            // 			'<td style="width: 222px; text-align: right;">Water Quality :</td>' +
                            // 			'<td style="width: 149px; padding-left: 10px;"><span style="color: #808080;">NA</span></td>' +
                            // 			'</tr>' +
                            details = details +
                                '</tbody>' +
                                '</table>';

                            infowindow.setContent(details);
                            infowindow.open(map, marker);
                        };
                    })(marker, i));

                    var sColorCode, iStrokeOpacity, oIconOptions;
                    // Define a symbol using SVG path notation, with an opacity of 1.
                    const lineSymbol = {
                        path: google.maps.SymbolPath.CIRCLE,
                        strokeOpacity: 1,
                        scale: 3,
                    };
                    /*				if ((arrFlowmeterInfo[i].Leakage === "0")) {
                                        sColorCode = '#f4b042';
                                        iStrokeOpacity = 1.0;
                                        oIconOptions = [{}];
                                    } else {
                                        sColorCode = "red";
                                        iStrokeOpacity = 0;
                                        oIconOptions = [{
                                            icon: lineSymbol,
                                            offset: "0",
                                            repeat: "20px",
                                        }];
                                    }*/

                    for (var j = 0; j < arrParentFlowmeterInfo.length; j++) {
                        if (arrFlowmeterInfo[i].SourceFmID === arrParentFlowmeterInfo[j].FmID) {
                            if (arrParentFlowmeterInfo[j].Leakage === "0") {
                                sColorCode = '#f4b042';
                                iStrokeOpacity = 1.0;
                                oIconOptions = [{}];
                            } else {
                                sColorCode = "red";
                                iStrokeOpacity = 0;
                                oIconOptions = [{
                                    icon: lineSymbol,
                                    offset: "0",
                                    repeat: "20px",
                                }];

                            }
                        }
                    }

                    //circle
                    var cityCircle = new google.maps.Circle({
                        strokeColor: '#006400',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#006400',
                        fillOpacity: 0.35,
                        map: map,
                        center: new google.maps.LatLng(arrFlowmeterInfo[i].FmLatitude, arrFlowmeterInfo[i].FmLongitude),
                        radius: Math.sqrt(100) * 2
                    });

                    if (arrFlowmeterInfo[i].SourceFmID) {
                        //PipeLine
                        var pipelineCoordinates = [
                            new google.maps.LatLng(arrFlowmeterInfo[i].FmLatitude, arrFlowmeterInfo[i].FmLongitude),
                            new google.maps.LatLng(arrFlowmeterInfo[i].SourceFmLatitude, arrFlowmeterInfo[i].SourceFmLongitude)
                        ];
                        var poly = new google.maps.Polyline({
                            path: pipelineCoordinates,
                            geodesic: false,
                            strokeColor: sColorCode,
                            strokeOpacity: iStrokeOpacity,
                            map: map,
                            strokeWeight: 5,
                            icons: oIconOptions
                        });
                        poly.setMap(map);
                    }

                }

            }


        });
    });
