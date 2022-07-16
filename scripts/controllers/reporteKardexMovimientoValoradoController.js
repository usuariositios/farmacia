define(['app'], function(app)
{
app.controller('reporteKardexMovimientoValoradoController',
    ['$scope','Data','$location','$window',
function ($scope, Data, $location,$window) {
    
    $scope.ingresosAlmacen = {};
    $scope.productosBuscar = {};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.datosReporte = {codProducto:0,
                           fechaInicio:$scope.usuarioPersonal.gestion.fechaInicio,
                           fechaFinal:fechaActualDDMMYYYY(),
                           codAlmacenVenta:0                           
                           };
    
    console.log($scope.usuarioPersonal.gestion);
    $scope.datosReporte.codAlmacenVenta = $scope.usuarioPersonal.almacenesVenta.codAlmacenVenta;
                           
    //autoclose: true
    //$scope.datosReporte.fechaInicio = fechaActualDDMMYYYY().substring(2) ;
    //$scope.datosReporte.fechaInicio = "01"+$scope.datosReporte.fechaInicio;//colocando el primer dia del mes
    
    
    
    $('#fecha_inicio .input-group.date').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
        
    }).datepicker("setDate",creaDate($scope.datosReporte.fechaInicio))
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
    
    
    Data.get('/productos/productos').then(function(data){
        $scope.productosBuscar = data;
        
    });
    
    
    Data.get('/gruposProducto/cargarGruposProductoItem').then(function(data){
            console.log(data);
            $scope.gruposProductoList = data;
    });
    
   
    $scope.buscarProducto_action = function(){
        
        /*if (parseInt($scope.productosBuscar.grupoProducto.codGrupoProducto)===0 && $scope.productosBuscar.nombreProducto.trim().length < 3) {
                $.growl.warning({title:"ADVERTENCIA!", message: "ingrese al menos 3 caracteres del nombre de producto" });
                return null;
        }*/
            
        console.log($scope.productosBuscar);
        Data.post('/productos/cargarProductos', $scope.productosBuscar).then(function(data){
            console.log(data);
            $scope.productosList = data;
        });
        
        
    };
    
    $scope.verReporte = function(m){
        console.log($scope.datosReporte.fechaInicio);
        console.log($scope.datosReporte.fechaFinal);
        //window.open("http://localhost:8080/VENTAS_REPORTES/kardexMovimiento/reporteKardexMovimiento.jsp?codProducto="+m.codProducto +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal, '_blank', 'location=yes,height=570,width=1300,scrollbars=yes,status=yes');        
        $window.open("/FARMACIA_REPORTES/kardexMovimientoValorado/reporteKardexMovimientoValorado.jsp?codProducto="+m.codProducto +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal+"&nombreProducto="+m.nombreProducto+"&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
    };
    
    
    
    
   
    
}
        ]);
});

