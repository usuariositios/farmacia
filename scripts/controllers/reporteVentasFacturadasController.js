define(['app'], function(app)
{
app.controller('reporteVentasFacturadasController',
    ['$scope','Data','$location','$window',
function ($scope, Data, $location,$window) {
    
    $scope.ingresosAlmacen = {};
    $scope.productosBuscar = {};
    $scope.datosReporte = {codCliente:0,
                           codTipoVenta:0,
                           fechaInicio:fechaActualDDMMYYYY(),
                           fechaFinal:fechaActualDDMMYYYY()                           
                           };
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.datosReporte.codAlmacenVenta = $scope.usuarioPersonal.almacenesVenta.codAlmacenVenta;
                           
    //autoclose: true
    $scope.datosReporte.fechaInicio = fechaActualDDMMYYYY().substring(2) ;
    $scope.datosReporte.fechaInicio = "01"+$scope.datosReporte.fechaInicio;//colocando el primer dia del mes
    
    
    
    $('#fecha_inicio .input-group.date').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
        
    }).datepicker("setDate",creaDate($scope.datosReporte.fechaInicio)).on('changeDate', function (e) {
                $scope.datosReporte.fechaInicio = formatoFecha(e.date);
            });
    $('#fecha_final .input-group.date').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
    
    }).datepicker("setDate",creaDate($scope.datosReporte.fechaFinal)).on('changeDate', function (e) {
                $scope.datosReporte.fechaFinal = formatoFecha(e.date);
            });
    Data.get('/cliente/cargarClienteItem').then(function(clientesList){
        $scope.clientesList = clientesList;
        
    });
    
    
    Data.get('/tablaDetalle/tablaDetalle').then(function (tablaDetalle) {
                        $scope.tablaDetalleTiposVenta = tablaDetalle;                        
                        $scope.tablaDetalleTiposVenta.tabla.nombreTabla = "TIPOS_VENTA";                        
                        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalleTiposVenta).then(function (data) {
                            $scope.tiposVentaList = data;
                            console.log(data);
                        });
                    });
    
    
    $scope.buscarProducto_action = function(){
        
        if (parseInt($scope.productosBuscar.grupoProducto.codGrupoProducto)===0 && $scope.productosBuscar.nombreProducto.trim().length < 3) {
                $.growl.warning({title:"ADVERTENCIA!", message: "ingrese al menos 3 caracteres del nombre de producto" });
                return null;
        }
            
        console.log($scope.productosBuscar);
        Data.post('/productos/cargarProductos', $scope.productosBuscar).then(function(data){
            console.log(data);
            $scope.productosList = data;
        });
        
        
    };
    
    $scope.verReporte = function(m){
        console.log($scope.datosReporte.fechaInicio);
        console.log($scope.datosReporte.fechaFinal);                
        $window.open("https://farmacia-reportes.herokuapp.com/ventasFacturadas/reporteVentasFacturadas.jsp?codCliente="+$scope.datosReporte.codCliente +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal+"&codTipoVenta="+$scope.datosReporte.codTipoVenta+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
    };
    
    
    
    
   
    
}
        ]);
});

