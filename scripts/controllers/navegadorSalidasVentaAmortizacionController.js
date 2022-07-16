define(['app'], function(app)
{
app.controller('navegadorSalidasVentaAmortizacionController',
    ['$scope','Data','$location',
function ($scope, Data,$location) {
    
    $scope.salidasVentaBuscar = {};//salidasVentaBuscar
    
    $scope.salidasVentaList = [];
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.salidasVentaBusiness = {};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.clientesList = [];
    $scope.estadoAmortizacionList=[];
    
    
    Data.get('/salidasVenta/salidasVenta').then(function(data){
         console.log(data);
         $scope.salidasVentaBuscar = data;
         $scope.salidasVentaBuscar.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);
         $scope.salidasVentaBuscar.gestion = angular.copy($scope.usuarioPersonal.gestion);
         $scope.salidasVentaBuscar.ventaCompleta = 2; //venta incompleta (por pagar)
         $scope.salidasVentaBuscar.conFacturaEmitida = 1; //las ventas que emitieron factura
         $scope.salidasVentaBuscar.filaInicial = 0;//de este floor a 10
         $scope.salidasVentaBuscar.fechaSalidaVentaInicio="";
         $scope.salidasVentaBuscar.fechaSalidaVentaFinal="";         
         if(obtenerSession("salidasVentaBuscar")!=null){$scope.salidasVentaBuscar = obtenerSession("salidasVentaBuscar");}
         console.log($scope.salidasVentaBuscar);
         
         Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
            $scope.salidasVentaList = data;
            console.log(data);
         });
         
    });
    Data.get('/cliente/cargarClienteItem').then(function(data){
        $scope.clientesList = data;
        $scope.clientesList.splice(0,0,item);
    });
    
    $scope.estadoAmortizacionList.splice(0,0,{codItem:3,nombreItem:"COMPLETA"});
    $scope.estadoAmortizacionList.splice(0,0,{codItem:2,nombreItem:"INCOMPLETA"});
    $scope.estadoAmortizacionList.splice(0,0,item);
    
    
    /*Data.get('/proveedores/cargarProveedoresItem').then(function(data){
        $scope.proveedoresList = data;
        $scope.proveedoresList.splice(0,0,item);
    });*/
    /*Data.get('/estadosSalidaVenta/cargarEstadosSalidaVentaItem').then(function(data){
        $scope.estadosSalidaVentaList = data;
        $scope.estadosSalidaVentaList.splice(0,0,item);
    });*/
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.salidasVentaBuscar);
        $scope.salidasVentaBuscar.filaInicial = parseInt($scope.salidasVentaBuscar.filaInicial) + 10;
        sessionStorage.setItem("salidasVenta",  JSON.stringify($scope.salidasVentaBuscar));
        Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
            $scope.salidasVentaList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.salidasVentaBuscar.filaInicial = parseInt($scope.salidasVentaBuscar.filaInicial) - 10;
        sessionStorage.setItem("salidasVenta",  JSON.stringify($scope.salidasVentaBuscar));
        Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
            $scope.salidasVentaList = data;
            console.log(data);
         });
    };
    
    $scope.agregarPagoAmortizacion_action = function(sa){
        guardarSession("salidasVentaAmortizacion",sa);        
        $location.path("agregarSalidasVentaAmortizacion");
        //window.location = "editarSalidaVenta.html";
    };
    
    $scope.mostrarBuscarSalidaVenta_action = function(sa){        
        mostrarVentanaModal("buscarsalidaVentaDialog");        
    };
    $scope.buscarSalidaVenta_action = function(){
        
            Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
               $scope.salidasVentaList = data;
               console.log(data);
            });
            guardarSession("salidasVentaBuscar",$scope.salidasVentaBuscar);
       ocultarVentanaModal('#buscarsalidaVentaDialog');
    };
    
    
    
    
    
}
]);
});
