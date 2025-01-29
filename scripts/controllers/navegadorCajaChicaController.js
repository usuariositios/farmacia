define(['app'], function(app)
{
app.controller('navegadorCajaChicaController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {
    //try {
    
    $scope.cajaChicaBuscar = {};//cajaChicasBuscar
    $scope.cajaChica = {};//cajaChicasBuscar
    $scope.cajaChicaObj = {};//cajaChicasBuscar
    $scope.cajaChicaList = [];
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
        
    
    
    //tiene que cargar los datos de caja chica de la sesion
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    
    /*Data.get('/cajaChica/cajaChica').then(function(data){
         $scope.cajaChicasBuscar = data;
         $scope.cajaChicaObj = angular.copy(data);
         $scope.cajaChicasBuscar.filaInicial = 0;//de este floor a 10*/
         $scope.cajaChicaBuscar = angular.copy(obtenerSession("cajaChica"));
         //$scope.cajaChicaBuscar.estadoApertura.codApertura=0;
         $scope.cajaChicaBuscar.personal = angular.copy($scope.usuarioPersonal.personal);
         //$scope.cajaChicaObj = angular.copy(obtenerSession("cajaChica"));
         $scope.cajaChicaBuscar.filaInicial = 0;
         console.log($scope.cajaChicaBuscar);
         Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicaBuscar).then(function(data){
            $scope.cajaChicaList = data;
            console.log(data);
         });
    /*});*/
    
    //peticionar nueva caja chica
    Data.get('/cajaChica/cajaChica').then(function(data){
        $scope.cajaChicaObj = angular.copy(data);
        $scope.cajaChicaObj.personal = angular.copy($scope.cajaChicaBuscar.personal);
    });
    
    
    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
        $scope.tablaDetalle = data;

        $scope.tablaDetalle.tabla.nombreTabla = "CAJA";

        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.cajaList = data;
            console.log(data);
        });        
    });
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.cajaChicaBuscar);
        $scope.cajaChicaBuscar.filaInicial = parseInt($scope.cajaChicaBuscar.filaInicial) + 10;
        sessionStorage.setItem("cajaChicas",  JSON.stringify($scope.cajaChicaBuscar));
        Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicaBuscar).then(function(data){
            $scope.cajaChicaList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.cajaChicaBuscar.filaInicial = parseInt($scope.cajaChicaBuscar.filaInicial) - 10;
        sessionStorage.setItem("cajaChicas",  JSON.stringify($scope.cajaChicaBuscar));
        Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicaBuscar).then(function(data){
            $scope.cajaChicaList = data;
            console.log(data);
         });
    };
    $scope.agregarCajaChica_action = function() {
        
        $scope.cajaChica = angular.copy($scope.cajaChicaObj);
        $scope.cajaChica.estadoApertura.codApertura=1;
        $scope.cajaChica.estadoApertura.nombreApertura="ABIERTO";
        
        mostrarVentanaModal("agregarCajaChicaDialog");
        //$('#agregarCajaChicaDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();    
    };
    
    $scope.editarCajaChica_action = function(c){
        if(c.estadoApertura.codApertura===2){
            $.growl.warning({title:"ADVERTENCIA!", message: " La caja esta cerrada "});//+ nroSalidasVenta
            return;
        }
        guardarSession("cajaChica",c);
        $location.path("navegadorCajaChicaDetalle");        
    }; 
    $scope.guardarCajaChica_action = function() {
        //$scope.cajaChica.logotipoCajaChica = $scope.cajaChica.logotipoCajaChica.replace("data:image/jpeg;base64,","");//reemplaza la primera ocurrencia
        Data.post('/cajaChica/guardarCajaChica', $scope.cajaChica).then(function(data){
                    
                        $scope.cajaChicasBuscar = angular.copy(obtenerSession("cajaChica"));
                        $scope.cajaChicasBuscar.estadoApertura.codApertura = 1;//todas las cajas chicas activas del usuario                        
                        $scope.cajaChicasBuscar.personal = angular.copy($scope.usuarioPersonal.personal); ////debe ser con la fecha actual
                        
                        console.log($scope.cajaChicasBuscar);         
                        Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicasBuscar).then(function(data){
                           
                           if(data.length>0){
                               guardarSession("cajaChica",data[0]);
                           }
                           else{
                               //$scope.cajaChicaObj.personal= angular.copy($scope.usuarioPersonal.personal);
                               //$scope.cajaChicaObj.personal.codPersonal =0.4;//para validaciones
                               guardarSession("cajaChica",angular.copy($scope.cajaChicaObj));//la lista no tiene objetos
                           }
                           
                        });
                    
            $('#agregarCajaChicaDialog').modal('hide');
            Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicaBuscar).then(function(data){
                $scope.cajaChicaList = data;
                console.log(data);
            });
        });
    };
    /*$scope.editarCajaChica_action = function(e){*/
        /*var i=0;
        for(i=0;i<$scope.cajaChicaList.length;i++){
            if($scope.cajaChicaList[i].checked===true){
                $scope.cajaChica = angular.copy($scope.cajaChicaList[i]);                
                break;
            }
        }*/
        /*$scope.cajaChica = angular.copy(e);
        mostrarVentanaModal("editarCajaChicaDialog");*/
        //$('#editarCajaChicaDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();        
        
    /*};*/
    
    $scope.guardarEditarCajaChica_action = function() {
        //$scope.cajaChica.logotipoCajaChica = $scope.cajaChica.logotipoCajaChica.replace("data:image/jpeg;base64,","");//reemplaza la primera ocurrencia
        Data.post('/cajaChica/editarCajaChica', $scope.cajaChica).then(function(data){            
            $('#editarCajaChicaDialog').modal('hide');
            Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicaBuscar).then(function(data){
                $scope.cajaChicaList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarCajaChica_action = function(e){
        /*var i=0;
        for(i=0;i<$scope.cajaChicaList.length;i++){
            if($scope.cajaChicaList[i].checked===true){
                $scope.cajaChica = angular.copy($scope.cajaChicaList[i]);
                 Data.post('/cajaChica/eliminarCajaChica', $scope.cajaChica).then(function(data){
                    Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicasBuscar).then(function(data){
                        $scope.cajaChicaList = data;
                        console.log(data);
                    });
                });
                break;
            }
        }*/
        if(confirm("Esta seguro de eliminar la CajaChica?")===false){
            return;
        }
        
        $scope.cajaChica = angular.copy(e);
        Data.post('/cajaChica/eliminarCajaChica', $scope.cajaChica).then(function (data) {
            Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicaBuscar).then(function (data) {
                $scope.cajaChicaList = data;
                console.log(data);
            });
        });
    };
    $scope.cerrarCajaChica_action = function(c){        
        
        
        
        $scope.cajaChica = angular.copy(c);
        Data.get('/cajaChicaDetalle/cajaChicaDetalle').then(function(data){
         $scope.cajaChicaDetalleBuscar = data;
         
         $scope.cajaChicaDetalleBuscar.cajaChica = angular.copy($scope.cajaChica);
            var monto = $scope.cajaChica.montoInicial;         
            var i = 0;
            $scope.cajaChica.montoIngresos = 0;
            $scope.cajaChica.montoEgresos = 0;
            Data.post("/cajaChicaDetalle/cargarCajaChicaDetalle", $scope.cajaChicaDetalleBuscar).then(function(data){
               $scope.cajaChicaDetalleList = data;
               for(i=0;i<$scope.cajaChicaDetalleList.length;i++){
                   monto = monto + $scope.cajaChicaDetalleList[i].montoIngreso - $scope.cajaChicaDetalleList[i].montoEgreso;
                   $scope.cajaChica.montoIngresos = $scope.cajaChica.montoIngresos + $scope.cajaChicaDetalleList[i].montoIngreso;
                   $scope.cajaChica.montoEgresos = $scope.cajaChica.montoEgresos + $scope.cajaChicaDetalleList[i].montoEgreso;
               }
               $scope.cajaChica.montoSaldo = monto;
            });
        });
        mostrarVentanaModal("cerrarCajaChicaDialog");
    };
    $scope.guardarCerrarCajaChica_action = function(c){
        if(confirm("Esta seguro de cerrar la CajaChica?")===false){
            return;
        }
        $scope.cajaChica.estadoApertura.codApertura=2; //cerrado
        Data.post("/cajaChica/editarCajaChica", $scope.cajaChica).then(function(data){
            Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicaBuscar).then(function(data){
                $scope.cajaChicaList = data;
                console.log(data);
                ocultarVentanaModal("#cerrarCajaChicaDialog");
            });
        });
        
    };
    
    $scope.mostrarBuscarCajaChica_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarCajaChicaDialog");
    };
    $scope.buscarCajaChica_action = function(){
        Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicaBuscar).then(function (data) {
                $scope.cajaChicaList = data;
                console.log(data);
        });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarCajaChicaDialog");
    };
    
    
    
    }
    ]);
});