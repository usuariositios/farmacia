define(['app'], function(app)
{
app.controller('navegadorGruposProductoController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {    
    //try {    
    $scope.gruposProductoBuscar = {};//gruposProductoBuscar
    $scope.gruposProducto = {};//gruposProductoBuscar
    $scope.gruposProductoObj = {};//gruposProductoBuscar
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
   
    
    
    Data.get('/estadosRegistro/cargarEstadosRegistroItem').then(function(data){
        $scope.estadosRegistroList = data;
        $scope.estadosRegistroList.splice(0,0,item);
    });
    Data.get('/gruposProducto/gruposProducto').then(function(data){
         $scope.gruposProductoBuscar = data;
         $scope.gruposProductoObj = angular.copy(data);
         $scope.gruposProductoBuscar.filaInicial = 0;//de este floor a 10
         
         console.log($scope.gruposProductoBuscar);         
         Data.post("/gruposProducto/cargarGruposProducto", $scope.gruposProductoBuscar).then(function(data){
            $scope.gruposProductoList = data;
            console.log(data);
         });
    });
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.gruposProductoBuscar);
        $scope.gruposProductoBuscar.filaInicial = parseInt($scope.gruposProductoBuscar.filaInicial) + 10;
        sessionStorage.setItem("gruposProducto",  JSON.stringify($scope.gruposProductoBuscar));
        Data.post("/gruposProducto/cargarGruposProducto", $scope.gruposProductoBuscar).then(function(data){
            $scope.gruposProductoList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.gruposProductoBuscar.filaInicial = parseInt($scope.gruposProductoBuscar.filaInicial) - 10;
        sessionStorage.setItem("gruposProducto",  JSON.stringify($scope.gruposProductoBuscar));
        Data.post("/gruposProducto/cargarGruposProducto", $scope.gruposProductoBuscar).then(function(data){
            $scope.gruposProductoList = data;
            console.log(data);
         });
    };
    $scope.agregarGrupoProducto_action = function() {       
        $scope.gruposProducto = angular.copy($scope.gruposProductoObj);
        mostrarVentanaModal("agregarGrupoProductoDialog");
        //$('#agregarGrupoProductoDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();    
    };
    $scope.guardarGrupoProducto_action = function() {
        $scope.gruposProducto.estadosRegistro.codEstado = 1;
        Data.post('/gruposProducto/guardarGruposProducto', $scope.gruposProducto).then(function(data){            
            $('#agregarGrupoProductoDialog').modal('hide');
            Data.post("/gruposProducto/cargarGruposProducto", $scope.gruposProductoBuscar).then(function(data){
                $scope.gruposProductoList = data;
                console.log(data);
            });
        });
    };
    $scope.editarGrupoProducto_action = function(gpr){
        /*var i=0;
        for(i=0;i<$scope.gruposProductoList.length;i++){
            if($scope.gruposProductoList[i].checked===true){
                $scope.gruposProducto = angular.copy($scope.gruposProductoList[i]);                
                break;
            }
        }*/
        
        $scope.gruposProducto = angular.copy(gpr);
        mostrarVentanaModal("editarGrupoProductoDialog");
        //$('#editarGrupoProductoDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();        
        
    };
    
    $scope.guardarEditarGrupoProducto_action = function() {
        
        Data.post('/gruposProducto/editarGruposProducto', $scope.gruposProducto).then(function(data){            
            $('#editarGrupoProductoDialog').modal('hide');
            Data.post("/gruposProducto/cargarGruposProducto", $scope.gruposProductoBuscar).then(function(data){
                $scope.gruposProductoList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarGrupoProducto_action = function(gpr){
        /*var i=0;
        for(i=0;i<$scope.gruposProductoList.length;i++){
            if($scope.gruposProductoList[i].checked===true){
                $scope.gruposProducto = angular.copy($scope.gruposProductoList[i]);
                 Data.post('/gruposProducto/eliminarGruposProducto', $scope.gruposProducto).then(function(data){
                    Data.post("/gruposProducto/cargarGruposProducto", $scope.gruposProductoBuscar).then(function(data){
                        $scope.gruposProductoList = data;
                        console.log(data);
                    });
                });
                break;
            }
        }*/
        if(confirm("esta seguro de borrar el grupo de Productos?")===false){
            return;
        }
        
        $scope.gruposProducto = angular.copy(gpr);
        Data.post('/gruposProducto/eliminarGruposProducto', $scope.gruposProducto).then(function (data) {
            Data.post("/gruposProducto/cargarGruposProducto", $scope.gruposProductoBuscar).then(function (data) {
                $scope.gruposProductoList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarGrupoProducto_action = function(){        
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarGrupoProductoDialog");
    };
    $scope.buscarGrupoProducto_action = function(){
        Data.post("/gruposProducto/cargarGruposProducto", $scope.gruposProductoBuscar).then(function (data) {
                $scope.gruposProductoList = data;
                console.log(data);
            });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarGrupoProductoDialog");
    };
    }
    ]);
});