define(['app'], function(app)
{
app.controller('reporteVentasConsolidProdController',
    ['$scope','Data','$location','$window',
function ($scope, Data, $location,$window) {
    
    $scope.ingresosAlmacen = {};
    $scope.productosBuscar = {};
    $scope.datosReporte = {codProducto:0,
                           fechaInicio:fechaActualDDMMYYYY(),
                           fechaFinal:fechaActualDDMMYYYY(),
                           codAlmacenVenta:0
                           };
    $scope.seleccionar = false;
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.datosReporte.codAlmacenVenta = $scope.usuarioPersonal.almacenesVenta.codAlmacenVenta;
    console.log("entro reportes...");
    
    
                           
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
    
    
    Data.get('/productos/productos').then(function(data){
        $scope.productosBuscar = data;
        
    });
    
    
    /*Data.get('/gruposProducto/cargarGruposProductoItem').then(function(data){
            console.log(data);
            $scope.gruposProductoList = data;
    });*/
    
    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
        $scope.tablaDetalle = data;
        
        $scope.tablaDetalle.tabla.nombreTabla = "ACCION_TERAPEUTICA";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.accionTerapeuticaList = data;
            console.log(data);
        });
    });
    
   
    $scope.buscarProducto_action = function(){
        
        
        /*if ( $scope.productosBuscar.nombreProducto.trim().length < 3 && $scope.productosBuscar.grupoProducto.codGrupoProducto===0) {
                $.growl.warning({title:"ADVERTENCIA!", message: "ingrese al menos 3 caracteres del nombre de producto" });
                return null;
        }*/
            
        console.log($scope.productosBuscar);
        Data.post('/productos/cargarProductos', $scope.productosBuscar).then(function(data){
            console.log(data);
            var productoItemList = [];
            for (var i = 0; i < data.length; i++) {
                productoItemList.push({checked: false, producto: data[i]});//con el check
            }
            $scope.productosList = angular.copy(productoItemList);
        });
        
        
    };
    
    $scope.verReporte = function(m){
        console.log($scope.datosReporte.fechaInicio);
        console.log($scope.datosReporte.fechaFinal);
        console.log(m);
        
        
        //window.open("http://localhost:8080/VENTAS_REPORTES/kardexMovimiento/reporteKardexMovimiento.jsp?codProducto="+m.codProducto +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal, '_blank', 'location=yes,height=570,width=1300,scrollbars=yes,status=yes');        
        $window.open(pathFarmaciaReportes+"/ventasConsolidadoProducto/reporteVentasConsolidadoProducto.jsp?codProducto="+m.producto.codProducto +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal+"&nombreProducto="+m.producto.nombreProducto+"&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
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
        $window.open(pathFarmaciaReportes+"/ventasConsolidadoProducto/reporteVentasConsolidadoProducto.jsp?codProducto="+productos +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal+"&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
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

