define(['app'], function(app)
{
app.controller('navegadorCajaChicaDetalleController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {
    //try {
    
    $scope.cajaChicaDetalleBuscar = {};//cajaChicaDetalleBuscar
    $scope.cajaChica = {};//cajaChicaDetalleBuscar
    $scope.cajaChicaDetalleObj = {};//cajaChicaDetalleBuscar
    $scope.cajaChicaDetalleList = [];
    $scope.estadosRegistroList = [];
    $scope.ciudadList = [];
    $scope.monedaList = [];
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    
    
    /*Data.get("/estadosRegistro/cargarEstadosRegistroItem").then(function(data){
            $scope.estadosRegistroList = data;
            $scope.estadosRegistroList.splice(0,0,item);
            console.log(data);
    });
    Data.get("/ciudad/cargarCiudadItem").then(function(data){
            $scope.ciudadList = data;
            $scope.ciudadList.splice(0,0,item);
            console.log(data);
    });
    Data.get("/moneda/cargarMonedasItem").then(function(data){
            $scope.monedaList = data;
            $scope.monedaList.splice(0,0,item);
            console.log(data);
    });*/
    
    $scope.cajaChica = obtenerSession("cajaChica");
    
    Data.get('/cajaChicaDetalle/cajaChicaDetalle').then(function(data){
         $scope.cajaChicaDetalleBuscar = data;
         $scope.cajaChicaDetalleObj = angular.copy(data);
         $scope.cajaChicaDetalleObj.cajaChica = angular.copy($scope.cajaChica);
         
         
         $scope.cajaChicaDetalleBuscar.cajaChica = angular.copy($scope.cajaChica);
         var monto = $scope.cajaChica.montoInicial;
         
         var i = 0;
         Data.post("/cajaChicaDetalle/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function(data){
            $scope.cajaChicaDetalleList = data;
            for(i=0;i<$scope.cajaChicaDetalleList.length;i++){
                monto = monto + $scope.cajaChicaDetalleList[i].montoIngreso - $scope.cajaChicaDetalleList[i].montoEgreso;
                $scope.cajaChicaDetalleList[i].montoSaldo = monto;
            }
            
         });
    });
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.cajaChicaDetalleBuscar);
        $scope.cajaChicaDetalleBuscar.filaInicial = parseInt($scope.cajaChicaDetalleBuscar.filaInicial) + 10;
        sessionStorage.setItem("cajaChicaDetalle",  JSON.stringify($scope.cajaChicaDetalleBuscar));
        Data.post("/cajaChica/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function(data){
            $scope.cajaChicaDetalleList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.cajaChicaDetalleBuscar.filaInicial = parseInt($scope.cajaChicaDetalleBuscar.filaInicial) - 10;
        sessionStorage.setItem("cajaChicaDetalle",  JSON.stringify($scope.cajaChicaDetalleBuscar));
        Data.post("/cajaChica/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function(data){
            $scope.cajaChicaDetalleList = data;
            console.log(data);
         });
    };
    $scope.agregarCajaChicaDetalle_action = function() {
        
        
        $scope.cajaChicaDetalle = angular.copy($scope.cajaChicaDetalleObj);
        $scope.cajaChicaDetalle.fechaCajaChicaDetalle = obtieneFechaActual();
        mostrarVentanaModal("agregarCajaChicaDetalleDialog");
        //$('#agregarCajaChicaDetalleDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();    
    };
    $scope.guardarCajaChicaDetalle_action = function() {
        //$scope.cajaChicaDetalle.estadosRegistro.codEstado = 1;
        //$scope.cajaChica.logotipoCajaChicaDetalle = $scope.cajaChica.logotipoCajaChicaDetalle.replace("data:image/jpeg;base64,","");//reemplaza la primera ocurrencia
        Data.post('/cajaChicaDetalle/guardarCajaChicaDetalle', $scope.cajaChicaDetalle).then(function(data){
            $('#agregarCajaChicaDetalleDialog').modal('hide');
            Data.post("/cajaChicaDetalle/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function(data){
                $scope.cajaChicaDetalleList = data;
                var monto = $scope.cajaChica.montoInicial;         
                var i = 0;
                for(i=0;i<$scope.cajaChicaDetalleList.length;i++){
                    monto = monto + $scope.cajaChicaDetalleList[i].montoIngreso - $scope.cajaChicaDetalleList[i].montoEgreso;
                    $scope.cajaChicaDetalleList[i].montoSaldo = monto;
                }
                console.log(data);
            });
        });
    };
    $scope.editarCajaChicaDetalle_action = function(c){
        /*var i=0;
        for(i=0;i<$scope.cajaChicaDetalleList.length;i++){
            if($scope.cajaChicaDetalleList[i].checked===true){
                $scope.cajaChica = angular.copy($scope.cajaChicaDetalleList[i]);                
                break;
            }
        }*/
        $scope.cajaChicaDetalle = angular.copy(c);
        mostrarVentanaModal("editarCajaChicaDetalleDialog");
        //$('#editarCajaChicaDetalleDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();        
        
    };
    
    $scope.guardarEditarCajaChicaDetalle_action = function() {
        //$scope.cajaChica.logotipoCajaChicaDetalle = $scope.cajaChica.logotipoCajaChicaDetalle.replace("data:image/jpeg;base64,","");//reemplaza la primera ocurrencia
        Data.post('/cajaChicaDetalle/editarCajaChicaDetalle', $scope.cajaChicaDetalle).then(function(data){            
            $('#editarCajaChicaDetalleDialog').modal('hide');
            Data.post("/cajaChicaDetalle/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function(data){
                $scope.cajaChicaDetalleList = data;
                var monto = $scope.cajaChica.montoInicial;         
                var i = 0;
                for(i=0;i<$scope.cajaChicaDetalleList.length;i++){
                    monto = monto + $scope.cajaChicaDetalleList[i].montoIngreso - $scope.cajaChicaDetalleList[i].montoEgreso;
                    $scope.cajaChicaDetalleList[i].montoSaldo = monto;
                }
                console.log(data);
            });
        });
    };
    $scope.eliminarCajaChicaDetalle_action = function(e){
        /*var i=0;
        for(i=0;i<$scope.cajaChicaDetalleList.length;i++){
            if($scope.cajaChicaDetalleList[i].checked===true){
                $scope.cajaChica = angular.copy($scope.cajaChicaDetalleList[i]);
                 Data.post('/cajaChica/eliminarCajaChicaDetalle', $scope.cajaChica).then(function(data){
                    Data.post("/cajaChica/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function(data){
                        $scope.cajaChicaDetalleList = data;
                        console.log(data);
                    });
                });
                break;
            }
        }*/
        if(confirm("Esta seguro de eliminar la CajaChicaDetalle?")===false){
            return;
        }
        
        $scope.cajaChica = angular.copy(e);
        Data.post('/cajaChica/eliminarCajaChicaDetalle', $scope.cajaChica).then(function (data) {
            Data.post("/cajaChica/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function (data) {
                $scope.cajaChicaDetalleList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarCajaChicaDetalle_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarCajaChicaDetalleDialog");
    };
    $scope.buscarCajaChicaDetalle_action = function(){
        Data.post("/cajaChica/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function (data) {
                $scope.cajaChicaDetalleList = data;
                console.log(data);
        });         
         ocultarVentanaModal("#buscarCajaChicaDetalleDialog");
    };
    $scope.cancelar_action = function() {
        $location.path("navegadorCajaChica");
        
    };
    
    
    }
    ]);
});