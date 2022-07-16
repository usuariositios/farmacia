define(['app'], function(app)
{
app.controller('reporteCuentasPorCobrarClienteController',
    ['$scope','Data','$location','$window',
function ($scope, Data, $location,$window) {
    
    $scope.ingresosAlmacen = {};
    $scope.productosBuscar = {};
    $scope.datosReporte = {codProducto:0,
                           fechaInicio:fechaActualDDMMYYYY(),
                           fechaFinal:fechaActualDDMMYYYY(),
                           codAlmacenVenta:0,
                           codCliente:0,
                           codGestion:0
                           };
    $scope.seleccionar = false;
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.datosReporte.codAlmacenVenta = $scope.usuarioPersonal.almacenesVenta.codAlmacenVenta;
    $scope.datosReporte.codGestion = $scope.usuarioPersonal.gestion.codGestion;
    
    console.log("entro reportes...");
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    Data.get('/cliente/cargarClienteItem').then(function(data){
        $scope.clienteList = data;
        $scope.clienteList.splice(0,0,item);
    });
    
                           
    //autoclose: true
    $('#fecha_inicio .input-group.date').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
        
    }).datepicker("setDate",creaDate(fechaActualDDMMYYYY()))
      .on('changeDate', function (e) {
                $scope.datosReporte.fechaInicio = formatoFecha(e.date);
            });
    $('#fecha_final .input-group.date').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
    
    }).datepicker("setDate",creaDate(fechaActualDDMMYYYY()))
            .on('changeDate', function (e) {
                $scope.datosReporte.fechaFinal = formatoFecha(e.date);
            });
   
    
    
    $scope.verReporte = function(m){
        console.log($scope.datosReporte.fechaInicio);
        console.log($scope.datosReporte.fechaFinal);
        console.log(m);
        
        
        //window.open("http://localhost:8080/VENTAS_REPORTES/kardexMovimiento/reporteKardexMovimiento.jsp?codProducto="+m.codProducto +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal, '_blank', 'location=yes,height=570,width=1300,scrollbars=yes,status=yes');        
        $window.open("/FARMACIA_REPORTES/cuentasPorCobrarClientes/reporteCuentasPorCobrarClientes.jsp?fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal+"&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa+"&codCliente="+$scope.datosReporte.codCliente+"&codGestion="+$scope.datosReporte.codGestion);
    };
    $scope.verReporteSeleccionados_action = function(m){
        console.log($scope.datosReporte.fechaInicio);
        console.log($scope.datosReporte.fechaFinal);
        var productos = "0";
        for (var i = 0; i < $scope.productosList.length; i++) {
            if($scope.productosList[i].checked===true){
                productos += ","+$scope.productosList[i].producto.codProducto;
                }
        }
        $window.open("/FARMACIA_REPORTES/cuentasPorCobrarClientes/reporteCuentasPorCobrarClientes.jsp?codProducto="+productos +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal+"&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa+"&codCliente="+$scope.datosReporte.codCliente);
    };
    
    $scope.seleccionar_action = function(){
        //console.log(" seleccionar "+$scope.seleccionar);
        for (var i = 0; i < $scope.productosList.length; i++) {
                $scope.productosList[i].checked = true;                //$scope.seleccionar
            }
        
    };
    
    
    
    
   
    
}
        ]);
});

