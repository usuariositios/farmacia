define(['app'], function(app)
{
app.controller('navegadorTablasController',
    ['$scope','Data','$location','$window',
    function ($scope, Data,$location,$window) {
    //try {
    $scope.tablasBuscar = {};//tablasBuscar
    $scope.tabla = {};//tablasBuscar
    $scope.tablaObj = {};//tablasBuscar
    $scope.tablasList = [];
    $scope.tabla = {};
    $scope.tablaList = [];
    $scope.proveedoresList = [];
    $scope.subGruposList = [];
    $scope.subGrupoCopia = {};
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    
    $scope.empaqueExternoList = [];
    $scope.subGruposList.splice(0,0,item);//index,?,item
    
    Data.get("/tabla/tabla").then(function(data){
        $scope.tabla = angular.copy(data);
        $scope.tablaObj = angular.copy(data);
        $scope.tabla.estadosRegistro.codEstado = 1;
        Data.post("/tabla/cargarTabla", $scope.tabla).then(function (data) {
            $scope.tablaList = angular.copy(data);
            console.log($scope.tablaList);
        });
    });
   $scope.verTabla_action = function(t){
        guardarSession("tabla",t);
        $location.path("navegadorTablasDetalle");        
    }; 
    
    $scope.agregarTabla_action = function() {       
        $scope.tablaAgregar = angular.copy($scope.tablaObj);
        mostrarVentanaModal("agregarTablaDialog");
    };
    
    $scope.guardarTabla_action = function() {
        
        $scope.tablaAgregar.estadosRegistro.codEstado = 1;
        console.log($scope.tablaAgregar);
        Data.post('/tabla/guardarTabla', $scope.tablaAgregar).then(function(data){
            ocultarVentanaModal("#agregarTablaDialog");
            Data.post("/tabla/cargarTabla", $scope.tablaBuscar).then(function (data) {
            $scope.tablaList = angular.copy(data);
            console.log($scope.tablaList);
            });
        });
    };
      
    $scope.editarTabla_action = function(td) {       
        $scope.tablaEditar = angular.copy(td);
        mostrarVentanaModal("editarTablaDialog");
    };
    
    $scope.guardarEditarTabla_action = function() {
        
        console.log($scope.tablaEditar);
        Data.post('/tabla/editarTabla', $scope.tablaEditar).then(function(data){
            
            ocultarVentanaModal("#editarTablaDialog");
            Data.post("/tabla/cargarTabla", $scope.tablaBuscar).then(function (data) {
            $scope.tablaList = angular.copy(data);
            console.log($scope.tablaList);
            });
        });
    };
    $scope.eliminarTabla_action = function(td){
        td.tabla = angular.copy($scope.tabla);
        console.log(td);
        Data.post('/tabla/eliminarTabla', td).then(function(data){
            
            Data.post("/tabla/cargarTabla", $scope.tablaBuscar).then(function (data) {
            $scope.tablaList = angular.copy(data);
            console.log($scope.tablaList);
            });
        });
    };
    
    $scope.mostrarBuscarTabla_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarTablaDialog");
    };
    $scope.buscarTabla_action = function(){
        $scope.tablasBuscar.filaInicial = 0;
        
        Data.post("/tablas/cargarTablas", $scope.tablasBuscar).then(function (data) {
                $scope.tablasList = data;
                console.log(data);
            });
        
         
         ocultarVentanaModal("#buscarTablaDialog");
    };
    $scope.grupoTabla_change = function(g){
        $scope.subGrupoCopia = angular.copy($scope.tablaObj.subGruposTabla);
        
        $scope.subGrupoCopia.gruposTabla.codGrupoTabla = $scope.tabla.grupoTabla.codGrupoTabla;
        Data.post('/subGruposTabla/cargarSubGruposTablaItem', $scope.subGrupoCopia).then(function(data){
            $scope.subGruposList = data;
            $scope.subGruposList.splice(0,0,item);//index,?,item
        });
    };
    
    $scope.verReporteTabla_action = function(pr){
        
        $window.open("https://farmacia-reportes.herokuapp.com/tabla/reporteTabla.jsp?codTabla="+pr.codTabla +"&nombreTabla="+pr.nombreTabla+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
    };
    
    
    
    }
    ]);
});