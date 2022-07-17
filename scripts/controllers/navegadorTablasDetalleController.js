define(['app'], function(app)
{
app.controller('navegadorTablasDetalleController',
    ['$scope','Data','$location','$window',
    function ($scope, Data,$location,$window) {
    //try {
    $scope.tablaDetallesBuscar = {};//tablaDetallesBuscar
    
    $scope.tablaDetalleObj = {};//tablaDetallesBuscar
    $scope.tablaDetallesList = [];
    
    $scope.tablaDetalleList = [];
    $scope.proveedoresList = [];
    $scope.subGruposList = [];
    $scope.subGrupoCopia = {};
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.tabla = obtenerSession("tabla");
    
    $scope.empaqueExternoList = [];
    $scope.subGruposList.splice(0,0,item);//index,?,item
    $scope.tablaDetalleObj = {};
    
    Data.get("/tablaDetalle/tablaDetalle").then(function(data){
        $scope.tablaDetalleBuscar = angular.copy(data);
        $scope.tablaDetalleObj = angular.copy(data);
        $scope.tablaDetalleBuscar.tabla = angular.copy($scope.tabla);
        
        
        Data.post("/tablaDetalle/cargarTablaDetalle", $scope.tablaDetalleBuscar).then(function (data) {
            $scope.tablaDetalleList = angular.copy(data);
            console.log($scope.tablaDetalleList);
        });
    });
    $scope.volver_action = function() {
        $location.path("navegadorTablas");
        
    };
    
    $scope.agregarTablaDetalle_action = function() {       
        $scope.tablaDetalleAgregar = angular.copy($scope.tablaDetalleObj);
        mostrarVentanaModal("agregarTablaDetalleDialog");
    };
    
    $scope.guardarTablaDetalle_action = function() {
        
        $scope.tablaDetalleAgregar.tabla = angular.copy($scope.tabla);
        console.log($scope.tablaDetalleAgregar);
        Data.post('/tablaDetalle/guardarTablaDetalle', $scope.tablaDetalleAgregar).then(function(data){
            $('#agregarTablaDetalleDialog').modal('hide');
            Data.post("/tablaDetalle/cargarTablaDetalle", $scope.tablaDetalleBuscar).then(function (data) {
            $scope.tablaDetalleList = angular.copy(data);
            console.log($scope.tablaDetalleList);
            });
        });
    };
      
    $scope.editarTablaDetalle_action = function(td) {       
        $scope.tablaDetalleEditar = angular.copy(td);
        mostrarVentanaModal("editarTablaDetalleDialog");
    };
    
    $scope.guardarEditarTablaDetalle_action = function() {
        $scope.tablaDetalleEditar.tabla = angular.copy($scope.tabla);
        console.log($scope.tablaDetalleEditar);
        Data.post('/tablaDetalle/editarTablaDetalle', $scope.tablaDetalleEditar).then(function(data){
            
            ocultarVentanaModal("#editarTablaDetalleDialog");
            Data.post("/tablaDetalle/cargarTablaDetalle", $scope.tablaDetalleBuscar).then(function (data) {
            $scope.tablaDetalleList = angular.copy(data);
            console.log($scope.tablaDetalleList);
            });
        });
    };
    $scope.eliminarTabla_action = function(td){
        td.tabla = angular.copy($scope.tabla);
        console.log(td);
        Data.post('/tablaDetalle/eliminarTablaDetalle', td).then(function(data){
            
            Data.post("/tablaDetalle/cargarTablaDetalle", $scope.tablaDetalleBuscar).then(function (data) {
            $scope.tablaDetalleList = angular.copy(data);
            console.log($scope.tablaDetalleList);
            });
        });
    };
    
    $scope.mostrarBuscarTabla_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarTablaDialog");
    };
    $scope.buscarTabla_action = function(){
        $scope.tablaDetallesBuscar.filaInicial = 0;
        
        Data.post("/tablaDetalles/cargarTablas", $scope.tablaDetallesBuscar).then(function (data) {
                $scope.tablaDetallesList = data;
                console.log(data);
            });
        
         
         ocultarVentanaModal("#buscarTablaDialog");
    };
    $scope.grupoTabla_change = function(g){
        $scope.subGrupoCopia = angular.copy($scope.tablaDetalleObj.subGruposTabla);
        
        $scope.subGrupoCopia.gruposTabla.codGrupoTabla = $scope.tablaDetalleBuscar.grupoTabla.codGrupoTabla;
        Data.post('/subGruposTabla/cargarSubGruposTablaItem', $scope.subGrupoCopia).then(function(data){
            $scope.subGruposList = data;
            $scope.subGruposList.splice(0,0,item);//index,?,item
        });
    };
    
    $scope.verReporteTabla_action = function(pr){
        
        $window.open("https://farmacia-reportes.herokuapp.com/tablaDetalle/reporteTabla.jsp?codTabla="+pr.codTabla +"&nombreTabla="+pr.nombreTabla+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
    };
    
    
    
    }
    ]);
});