define(['app'], function(app)
{
app.controller('navegadorSucursalVentasController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {    
    //try {
    
    $scope.sucursalVentaBuscar = {};//sucursalVentaBuscar
    $scope.sucursalVenta = {};//sucursalVentaBuscar
    $scope.sucursalVentaObj = {};//sucursalVentaBuscar
    $scope.sucursalVentaList = [];
    $scope.estadosRegistroList = [];
    $scope.empresasList = [];
    $scope.monedaList = [];
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    
    
    Data.get("/estadosRegistro/cargarEstadosRegistroItem").then(function(data){
            $scope.estadosRegistroList = data;
            $scope.estadosRegistroList.splice(0,0,item);
            console.log(data);
    });
    /*cargar empresa*/
    Data.get("/empresas/cargarEmpresasItem").then(function(data){
            $scope.empresasList = data;
            $scope.empresasList.splice(0,0,item);
            console.log(data);
    });
    Data.get("/moneda/cargarMonedasItem").then(function(data){
            $scope.monedaList = data;
            $scope.monedaList.splice(0,0,item);
            console.log(data);
    });
    
    
    Data.get('/sucursalVenta/sucursalVenta').then(function(data){
         $scope.sucursalVentaBuscar = data;
         $scope.sucursalVentaObj = angular.copy(data);
         //$scope.sucursalVentaBuscar.filaInicial = 0;//de este floor a 10
         
         console.log($scope.sucursalVentaBuscar);         
         Data.post("/sucursalVenta/cargarSucursalVentas", $scope.sucursalVentaBuscar).then(function(data){
            $scope.sucursalVentaList = data;
            console.log(data);
         });
    });
    
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.sucursalVentaBuscar);
        $scope.sucursalVentaBuscar.filaInicial = parseInt($scope.sucursalVentaBuscar.filaInicial) + 10;
        sessionStorage.setItem("sucursalVenta",  JSON.stringify($scope.sucursalVentaBuscar));
        Data.post("/sucursalVenta/cargarSucursalVentasItem", $scope.sucursalVentaBuscar).then(function(data){
            $scope.sucursalVentaList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.sucursalVentaBuscar.filaInicial = parseInt($scope.sucursalVentaBuscar.filaInicial) - 10;
        sessionStorage.setItem("sucursalVenta",  JSON.stringify($scope.sucursalVentaBuscar));
        Data.post("/sucursalVenta/cargarSucursalVentasItem", $scope.sucursalVentaBuscar).then(function(data){
            $scope.sucursalVentaList = data;
            console.log(data);
         });
    };
    $scope.agregarSucursalVenta_action = function() {       
        $scope.sucursalVenta = angular.copy($scope.sucursalVentaObj);
        mostrarVentanaModal("agregarSucursalVentaDialog");
        //$('#agregarSucursalVentaDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();    
    };
    $scope.guardarSucursalVenta_action = function() {
        $scope.sucursalVenta.estadosRegistro.codEstado = 1;
        Data.post('/sucursalVenta/guardarSucursalVentas', $scope.sucursalVenta).then(function(data){            
            $('#agregarSucursalVentaDialog').modal('hide');
            Data.post("/sucursalVenta/cargarSucursalVentas", $scope.sucursalVentaBuscar).then(function(data){
                $scope.sucursalVentaList = data;
                console.log(data);
            });
        });
    };
    $scope.editarSucursalVenta_action = function(e){
        $scope.sucursalVenta = angular.copy(e);
        mostrarVentanaModal("editarSucursalVentaDialog");
    };
    
    $scope.guardarEditarSucursalVenta_action = function() {        
        Data.post('/sucursalVenta/editarSucursalVentas', $scope.sucursalVenta).then(function(data){            
            $('#editarSucursalVentaDialog').modal('hide');
            Data.post("/sucursalVenta/cargarSucursalVentas", $scope.sucursalVentaBuscar).then(function(data){
                $scope.sucursalVentaList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarSucursalVenta_action = function(e){
        /*var i=0;
        for(i=0;i<$scope.sucursalVentaList.length;i++){
            if($scope.sucursalVentaList[i].checked===true){
                $scope.sucursalVenta = angular.copy($scope.sucursalVentaList[i]);
                 Data.post('/sucursalVenta/eliminarSucursalVentas', $scope.sucursalVenta).then(function(data){
                    Data.post("/sucursalVenta/cargarSucursalVentasItem", $scope.sucursalVentaBuscar).then(function(data){
                        $scope.sucursalVentaList = data;
                        console.log(data);
                    });
                });
                break;
            }
        }*/
        if(confirm("Esta seguro de eliminar la SucursalVenta?")===false){
            return;
        }
        
        $scope.sucursalVenta = angular.copy(e);
        Data.post('/sucursalVenta/eliminarSucursalVentas', $scope.sucursalVenta).then(function (data) {
            Data.post("/sucursalVenta/cargarSucursalVentasItem", $scope.sucursalVentaBuscar).then(function (data) {
                $scope.sucursalVentaList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarSucursalVenta_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarSucursalVentaDialog");
    };
    $scope.buscarSucursalVenta_action = function(){
        Data.post("/sucursalVenta/cargarSucursalVentas", $scope.sucursalVentaBuscar).then(function (data) {
                $scope.sucursalVentaList = data;
                console.log(data);
        });         
         ocultarVentanaModal("#buscarSucursalVentaDialog");
    };
    
    
    
    }
    ]);
});