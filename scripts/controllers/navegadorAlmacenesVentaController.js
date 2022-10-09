define(['app'], function(app)
{
app.controller('navegadorAlmacenesVentaController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {    
    //try {
    
    $scope.almacenVentaBuscar = {};//almacenVentaBuscar
    $scope.almacenVenta = {};//almacenVentaBuscar
    $scope.almacenVentaObj = {};//almacenVentaBuscar
    $scope.almacenVentaList = [];
    $scope.estadosRegistroList = [];
    $scope.sucursalVentasList = [];
    $scope.monedaList = [];
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    
    
    Data.get("/estadosRegistro/cargarEstadosRegistroItem").then(function(data){
            $scope.estadosRegistroList = data;
            $scope.estadosRegistroList.splice(0,0,item);
            console.log(data);
    });
    Data.get("/sucursalVenta/cargarSucursalVentasItem").then(function(data){
            $scope.sucursalVentasList = data;
            $scope.sucursalVentasList.splice(0,0,item);
            console.log(data);
    });
    
    
    
    Data.get('/almacenes/almacenes').then(function(data){
         $scope.almacenVentaBuscar = data;
         $scope.almacenVentaObj = angular.copy(data);
         $scope.almacenVentaBuscar.filaInicial = 0;//de este floor a 10
         
         console.log($scope.almacenVentaBuscar);         
         Data.post("/almacenes/cargarAlmacenes", $scope.almacenVentaBuscar).then(function(data){
            $scope.almacenVentaList = data;
            console.log(data);
         });
    });
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.almacenVentaBuscar);
        $scope.almacenVentaBuscar.filaInicial = parseInt($scope.almacenVentaBuscar.filaInicial) + 10;
        sessionStorage.setItem("almacenVenta",  JSON.stringify($scope.almacenVentaBuscar));
        Data.post("/almacenes/cargarAlmacenes", $scope.almacenVentaBuscar).then(function(data){
            $scope.almacenVentaList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.almacenVentaBuscar.filaInicial = parseInt($scope.almacenVentaBuscar.filaInicial) - 10;
        sessionStorage.setItem("almacenVenta",  JSON.stringify($scope.almacenVentaBuscar));
        Data.post("/almacenes/cargarAlmacenes", $scope.almacenVentaBuscar).then(function(data){
            $scope.almacenVentaList = data;
            console.log(data);
         });
    };
    $scope.agregarAlmacenVenta_action = function() {       
        $scope.almacenVenta = angular.copy($scope.almacenVentaObj);
        mostrarVentanaModal("agregarAlmacenVentaDialog");
        //$('#agregarAlmacenVentaDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();    
    };
    $scope.guardarAlmacenVenta_action = function() {
        $scope.almacenVenta.estadosRegistro.codEstado = 1;
        
        Data.post("/almacenes/guardarAlmacenes", $scope.almacenVenta).then(function(data){            
            $('#agregarAlmacenVentaDialog').modal('hide');
            Data.post("/almacenes/cargarAlmacenes", $scope.almacenVentaBuscar).then(function(data){
                $scope.almacenVentaList = data;
                console.log(data);
            });
        });
    };
    $scope.editarAlmacenVenta_action = function(e){
        /*var i=0;
        for(i=0;i<$scope.almacenVentaList.length;i++){
            if($scope.almacenVentaList[i].checked===true){
                $scope.almacenVenta = angular.copy($scope.almacenVentaList[i]);                
                break;
            }
        }*/
        $scope.almacenVenta = angular.copy(e);
        mostrarVentanaModal("editarAlmacenVentaDialog");
        //$('#editarAlmacenVentaDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();        
        
    };
    
    $scope.guardarEditarAlmacenesVenta_action = function() {
        
        Data.post('/almacenes/editarAlmacenes', $scope.almacenVenta).then(function(data){
            $('#editarAlmacenVentaDialog').modal('hide');
         Data.post("/almacenes/cargarAlmacenes", $scope.almacenVentaBuscar).then(function(data){
             $scope.almacenVentaList = data;
             console.log(data);
         });
        });
    };
    $scope.eliminarAlmacenVenta_action = function(e){
        /*var i=0;
        for(i=0;i<$scope.almacenVentaList.length;i++){
            if($scope.almacenVentaList[i].checked===true){
                $scope.almacenVenta = angular.copy($scope.almacenVentaList[i]);
                 Data.post('/almacenVenta/eliminarAlmacenesVenta', $scope.almacenVenta).then(function(data){
                    Data.post("/almacenVenta/cargarAlmacenesVenta", $scope.almacenVentaBuscar).then(function(data){
                        $scope.almacenVentaList = data;
                        console.log(data);
                    });
                });
                break;
            }
        }*/
        if(confirm("Esta seguro de eliminar la AlmacenVenta?")===false){
            return;
        }
        
        $scope.almacenVenta = angular.copy(e);
        Data.post('/almacenVenta/eliminarAlmacenesVenta', $scope.almacenVenta).then(function (data) {
            Data.post("/almacenes/cargarAlmacenesVenta", $scope.almacenVentaBuscar).then(function (data) {
                $scope.almacenVentaList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarAlmacenVenta_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarAlmacenVentaDialog");
    };
    $scope.buscarAlmacenVenta_action = function(){
        Data.post("/almacenes/cargarAlmacenesVenta", $scope.almacenVentaBuscar).then(function (data) {
                $scope.almacenVentaList = data;
                console.log(data);
        });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarAlmacenVentaDialog");
    };
    
    
    }
    ]);
});