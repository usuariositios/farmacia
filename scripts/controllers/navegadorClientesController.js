define(['app'], function(app)
{
app.controller('navegadorClientesController',
    ['$scope','Data','$location',
    function ($scope, Data, $location) {
    //try {    
    $scope.clienteBuscar = {};//clienteBuscar
    $scope.cliente = {};//clienteBuscar
    $scope.clienteObj = {};//clienteBuscar
    $scope.clientesList = [];
    $scope.ciudadesList = [];
    $scope.paisesList = [];
    $scope.tiposDescuentoList = [];
    $scope.gruposClienteList = [];
    
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    Data.get('/ciudad/ciudad').then(function(data){
        $scope.ciudad = data;
        $scope.ciudad.pais.codPais=3;//Bolivia
        Data.post("/ciudad/cargarCiudad",$scope.ciudad).then(function(data){
            $scope.ciudadesList = data;
            $scope.ciudadesList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    });
    
    /*Data.get("/pais/cargarPaisItem").then(function(data){
            $scope.paisesList = data;
            $scope.paisesList.splice(0,0,item);//index,?,item
            console.log(data);
    });*/
    Data.get("/tiposDescuento/cargarTiposDescuentoItem").then(function(data){
            $scope.tiposDescuentoList = data;
            $scope.tiposDescuentoList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    Data.get("/gruposCliente/cargarGruposClienteItem").then(function(data){
            $scope.gruposClienteList = data;
            $scope.gruposClienteList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    
    
    
    
    //busca el objeto cliente luego carga la lista de clientes
    Data.get('/cliente/cliente').then(function(data){
         $scope.clienteBuscar = data;
         $scope.clienteObj = angular.copy(data);
         $scope.clienteBuscar.filaInicial = 0;//de este floor a 10
         
         console.log($scope.clienteBuscar);         
         Data.post("/cliente/cargarCliente",$scope.clienteBuscar).then(function(data){
            $scope.clientesList = data;
            console.log(data);
         });
    });
    
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.clienteBuscar);
        $scope.clienteBuscar.filaInicial = parseInt($scope.clienteBuscar.filaInicial) + 10;
        sessionStorage.setItem("clientes",  JSON.stringify($scope.clienteBuscar));
        Data.post("/cliente/cargarClientes", $scope.clienteBuscar).then(function(data){
            $scope.clientesList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.clienteBuscar.filaInicial = parseInt($scope.clienteBuscar.filaInicial) - 10;
        sessionStorage.setItem("clientes",  JSON.stringify($scope.clienteBuscar));
        Data.post("/cliente/cargarClientes", $scope.clienteBuscar).then(function(data){
            $scope.clientesList = data;
            console.log(data);
         });
    };
    $scope.agregarCliente_action = function(){       
        $scope.cliente = angular.copy($scope.clienteObj);
        mostrarVentanaModal("agregarClienteDialog");
        
        /*$('#agregarClienteDialog').modal('show');
        $('#agregarClienteDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.cancelarAgregarCliente_action = function() {
        ocultarVentanaModal('#agregarClienteDialog');
        /*$('#agregarClienteDialog').modal('show');
        $('#agregarClienteDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.guardarCliente_action = function() {
        $scope.cliente.estadosRegistro.codEstado = 1;
        Data.post('/cliente/guardarCliente', $scope.cliente).then(function(data){            
            $('#agregarClienteDialog').modal('hide');
            Data.post("/cliente/cargarCliente", $scope.clienteBuscar).then(function(data){
                $scope.clientesList = data;
                console.log(data);
            });
        });
    };
    $scope.editarCliente_action = function(pr){
        /*var i=0;
        for(i=0;i<$scope.clientesList.length;i++){
            if($scope.clientesList[i].checked===true){
                $scope.cliente = angular.copy($scope.clientesList[i]);                
                break;
            }
        }*/
        
        $scope.cliente = angular.copy(pr);
        
        //$('#editarClienteDialog').modal('show');
        //$('#editarClienteDialog').appendTo('body');
        //$('body').removeClass();
        mostrarVentanaModal("editarClienteDialog");
        
    };    
    
    
    $scope.guardarEditarCliente_action = function() {
        
        Data.post('/cliente/editarCliente', $scope.cliente).then(function(data){            
            $('#editarClienteDialog').modal('hide');
            Data.post("/cliente/cargarCliente", $scope.clienteBuscar).then(function(data){
                $scope.clientesList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarCliente_action = function(pr){
        
        $scope.cliente = angular.copy(pr);
        Data.post('/cliente/eliminarCliente', $scope.cliente).then(function (data) {
            Data.post("/cliente/cargarCliente", $scope.clienteBuscar).then(function (data) {
                $scope.clientesList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarCliente_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarClienteDialog");
    };
    $scope.buscarCliente_action = function(){
        Data.post("/cliente/cargarCliente", $scope.clienteBuscar).then(function (data) {
                $scope.clientesList = data;
                console.log(data);
            });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarClienteDialog");
    };
    $scope.grupoCliente_change = function(g){
        $scope.subGrupoCopia = angular.copy($scope.clienteObj.subGruposCliente);
        
        $scope.subGrupoCopia.ciudades.codGrupoCliente = $scope.cliente.grupoCliente.codGrupoCliente;
        Data.post('/subGruposCliente/cargarSubGruposClienteItem', $scope.subGrupoCopia).then(function(data){
            $scope.subGruposList = data;
            $scope.subGruposList.splice(0,0,item);//index,?,item
        });
    };
    
    }
    ]);
});