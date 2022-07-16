define(['app'], function(app)
{
app.controller('navegadorIngresosVentaDevolucionController',
    ['$scope','Data','$location','$q',
    function ($scope, Data,$location,$q) {
    
    console.log($);
    //try {    
    $scope.ingresosVenta = {};//ingresosVentaBuscar
    $scope.ingresosVentaBuscar = {};//ingresosVentaBuscar
    $scope.ingresosVentaList = [];
    $scope.tiposDocumentoList = [];
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.ingresosVentaBusiness = {};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.devolucionesList = {};
    
    
    /*Data.get('/ingresosVenta/ingresosVenta').then(function(data){
         $scope.ingresosVenta = data;
         $scope.ingresosVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);//agregar almacenesVenta
         $scope.ingresosVenta.gestion = angular.copy($scope.usuarioPersonal.gestion);
         $scope.ingresosVenta.filaInicial = 0;//de este floor a 10
         $scope.ingresosVenta.tiposIngresoVenta.codTipoIngresoVenta = 3;//por devolucion
         
         
        $scope.ingresosVentaBuscar = angular.copy($scope.ingresosVenta);
        $scope.ingresosVentaBuscar.fechaIngresoVentaInicio = "";
        $scope.ingresosVentaBuscar.fechaIngresoVentaFinal = "";
        
         console.log($scope.ingresosVentaBuscar);
         console.log($scope.ingresosVenta);
         Data.post("/ingresosVenta/cargarIngresosVenta", $scope.ingresosVentaBuscar).then(function(data){
            $scope.ingresosVentaList = data;
            console.log(data);
         });
         
    });*/
    Data.get('/devolucion/cargarDevolucion').then(function(data){        
        $scope.devolucionesList = data;
        console.log($scope.devolucionesList);
    });
    
    
    Data.get('/proveedores/cargarProveedoresItem').then(function(data){
        $scope.proveedoresList = data;
        $scope.proveedoresList.splice(0,0,item);
    });
    Data.get("/tablaDetalle/tablaDetalle").then(function (data) {
        $scope.tablaDetalleEstado = angular.copy(data);
        $scope.tablaDetalleEstado.tabla.nombreTabla = "ESTADOS_INGRESO_VENTA";
        Data.post('/tablaDetalle/cargarTablaDetalle',$scope.tablaDetalleEstado).then(function(data){
            $scope.estadosIngresoVentaList = data;
            $scope.estadosIngresoVentaList.splice(0,0,item);
        });
    });
    
        Data.get('/tiposDocumento/cargarTiposDocumentoItem').then(function(data){
            $scope.tiposDocumentoList = data;

        });
        Data.get('/salidasVentaDetalleIngreso/salidasVentaDetalleIngreso').then(function(data){
            $scope.salidasVentaDetalleIngreso = data;            
        });
        
        
    
    
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.ingresosVentaBuscar);
        $scope.ingresosVentaBuscar.filaInicial = parseInt($scope.ingresosVentaBuscar.filaInicial) + 10;
        sessionStorage.setItem("ingresosVenta",  JSON.stringify($scope.ingresosVentaBuscar));
        Data.post("/ingresosVenta/cargarIngresosVenta", $scope.ingresosVentaBuscar).then(function(data){
            $scope.ingresosVentaList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.ingresosVentaBuscar.filaInicial = parseInt($scope.ingresosVentaBuscar.filaInicial) - 10;
        sessionStorage.setItem("ingresosVenta",  JSON.stringify($scope.ingresosVentaBuscar));
        Data.post("/ingresosVenta/cargarIngresosVenta", $scope.ingresosVentaBuscar).then(function(data){
            $scope.ingresosVentaList = data;
            console.log(data);
         });
    };
    $scope.agregarIngresoVenta_action = function() {        
        //window.location = "agregarIngresosVenta.html";
        //$location.path("agregarIngresosVenta");
        mostrarVentanaModal("agregarIngresoVentaDialog");
    };
    $scope.seleccionarTipoDocumento_action = function(t) {
        guardarSession("tipoDocumentoSeleccionado",t);
        $location.path("agregarIngresosVenta");
        ocultarVentanaModal("#agregarIngresoVentaDialog");
    };
    $scope.editarIngresoVenta_action = function(){
        //validar
        var i=0;        
        for(i=0;i<$scope.ingresosVentaList.length;i++){
            if($scope.ingresosVentaList[i].checked===true){                
                //sessionStorage.setItem("ingresosVentaEditar",  JSON.stringify(angular.copy($scope.ingresosVentaList[i])));
                guardarSession("ingresosVentaEditar",$scope.ingresosVentaList[i]);
                break;
            }
        }
        $location.path("editarIngresosVenta");
        //window.location = "editarIngresoVenta.html";
    };
    $scope.editarIngresoVenta3_action = function(ia){
        //validar        
         $scope.salidasVentaDetalleIngreso.ingresosVentaDetalle.ingresosVenta = angular.copy(ia);
         $q.all([
            Data.post("/salidasVentaDetalleIngreso/buscarSalidasVentaDetalleIngreso", $scope.salidasVentaDetalleIngreso).then(function(data){
                $scope.salidasVentaDetalleIngresosList = data;
                console.log(data);
            })

        ]).then(function () {            
            if($scope.salidasVentaDetalleIngresosList.length>0){
                var i=0;
                var nroSalidasVenta = "";
                for(i=0;i<$scope.salidasVentaDetalleIngresosList.length;i++){
                    nroSalidasVenta =nroSalidasVenta+" " +$scope.salidasVentaDetalleIngresosList[i].salidasVentaDetalle.salidasVenta.nroSalidaVenta;
                }
                $.growl.warning({title:"ADVERTENCIA!", message: "no se puede editar, existen salidas relacionadas: nro "+ nroSalidasVenta });
                return null;
            }else{
                console.log(ia);
                var tipoDocumentoSeleccionado = angular.copy(item);
                tipoDocumentoSeleccionado.codItem = ia.codLibroCompras!==0?1:
                tipoDocumentoSeleccionado.codItem = ia.codReciboCompras!==0?2:0;
                guardarSession("tipoDocumentoSeleccionado",tipoDocumentoSeleccionado);
                //sessionStorage.setItem("ingresosVentaEditar",  JSON.stringify(angular.copy(ia)));
                guardarSession("ingresosVentaEditar",ia);
                $location.path("editarIngresosVenta");
                //window.location = "editarIngresoVenta.html";
            }
            
        });
        
    };
    $scope.mostrarBuscarIngresoVenta_action = function(){        
        //$('#buscaringresoVentaDialog').modal('show');
        //appending modal background inside the bigform-content
        //$('.modal-backdrop').appendTo('.container');
        //removing body classes to able click events
        //$('body').removeClass();
        console.log("entro mostrar:");
        mostrarVentanaModal("buscaringresoVentaDialog");
    };
    $scope.buscarIngresoVenta_action = function(){
        Data.post("/ingresosVenta/cargarIngresosVenta", $scope.ingresosVentaBuscar).then(function(data){
            $scope.ingresosVentaList = data;
            console.log(data);
         });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscaringresoVentaDialog");
    };
    $scope.eliminarIngresoVenta_action = function(ia){
        console.log("entro eliminar");
        if(confirm("esta seguro de eliminar?")===false){
            return;
        }
        $scope.salidasVentaDetalleIngreso.ingresosVentaDetalle.ingresosVenta = angular.copy(ia);
        $q.all([
            Data.post("/salidasVentaDetalleIngreso/buscarSalidasVentaDetalleIngreso", $scope.salidasVentaDetalleIngreso).then(function(data){
                $scope.salidasVentaDetalleIngresosList = data;
                console.log(data);
            })
        ]).then(function () {
            if($scope.salidasVentaDetalleIngresosList.length>0){
                var i=0;
                var nroSalidasVenta = "";
                for(i=0;i<$scope.salidasVentaDetalleIngresosList.length;i++){
                    nroSalidasVenta =nroSalidasVenta+" " +$scope.salidasVentaDetalleIngresosList[i].salidasVentaDetalle.salidasVenta.nroSalidaVenta;
                }
                $.growl.warning({title:"ADVERTENCIA!", message: "no se puede editar, existen salidas relacionadas: nro "+ nroSalidasVenta });
                return null;
            }else{
                $scope.ingresosVentaBusiness.ingresosVenta = angular.copy(ia);
                //$scope.ingresosVentaBusiness.ingresosVentaDetalleList = angular.copy($scope.salidasVentaDetalleList);

                Data.post("/ingresosVenta/eliminarIngresosVentaBusiness", $scope.ingresosVentaBusiness).then(function(data){
                    $scope.ingresosVentaList = data;
                    Data.post("/ingresosVenta/cargarIngresosVenta", $scope.ingresosVentaBuscar).then(function(data){
                        $scope.ingresosVentaList = data;
                        console.log(data);
                    });
                 });
            }
            
        });
        
        
    };
    
    }
    ]);
});