define(['app'], function(app)
{
app.controller('navegadorSubGruposProductoController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {    
    //try {    
    $scope.subGruposProductoBuscar = {};//subGruposProductoBuscar
    $scope.subGruposProducto = {};//subGruposProductoBuscar
    $scope.subGruposProductoCopia = {};//subGruposProductoBuscar
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    $scope.gruposProductoList = {};
    $scope.estadosRegistroList = {};
    
    
    Data.get('/gruposProducto/cargarGruposProductoItem').then(function(data){
        $scope.gruposProductoList = data;
        $scope.gruposProductoList.splice(0,0,item);
        console.log(data);
    });
    Data.get('/estadosRegistro/cargarEstadosRegistroItem').then(function(data){
        $scope.estadosRegistroList = data;
        $scope.estadosRegistroList.splice(0,0,item);
    });
    Data.get('/subGruposProducto/subGruposProducto').then(function(data){
         $scope.subGruposProductoBuscar = data;
         $scope.subGruposProductoCopia = angular.copy(data);
         $scope.subGruposProductoBuscar.filaInicial = 0;//de este floor a 10
         
         console.log($scope.subGruposProductoBuscar);         
         Data.post("/subGruposProducto/cargarSubGruposProducto", $scope.subGruposProductoBuscar).then(function(data){
            $scope.subGruposProductoList = data;
            console.log(data);
         });
    });
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.subGruposProductoBuscar);
        $scope.subGruposProductoBuscar.filaInicial = parseInt($scope.subGruposProductoBuscar.filaInicial) + 10;
        sessionStorage.setItem("subGruposProducto",  JSON.stringify($scope.subGruposProductoBuscar));
        Data.post("/subGruposProducto/cargarSubGruposProducto", $scope.subGruposProductoBuscar).then(function(data){
            $scope.subGruposProductoList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.subGruposProductoBuscar.filaInicial = parseInt($scope.subGruposProductoBuscar.filaInicial) - 10;
        sessionStorage.setItem("subGruposProducto",  JSON.stringify($scope.subGruposProductoBuscar));
        Data.post("/subGruposProducto/cargarSubGruposProducto", $scope.subGruposProductoBuscar).then(function(data){
            $scope.subGruposProductoList = data;
            console.log(data);
         });
    };
    $scope.agregarSubGruposProducto_action = function() {       
        $scope.subGruposProducto = angular.copy($scope.subGruposProductoCopia);
        mostrarVentanaModal("agregarSubGruposProductoDialog");
        
    };
    $scope.guardarSubGruposProducto_action = function() {
        //VALIDACIONES
        if ( parseInt($scope.subGruposProducto.gruposProducto.codGrupoProducto) === 0) {
                $scope.mensaje = "Seleccione Grupo";
                mostrarVentanaModal('mensajeDialog');
                return null;
        }
        if ( $scope.subGruposProducto.nombreSubGrupo === "") {
                $scope.mensaje = "Registre nombre de sub grupo";
                mostrarVentanaModal('mensajeDialog');
                return null;
        }
        $scope.subGruposProducto.estadosRegistro.codEstado = 1;
        Data.post('/subGruposProducto/guardarSubGruposProducto', $scope.subGruposProducto).then(function(data){            
            $('#agregarSubGruposProductoDialog').modal('hide');
            Data.post("/subGruposProducto/cargarSubGruposProducto", $scope.subGruposProductoBuscar).then(function(data){
                $scope.subGruposProductoList = data;
                console.log(data);
            });
        });
    };
    $scope.editarSubGruposProducto_action = function(gpr){
        
        $scope.subGruposProducto = angular.copy(gpr);
        mostrarVentanaModal("editarSubGruposProductoDialog");
        //$('#editarGrupoProductoDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();        
        
    };
    
    $scope.guardarEditarSubGruposProducto_action = function() {
        
        Data.post('/subGruposProducto/editarSubGruposProducto', $scope.subGruposProducto).then(function(data){            
            $('#editarSubGruposProductoDialog').modal('hide');
            Data.post("/subGruposProducto/cargarSubGruposProducto", $scope.subGruposProductoBuscar).then(function(data){
                $scope.subGruposProductoList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarSubGruposProducto_action = function(gpr){
      
        if(confirm("esta seguro de borrar el Sub grupo de Productos?")===false){
            return;
        }
        
        $scope.subGruposProducto = angular.copy(gpr);
        Data.post('/subGruposProducto/eliminarSubGruposProducto', $scope.subGruposProducto).then(function (data) {
            Data.post("/subGruposProducto/cargarSubGruposProducto", $scope.subGruposProductoBuscar).then(function (data) {
                $scope.subGruposProductoList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarSubGruposProducto_action = function(){        
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarSubGruposProductoDialog");
    };
    $scope.buscarGrupoProducto_action = function(){
        Data.post("/subGruposProducto/cargarSubGruposProducto", $scope.subGruposProductoBuscar).then(function (data) {
                $scope.subGruposProductoList = data;
                console.log(data);
            });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarSubGruposProductoDialog");
    };
    }
    ]);
});