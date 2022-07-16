define(['app'], function(app)
{
app.controller('navegadorFacturasEmitidasController',
    ['$scope','Data','$location','$window',
    function ($scope, Data, $location,$window) {
    //try {    
    $scope.facturasEmitidasBuscar = {};//facturasEmitidasBuscar
    $scope.facturasEmitidas = {};//facturasEmitidasBuscar
    $scope.facturasEmitidasObj = {};//facturasEmitidasBuscar
    $scope.facturasEmitidasList = [];
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    
    //console.log(sessionStorage.getItem("facturasEmitidasBuscar"));
    
    $scope.cargarPagina=function(){
        if(sessionStorage.getItem("facturasEmitidasBuscar")!==null){
            $scope.facturasEmitidasBuscar =JSON.parse(sessionStorage.getItem("facturasEmitidasBuscar"));
            Data.post("/facturasEmitidas/cargarFacturasEmitidas",$scope.facturasEmitidasBuscar).then(function(data){
                    $scope.facturasEmitidasList = data;
                    console.log(data);
                    sessionStorage.setItem("facturasEmitidasBuscar",  JSON.stringify($scope.facturasEmitidasBuscar));
                 });
         }else{
            //busca el objeto facturasEmitidas luego carga la lista de facturasEmitidas
            Data.get('/facturasEmitidas/facturasEmitidas').then(function(data){
                 $scope.facturasEmitidasBuscar = data;
                 $scope.facturasEmitidasObj = angular.copy(data);
                 $scope.facturasEmitidasBuscar.filaInicial = 0;//de este floor a 10

                 console.log($scope.facturasEmitidasBuscar);         
                 Data.post("/facturasEmitidas/cargarFacturasEmitidas",$scope.facturasEmitidasBuscar).then(function(data){
                    $scope.facturasEmitidasList = data;
                    console.log(data);
                    sessionStorage.setItem("facturasEmitidasBuscar",  JSON.stringify($scope.facturasEmitidasBuscar));
                 });
            });
         }
    };
    $scope.cargarPagina();
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.facturasEmitidasBuscar);
        $scope.facturasEmitidasBuscar.filaInicial = parseInt($scope.facturasEmitidasBuscar.filaInicial) + 10;
        sessionStorage.setItem("facturasEmitidasBuscar",  JSON.stringify($scope.facturasEmitidasBuscar));
        Data.post("/facturasEmitidas/cargarFacturasEmitidas", $scope.facturasEmitidasBuscar).then(function(data){
            $scope.facturasEmitidasList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.facturasEmitidasBuscar.filaInicial = parseInt($scope.facturasEmitidasBuscar.filaInicial) - 10;
        sessionStorage.setItem("facturasEmitidasBuscar",  JSON.stringify($scope.facturasEmitidasBuscar));
        Data.post("/facturasEmitidas/cargarFacturasEmitidas", $scope.facturasEmitidasBuscar).then(function(data){
            $scope.facturasEmitidasList = data;
            console.log(data);
         });
    };
    $scope.agregarFacturasEmitidas_action = function(){
        $location.path("agregarFactura");
    };
    $scope.cancelarAgregarFacturasEmitidas_action = function() {
        ocultarVentanaModal('#agregarFacturasEmitidasDialog');
        /*$('#agregarFacturasEmitidasDialog').modal('show');
        $('#agregarFacturasEmitidasDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.validarFacturasEmitidas = function(){
        
        
        
        if (  parseFloat($scope.facturasEmitidas.nroFacturaInicio)<=0 || isNaN(parseFloat($scope.facturasEmitidas.nroFacturaInicio))) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro inicial de factura" });
                return false;
        }
        if (  parseFloat($scope.facturasEmitidas.nroFacturaFinal)<=0 || isNaN(parseFloat($scope.facturasEmitidas.nroFacturaFinal))) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro final de factura" });
                return false;
        }
        
        if (  $scope.facturasEmitidas.nroAutorizacion.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro de autorizacion" });
                return false;
        }
        if (  $scope.facturasEmitidas.llaveDosificacion.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre la llave de dosificacion" });
                return false;
        }
        if (  $scope.facturasEmitidas.fechaLimiteEmision.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre la fecha limite emision" });
                return false;
        }        
        return true;
    };
    $scope.guardarFacturasEmitidas_action = function() {
        if($scope.validarFacturasEmitidas()===false){
            return null;
        }
        $scope.facturasEmitidas.estadosRegistro.codEstado = 1;
        Data.post('/facturasEmitidas/guardarFacturasEmitidas', $scope.facturasEmitidas).then(function(data){            
            $('#agregarFacturasEmitidasDialog').modal('hide');
            Data.post("/facturasEmitidas/cargarFacturasEmitidas", $scope.facturasEmitidasBuscar).then(function(data){
                $scope.facturasEmitidasList = data;
                console.log(data);
            });
        });
    };
    $scope.editarFactura_action = function(f){
        
        
        
        /*var i=0;
        for(i=0;i<$scope.facturasEmitidassList.length;i++){
            if($scope.facturasEmitidassList[i].checked===true){
                $scope.facturasEmitidas = angular.copy($scope.facturasEmitidassList[i]);                
                break;
            }
        }*/
        //buscar la salida de almacen
        if (  parseFloat(f.estadosRegistro.codEstado)===2) {
                $.growl.warning({title:"ADVERTENCIA!", message: "la factura se encuentra anulada" });
                return false;
        }
        
        f.salidasVenta.gestion = angular.copy($scope.usuarioPersonal.gestion);
        f.salidasVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);
        f.salidasVenta.fechaSalidaVentaInicio = "";
        f.salidasVenta.fechaSalidaVentaFinal = "";
        
        Data.post("/salidasVenta/buscarSalidasVenta", f.salidasVenta).then(function(salidaVenta){
            sessionStorage.setItem("salidasVentaEditar",  JSON.stringify(salidaVenta));
            sessionStorage.setItem("facturaEmitidaEditar",  JSON.stringify(f));
            console.log(salidaVenta);            
            $location.path("editarFactura");
            
         });
        
        
        
    };    
    
    
    $scope.guardarEditarFacturasEmitidas_action = function() {
        if($scope.validarFacturasEmitidas()===false){
            return null;
        }
        
        Data.post('/facturasEmitidas/editarFacturasEmitidas', $scope.facturasEmitidas).then(function(data){            
            $('#editarFacturasEmitidasDialog').modal('hide');
            Data.post("/facturasEmitidas/cargarFacturasEmitidas", $scope.facturasEmitidasBuscar).then(function(data){
                $scope.facturasEmitidasList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarFacturasEmitidas_action = function(pr){
        
        $scope.facturasEmitidas = angular.copy(pr);
        Data.post('/facturasEmitidas/eliminarFacturasEmitidas', $scope.facturasEmitidas).then(function (data) {
            Data.post("/facturasEmitidas/cargarFacturasEmitidas", $scope.facturasEmitidasBuscar).then(function (data) {
                $scope.facturasEmitidasList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarFacturasEmitidas_action = function(){
        
        $('#fechaLimiteEmisionBusc .input-group.date').datepicker({
            language: "es",
            format: "dd/mm/yyyy",
            autoclose: true,
            todayHighlight: true
            }).datepicker("setDate", creaDate(fechaActualDDMMYYYY())).on('changeDate', function (e) {
                $scope.facturasEmitidasBuscar.fechaLimiteEmision = formatoFecha(e.date);
            });
        mostrarVentanaModal("buscarFacturasEmitidasDialog");
    };
    $scope.buscarFacturasEmitidas_action = function(){
        Data.post("/facturasEmitidas/cargarFacturasEmitidas", $scope.facturasEmitidasBuscar).then(function (data) {
                $scope.facturasEmitidasList = data;
                console.log(data);
            });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarFacturasEmitidasDialog");
    };
    $scope.grupoFacturasEmitidas_change = function(g){
        $scope.subGrupoCopia = angular.copy($scope.facturasEmitidasObj.subGruposFacturasEmitidas);
        
        $scope.subGrupoCopia.ciudades.codGrupoFacturasEmitidas = $scope.facturasEmitidas.grupoFacturasEmitidas.codGrupoFacturasEmitidas;
        Data.post('/subGruposFacturasEmitidas/cargarSubGruposFacturasEmitidasItem', $scope.subGrupoCopia).then(function(data){
            $scope.subGruposList = data;
            $scope.subGruposList.splice(0,0,item);//index,?,item
        });
    };
    
    
    $scope.verFactura_action = function(s){
        console.log(s);
        $window.open("/FARMACIA_REPORTES/factura/reporteFacturaPdf.jsp?codSalidaVenta="+s.salidasVenta.codSalidaVenta +"&codFacturaEmitida="+s.codFacturaEmitida+"&montoTotal="+s.montoTotal);
    };
    
    $scope.anularFacturaEmitida_action = function(s){
        $scope.salidasVentaBusiness = {};
        //console.log("entro eliminar");
        if (  parseFloat(s.estadosRegistro.codEstado)===2) {
                $.growl.warning({title:"ADVERTENCIA!", message: "la factura ya se encuentra anulada" });
                return false;
        }
        if(confirm("esta seguro de anular la factura Nro "+s.nroFactura+"?")===false){
            return;
        }
        
        
        //$scope.salidasVentaBusiness.salidasVenta = angular.copy(s.salidasVenta);
        //console.log($scope.salidasVentaBusiness);
        
        
        
        //$scope.salidasVentaBusiness.salidasVentaDetalleList = angular.copy($scope.salidasVentaDetalleList);            
        Data.post("/facturasEmitidas/anularFactura", s).then(function(data){
            $scope.cargarPagina();
         });
    };
    
    }
    ]);
});