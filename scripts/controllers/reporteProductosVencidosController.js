define(['app'], function(app)
{
app.controller('reporteProductosVencidosController',
    ['$scope','Data','$location','$window',
function ($scope, Data, $location,$window) {
    
    $scope.ingresosAlmacen = {};
    $scope.productosBuscar = {};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.datosReporte = {                           
                           codGestion:$scope.usuarioPersonal.gestion.codGestion,                           
                           codAlmacenVenta:$scope.usuarioPersonal.almacenesVenta.codAlmacenVenta,
                           nombreAlmacenVenta:$scope.usuarioPersonal.almacenesVenta.nombreAlmacenVenta,
                           codEmpresa:$scope.usuarioPersonal.empresas.codEmpresa,
                           diasPorVencer:0
                           };
    
    console.log($scope.usuarioPersonal);
    
    $scope.verReporte = function(){
        if(parseInt($scope.datosReporte.diasPorVencer)<0){
            $.growl.warning({title:"ADVERTENCIA!", message: "Ingrese un valor valido"});
            return false;
        }
        
        $window.open(pathFarmaciaReportes+"/productosVencidos/reporteProductosVencidos.jsp?codGestion="+$scope.datosReporte.codGestion +                
                "&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+
                "&codEmpresa="+$scope.datosReporte.codEmpresa+
                "&diasPorVencer="+$scope.datosReporte.diasPorVencer
                );
    };
}
        ]);
});

