define(['app'], function(app)
{
app.controller('navegadorOrdenesCompraController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {
    
    //try {    
    $scope.ordenesCompra = {};
    $scope.ordenesCompraBuscar = {};//ordenesCompraBuscar
    $scope.ordenesCompraList = [];
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.ordenesCompraBusiness = {};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    
    
    
    Data.get('/ordenesCompra/ordenesCompra').then(function(data){
        $scope.ordenesCompra = data;
        $scope.ordenesCompra.filaInicial = 0;//de este floor a 10
        $scope.ordenesCompraBuscar = angular.copy($scope.ordenesCompra);
        
        $scope.ordenesCompraBuscar.gestiones = angular.copy($scope.usuarioPersonal.gestion);            
        console.log($scope.ordenesCompraBuscar);
        Data.post("/ordenesCompra/cargarOrdenesCompra", $scope.ordenesCompraBuscar).then(function(data){
            $scope.ordenesCompraList = data;
            console.log(data);
        });
         
    });
    
    Data.get('/proveedores/cargarProveedoresItem').then(function(data){
        $scope.proveedoresList = data;
        $scope.proveedoresList.splice(0,0,item);
    });
    Data.get('/tiposCompra/cargarTiposCompraItem').then(function(data){
        $scope.tiposCompraList = data;
        $scope.tiposCompraList.splice(0,0,item);
    });
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.ordenesCompraBuscar);
        $scope.ordenesCompraBuscar.filaInicial = parseInt($scope.ordenesCompraBuscar.filaInicial) + 10;
        sessionStorage.setItem("ordenesCompra",  JSON.stringify($scope.ordenesCompraBuscar));
        Data.post("/ordenesCompra/cargarOrdenesCompra", $scope.ordenesCompraBuscar).then(function(data){
            $scope.ordenesCompraList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.ordenesCompraBuscar.filaInicial = parseInt($scope.ordenesCompraBuscar.filaInicial) - 10;
        sessionStorage.setItem("ordenesCompra",  JSON.stringify($scope.ordenesCompraBuscar));
        Data.post("/ordenesCompra/cargarOrdenesCompra", $scope.ordenesCompraBuscar).then(function(data){
            $scope.ordenesCompraList = data;
            console.log(data);
         });
    };
    $scope.agregarOrdenCompra_action = function() {        
        //window.location = "agregarOrdenesCompra.html";
        $location.path("agregarOrdenesCompra");
    };
    $scope.editarOrdenCompra_action1 = function(){
        var i=0;        
        for(i=0;i<$scope.ordenesCompraList.length;i++){
            if($scope.ordenesCompraList[i].checked===true){                
                sessionStorage.setItem("ordenesCompraEditar",  JSON.stringify(angular.copy($scope.ordenesCompraList[i])));
                break;
            }
        }
        $location.path("editarOrdenesCompra");
        //window.location = "editarOrdenCompra.html";
    };
    $scope.editarOrdenCompra_action = function(oc){
        if(oc.estadosOrdenCompra.codEstadoOrdenCompra === 3){
            $.growl.warning({title:" ", message: "La orden de compra ya esta aprobada"});
            return;
        }
        sessionStorage.setItem("ordenesCompraEditar",  JSON.stringify(angular.copy(oc)));
        $location.path("editarOrdenesCompra");
        //window.location = "editarOrdenCompra.html";
    };
    $scope.mostrarBuscarOrdenCompra_action = function(){        
        //$('#buscaringresoAlmacenDialog').modal('show');
        //appending modal background inside the bigform-content
        //$('.modal-backdrop').appendTo('.container');
        //removing body classes to able click events
        //$('body').removeClass();
        console.log("entro mostrar:");
        mostrarVentanaModal("buscaringresoAlmacenDialog");
    };
    $scope.buscarOrdenCompra_action = function(){
        Data.post("/ordenesCompra/cargarOrdenesCompra", $scope.ordenesCompraBuscar).then(function(data){
            $scope.ordenesCompraList = data;
            console.log(data);
         });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscaringresoAlmacenDialog");
    };
    $scope.eliminarOrdenCompra_action = function(ia){
        console.log("entro eliminar");
        if(confirm("esta seguro de eliminar?")===false){
            return;
        }
        $scope.ordenesCompraBusiness.ordenesCompra = angular.copy(ia);
        //$scope.ordenesCompraBusiness.ordenesCompraDetalleList = angular.copy($scope.salidasAlmacenDetalleList);
            
        Data.post("/ordenesCompra/eliminarOrdenesCompraBusiness", $scope.ordenesCompraBusiness).then(function(data){
            $scope.ordenesCompraList = data;
            Data.post("/ordenesCompra/cargarOrdenesCompra", $scope.ordenesCompraBuscar).then(function(data){
                $scope.ordenesCompraList = data;
                console.log(data);
            });
         });
    };
    
    $scope.aprobarOrdenCompra_action = function(oc){
        console.log(oc);
        if(oc.estadosOrdenCompra.codEstadoOrdenCompra !== 3){
            guardarSession("ordenCompraAprobada",  oc);
            $location.path("agregarIngresosVenta");
        }else{
            $.growl.warning({title:" ", message: "La orden de compra ya esta aprobada"});
        }
        
        //window.location = "editarOrdenCompra.html";
    };
    
    }
    ]);
});