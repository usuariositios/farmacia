define(['app'], function(app)
{
app.controller('reporteLibroComprasController',
    ['$scope','Data','$location','$window',
function ($scope, Data, $location,$window) {
    
    $scope.ingresosAlmacen = {};
    $scope.productosBuscar = {};
    $scope.datosReporte = {codGestion:0,
                           nombreGestion:"",
                           codMes:0,
                           nombreMes:""                           
                           };
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
        $scope.tablaDetalleTiposVenta = data;

        $scope.tablaDetalleTiposVenta.tabla.nombreTabla = "MES_GESTION";

        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalleTiposVenta).then(function (mesesList) {
            $scope.mesesList = mesesList;
            console.log(mesesList);
        });
    });
    
    Data.get('/gestion/cargarGestionItem').then(function(gestionList){
        $scope.gestionList = gestionList;
    });
    
    $scope.verReporte = function(){
        $scope.datosReporte.nombreGestion = $("#codGestion option:selected").text();
        $scope.datosReporte.nombreMes = $("#codMes option:selected").text();
        
        //window.open("http://localhost:8080/VENTAS_REPORTES/kardexMovimiento/reporteKardexMovimiento.jsp?codProducto="+m.codProducto +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal, '_blank', 'location=yes,height=570,width=1300,scrollbars=yes,status=yes');        
        $window.open(pathFarmaciaReportes+"/libroCompras/reporteLibroCompras.jsp?codGestion="+$scope.datosReporte.codGestion +"&nombreGestion="+$scope.datosReporte.nombreGestion.trim()+ "&codMes="+$scope.datosReporte.codMes +"&nombreMes="+$scope.datosReporte.nombreMes.trim()+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
    };
    $scope.verReporteRecibos_action = function(){
        $scope.datosReporte.nombreGestion = $("#codGestion option:selected").text();
        $scope.datosReporte.nombreMes = $("#codMes option:selected").text();        
        
        $window.open(pathFarmaciaReportes+"/reciboCompras/reporteReciboCompras.jsp?codGestion="+$scope.datosReporte.codGestion +"&nombreGestion="+$scope.datosReporte.nombreGestion.trim()+ "&codMes="+$scope.datosReporte.codMes +"&nombreMes="+$scope.datosReporte.nombreMes.trim()+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
    };
    
}
        ]);
});

