define(['app'], function(app)
{
app.controller('navegadorConfigFacturaController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {    
    //try {    
    $scope.tablaDetalle = {};
    $scope.tablaDetalleFactura = {};//tabla detalle plantilla
    $scope.tablaDetalleSucursal = {};
    $scope.proveedoresList = {};
    
    $scope.tablaDetalleFacturaList = [];
    $scope.sucursalesList = [];
    $scope.monedasList = [];
    $scope.tiposPagoList = [];
    $scope.tiposDocumentoList = [];
    $scope.paisList = [];
    $scope.ciudadList = [];
    $scope.tiposMedioPagoList = [];
    
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    
    Data.get("/tablaDetalle/tablaDetalle").then(function (data) {
        $scope.tablaDetalle = data;
        $scope.tablaDetalleFactura = angular.copy($scope.tablaDetalle);
        console.log(data);
        $scope.tablaDetalleFactura.tabla.nombreTabla = "IMPRESION_FACTURAS";
        Data.post("/tablaDetalle/cargarTablaDetalle", $scope.tablaDetalleFactura).then(function (data) {
            $scope.tablaDetalleFacturaList = data;            
            console.log(data);
        });
        $scope.tablaDetalleSucursal = angular.copy($scope.tablaDetalle);
        $scope.tablaDetalleSucursal.tabla.nombreTabla = "SUCURSAL";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalleSucursal).then(function (data) {
            $scope.sucursalesList = data;            
            console.log(data);
        });
        $scope.tablaDetalleTituloFactura = angular.copy($scope.tablaDetalle);
        $scope.tablaDetalleTituloFactura.tabla.nombreTabla = "TITULO_FACTURA";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalleTituloFactura).then(function (data) {
            $scope.tituloFacturaList = data;
            $scope.tituloFacturaList.splice(0,0,item);
            console.log(data);
        });
        $scope.tablaDetalleSubtituloFactura = angular.copy($scope.tablaDetalle);
        $scope.tablaDetalleSubtituloFactura.tabla.nombreTabla = "SUBTITULO_FACTURA";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalleSubtituloFactura).then(function (data) {
            $scope.subtituloFacturaList = data;            
            $scope.subtituloFacturaList.splice(0,0,item);
            console.log(data);
        });
        
        $scope.tablaDetalleDosificacion = angular.copy($scope.tablaDetalle);
        $scope.tablaDetalleDosificacion.tabla.nombreTabla = "DOSIFICACION_FACTURAS";
        Data.post("/tablaDetalle/cargarTablaDetalle", $scope.tablaDetalleDosificacion).then(function (data) {
            $scope.tablaDetalleDosificacionList = data;
            var i=0;
            for(i=0;i<$scope.tablaDetalleDosificacionList.length;i++){//quitando la hora a las fechas registradas
                $scope.tablaDetalleDosificacionList[i].valorDateCampo=$scope.tablaDetalleDosificacionList[i].valorDateCampo.length>0?
                                                                        $scope.tablaDetalleDosificacionList[i].valorDateCampo.substring(0,10):"";
            }
            $('#fecha_vigente_desde .input-group.date').datepicker({
                language: "es",
                format: "dd/mm/yyyy",
                autoclose: true,
                todayHighlight:true
            }).datepicker("setDate",creaDate($scope.tablaDetalleDosificacionList[2].valorDateCampo)).on('changeDate', function(e) {
                //console.log(e);//e here contains the extra attributes
                //console.log("entro evento..." + e);
                $scope.tablaDetalleDosificacionList[2].valorDateCampo = formatoFecha(e.date);
            });
            $('#fecha_limite_emision .input-group.date').datepicker({
                language: "es",
                format: "dd/mm/yyyy",
                autoclose: true,
                todayHighlight:true
            }).datepicker("setDate",creaDate($scope.tablaDetalleDosificacionList[3].valorDateCampo)).on('changeDate', function(e) {
                //console.log(e);//e here contains the extra attributes
                //console.log("entro evento..." + e);
                $scope.tablaDetalleDosificacionList[3].valorDateCampo = formatoFecha(e.date);
            });
            console.log(data);
        });
    });
    
    Data.get("/ciudad/cargarCiudadItem").then(function (data) {
            $scope.ciudadesList = data;            
            console.log(data);
    });
    $scope.guardarFactura_action = function(){        
        Data.post('/tablaDetalle/editarTablaDetalle', $scope.tablaDetalleFacturaList).then(function (data) {
            
                if(parseInt(data)===1){
                    $.growl.notice({title:"Mensaje!", message: " Datos de Factura guardada correctamente " });
                }else{
                    $.growl.warning({title:"Mensaje!", message: " Ocurrio un error al guardar la informacion " });
                }
                
            
        });
    };
    $scope.guardarDosificacion_action = function(){        
        
            Data.post('/tablaDetalle/editarTablaDetalle', $scope.tablaDetalleDosificacionList).then(function (data1) {
                if(parseInt(data1)===1){
                    $.growl.notice({title:"Mensaje!", message: " Dosificacion guardada correctamente " });
                }else{
                    $.growl.warning({title:"Mensaje!", message: " Ocurrio un error al guardar la informacion " });
                }
                
            });
        
    };
	
    
    }
    ]);
});