define(['app'], function(app)
{
app.controller('reporteIngresosAlmacenController',
    ['$scope','Data','$location','$window',
function ($scope, Data, $location,$window) {
    
    $scope.ingresosAlmacen = {};
    $scope.productosBuscar = {};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.datosReporte = {codProducto:0,
                           fechaInicio:$scope.usuarioPersonal.gestion.fechaInicio,
                           fechaFinal:fechaActualDDMMYYYY(),
                           codAlmacenVenta:$scope.usuarioPersonal.almacenesVenta.codAlmacenVenta,
                           codGestion:$scope.usuarioPersonal.gestion.codGestion,
                           codEmpresa:$scope.usuarioPersonal.empresas.codEmpresa
                           };
      $scope.productosList=[];
    
    console.log($scope.usuarioPersonal.gestion);
    //$scope.datosReporte.codAlmacenVenta = $scope.usuarioPersonal.almacenesVenta.codAlmacenVenta;
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
    
    
    /*Data.get('/gruposProducto/cargarGruposProductoItem').then(function(data){
            console.log(data);
            $scope.gruposProductoList = data;
    });*/
    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
        $scope.tablaDetalle = data;        
        $scope.tablaDetalle.tabla.nombreTabla = "CATEGORIAS_PRODUCTO";
            Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
                $scope.categoriasProductoList = data;
                console.log(data);
            });
         
    });
   
    $scope.buscarProducto_action = function(){
        
        /*if (parseInt($scope.productosBuscar.grupoProducto.codGrupoProducto)===0 && $scope.productosBuscar.nombreProducto.trim().length < 3) {
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
    
    $scope.verReporte_action = function(){
        //console.log($scope.datosReporte.fechaInicio);
        //console.log($scope.datosReporte.fechaFinal);
        var productos = "0";
        for (var i = 0; i < $scope.productosList.length; i++) {
            if($scope.productosList[i].checked===true){
                productos += ","+$scope.productosList[i].producto.codProducto;
                }
        }
        //window.open("http://localhost:8080/VENTAS_REPORTES/kardexMovimiento/reporteKardexMovimiento.jsp?codProducto="+m.codProducto +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal, '_blank', 'location=yes,height=570,width=1300,scrollbars=yes,status=yes');        
        $window.open(pathFarmaciaReportes+"/ingresosAlmacen/reporteIngresosAlmacen.jsp?codProducto="+productos +
                "&fechaInicio="+$scope.datosReporte.fechaInicio +
                "&fechaFinal="+$scope.datosReporte.fechaFinal+                
                "&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+
                "&codEmpresa="+$scope.datosReporte.codEmpresa+
                "&codGestion="+$scope.datosReporte.codGestion);
    };
    $scope.verReporteProducto_action = function(m){
        //console.log($scope.datosReporte.fechaInicio);
        //console.log($scope.datosReporte.fechaFinal);
        //window.open("http://localhost:8080/VENTAS_REPORTES/kardexMovimiento/reporteKardexMovimiento.jsp?codProducto="+m.codProducto +"&fechaInicio="+$scope.datosReporte.fechaInicio +"&fechaFinal="+$scope.datosReporte.fechaFinal, '_blank', 'location=yes,height=570,width=1300,scrollbars=yes,status=yes');        
        
        $window.open(pathFarmaciaReportes+"/ingresosAlmacen/reporteIngresosAlmacen.jsp?codProducto="+m.codProducto +
                "&fechaInicio="+$scope.datosReporte.fechaInicio +
                "&fechaFinal="+$scope.datosReporte.fechaFinal+                
                "&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+
                "&codEmpresa="+$scope.datosReporte.codEmpresa+
                "&codGestion="+$scope.datosReporte.codGestion);
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

