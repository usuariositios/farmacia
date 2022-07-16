define(['app'], function(app)
{
app.controller('navegadorFacturaDosificacionController',
    ['$scope','Data','$location',
    function ($scope, Data, $location) {
    //try {    
    $scope.facturaDosificacionBuscar = {};//facturaDosificacionBuscar
    $scope.facturaDosificacion = {};//facturaDosificacionBuscar
    $scope.facturaDosificacionObj = {};//facturaDosificacionBuscar
    $scope.facturaDosificacionList = [];
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    Data.get("/ciudad/cargarCiudadItem").then(function(data){
            $scope.ciudadesList = data;
            $scope.ciudadesList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    Data.get("/estadosRegistro/cargarEstadosRegistroItem").then(function(data){
            $scope.estadosRegistroList = data;
            $scope.estadosRegistroList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    
    
    
    
    
    //busca el objeto facturaDosificacion luego carga la lista de facturaDosificacions
    Data.get('/facturaDosificacion/facturaDosificacion').then(function(data){
         $scope.facturaDosificacionBuscar = data;
         $scope.facturaDosificacionBuscar.sucursalVentas = angular.copy($scope.usuarioPersonal.sucursalVentas);
         $scope.facturaDosificacionObj = angular.copy(data);
         $scope.facturaDosificacionBuscar.filaInicial = 0;//de este floor a 10
         
         console.log($scope.facturaDosificacionBuscar);         
         Data.post("/facturaDosificacion/cargarFacturaDosificacion",$scope.facturaDosificacionBuscar).then(function(data){
            $scope.facturaDosificacionList = data;
            console.log(data);
         });
    });
    
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.facturaDosificacionBuscar);
        $scope.facturaDosificacionBuscar.filaInicial = parseInt($scope.facturaDosificacionBuscar.filaInicial) + 10;
        sessionStorage.setItem("facturaDosificacions",  JSON.stringify($scope.facturaDosificacionBuscar));
        Data.post("/facturaDosificacion/cargarFacturaDosificacions", $scope.facturaDosificacionBuscar).then(function(data){
            $scope.facturaDosificacionList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.facturaDosificacionBuscar.filaInicial = parseInt($scope.facturaDosificacionBuscar.filaInicial) - 10;
        sessionStorage.setItem("facturaDosificacions",  JSON.stringify($scope.facturaDosificacionBuscar));
        Data.post("/facturaDosificacion/cargarFacturaDosificacions", $scope.facturaDosificacionBuscar).then(function(data){
            $scope.facturaDosificacionList = data;
            console.log(data);
         });
    };
    $scope.agregarFacturaDosificacion_action = function(){       
        $scope.facturaDosificacion = angular.copy($scope.facturaDosificacionObj);
        $scope.facturaDosificacion.sucursalVentas = angular.copy($scope.usuarioPersonal.sucursalVentas);
        $scope.facturaDosificacion.fechaLimiteEmision = fechaActualDDMMYYYY();
            $('#fechaLimiteEmision .input-group.date').datepicker({
            language: "es",
            format: "dd/mm/yyyy",
            autoclose: true,
            todayHighlight: true
            }).datepicker("setDate", creaDate(fechaActualDDMMYYYY())).on('changeDate', function (e) {
                $scope.facturaDosificacion.fechaLimiteEmision = formatoFecha(e.date);
            });
        mostrarVentanaModal("agregarFacturaDosificacionDialog");
        
        /*$('#agregarFacturaDosificacionDialog').modal('show');
        $('#agregarFacturaDosificacionDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.cancelarAgregarFacturaDosificacion_action = function() {
        ocultarVentanaModal('#agregarFacturaDosificacionDialog');
        /*$('#agregarFacturaDosificacionDialog').modal('show');
        $('#agregarFacturaDosificacionDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.validarFacturaDosificacion = function(){
        
        
        
        if (  parseFloat($scope.facturaDosificacion.nroFacturaInicio)<=0 || isNaN(parseFloat($scope.facturaDosificacion.nroFacturaInicio))) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro inicial de factura" });
                return false;
        }
        if (  parseFloat($scope.facturaDosificacion.nroFacturaFinal)<=0 || isNaN(parseFloat($scope.facturaDosificacion.nroFacturaFinal))) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro final de factura" });
                return false;
        }
        
        if (  $scope.facturaDosificacion.nroAutorizacion.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro de autorizacion" });
                return false;
        }
        if (  $scope.facturaDosificacion.llaveDosificacion.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre la llave de dosificacion" });
                return false;
        }
        if (  $scope.facturaDosificacion.fechaLimiteEmision.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre la fecha limite emision" });
                return false;
        }        
        return true;
    };
    $scope.guardarFacturaDosificacion_action = function() {
        if($scope.validarFacturaDosificacion()===false){
            return null;
        }
        $scope.facturaDosificacion.estadosRegistro.codEstado = 1;
        Data.post('/facturaDosificacion/guardarFacturaDosificacion', $scope.facturaDosificacion).then(function(data){            
            $('#agregarFacturaDosificacionDialog').modal('hide');
            Data.post("/facturaDosificacion/cargarFacturaDosificacion", $scope.facturaDosificacionBuscar).then(function(data){
                $scope.facturaDosificacionList = data;
                console.log(data);
            });
        });
    };
    $scope.editarFacturaDosificacion_action = function(pr){
        
        
        
        /*var i=0;
        for(i=0;i<$scope.facturaDosificacionsList.length;i++){
            if($scope.facturaDosificacionsList[i].checked===true){
                $scope.facturaDosificacion = angular.copy($scope.facturaDosificacionsList[i]);                
                break;
            }
        }*/
        
        $scope.facturaDosificacion = angular.copy(pr);
        $('#fechaLimiteEmisionEd .input-group.date').datepicker({
            language: "es",
            format: "dd/mm/yyyy",
            autoclose: true,
            todayHighlight: true
            }).datepicker("setDate", creaDate(fechaActualDDMMYYYY())).on('changeDate', function (e) {
                $scope.facturaDosificacion.fechaLimiteEmision = formatoFecha(e.date);
            });
        
        //$('#editarFacturaDosificacionDialog').modal('show');
        //$('#editarFacturaDosificacionDialog').appendTo('body');
        //$('body').removeClass();
        mostrarVentanaModal("editarFacturaDosificacionDialog");
        
    };    
    
    
    $scope.guardarEditarFacturaDosificacion_action = function() {
        if($scope.validarFacturaDosificacion()===false){
            return null;
        }
        
        Data.post('/facturaDosificacion/editarFacturaDosificacion', $scope.facturaDosificacion).then(function(data){            
            $('#editarFacturaDosificacionDialog').modal('hide');
            Data.post("/facturaDosificacion/cargarFacturaDosificacion", $scope.facturaDosificacionBuscar).then(function(data){
                $scope.facturaDosificacionList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarFacturaDosificacion_action = function(pr){
        
        $scope.facturaDosificacion = angular.copy(pr);
        Data.post('/facturaDosificacion/eliminarFacturaDosificacion', $scope.facturaDosificacion).then(function (data) {
            Data.post("/facturaDosificacion/cargarFacturaDosificacion", $scope.facturaDosificacionBuscar).then(function (data) {
                $scope.facturaDosificacionList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarFacturaDosificacion_action = function(){
        
        $('#fechaLimiteEmisionBusc .input-group.date').datepicker({
            language: "es",
            format: "dd/mm/yyyy",
            autoclose: true,
            todayHighlight: true
            }).datepicker("setDate", creaDate(fechaActualDDMMYYYY())).on('changeDate', function (e) {
                $scope.facturaDosificacionBuscar.fechaLimiteEmision = formatoFecha(e.date);
            });
        mostrarVentanaModal("buscarFacturaDosificacionDialog");
    };
    $scope.buscarFacturaDosificacion_action = function(){
        Data.post("/facturaDosificacion/cargarFacturaDosificacion", $scope.facturaDosificacionBuscar).then(function (data) {
                $scope.facturaDosificacionList = data;
                console.log(data);
            });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarFacturaDosificacionDialog");
    };
    $scope.grupoFacturaDosificacion_change = function(g){
        $scope.subGrupoCopia = angular.copy($scope.facturaDosificacionObj.subGruposFacturaDosificacion);
        
        $scope.subGrupoCopia.ciudades.codGrupoFacturaDosificacion = $scope.facturaDosificacion.grupoFacturaDosificacion.codGrupoFacturaDosificacion;
        Data.post('/subGruposFacturaDosificacion/cargarSubGruposFacturaDosificacionItem', $scope.subGrupoCopia).then(function(data){
            $scope.subGruposList = data;
            $scope.subGruposList.splice(0,0,item);//index,?,item
        });
    };
    
    }
    ]);
});