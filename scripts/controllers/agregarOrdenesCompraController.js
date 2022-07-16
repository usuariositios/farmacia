define(['app'], function(app)
{
app.controller('agregarOrdenesCompraController',
    ['$scope','Data','$location','$timeout', 
        function ($scope, Data, $location,$timeout) {
    
    $scope.ordenesCompra = {};
    $scope.productos = {};
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.ordenesCompraDetalleList = [];
    $scope.ordenesCompraBusiness ={};
    $scope.subGruposList = [];
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    
    
   
    
    
    //$scope.ordenesCompra =JSON.parse(sessionStorage.getItem("ordenesCompraEditar"));
    //console.log($scope.ordenesCompra);    
    
    Data.get("/ordenesCompra/ordenesCompra").then(function(data) {
            console.log(data);
            
            
            $scope.ordenesCompra = data;
            
            $scope.ordenesCompra.estadosRegistro.codEstado= 1;
            $scope.ordenesCompra.estadosOrdenCompra.codEstadoOrdenCompra= 1;
            $scope.ordenesCompra.gestiones = angular.copy($scope.usuarioPersonal.gestion);
            Data.post("/ordenesCompra/nroOrdenCompra",$scope.ordenesCompra).then(function(data) {                
                $scope.ordenesCompra.nroOrdenCompra = data;        
            });
    });
    
    
    
    
    
    
    Data.get('/productos/cargarProductosItem').then(function(data){
        $scope.productosList = data;
        $scope.productosList.splice(0,0,item);
    });    
    Data.get('/moneda/cargarMonedasItem').then(function(data){
        $scope.monedasList = data;
        $scope.monedasList.splice(0,0,item);
    });    
    Data.get('/proveedores/cargarProveedoresItem').then(function(data){
        $scope.proveedoresList = data;
        $scope.proveedoresList.splice(0,0,item);
    });
    
    Data.get('/tiposCompra/cargarTiposCompraItem').then(function(data){
        $scope.tiposCompraList = data;
        $scope.tiposCompraList.splice(0,0,item);
    });
    
            
    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
        $scope.tablaDetalle = data;

        $scope.tablaDetalle.tabla.nombreTabla = "TIPOS_ENVASE";

        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.tiposEnvaseList = data;
            console.log(data);
        });
    });
    
    Data.get('/ordenesCompraDetalle/ordenesCompraDetalle').then(function(data){
        $scope.ordenesCompraDetalle = data;
        console.log($scope.ordenesCompraDetalle);
    });
    
   $('#fecha_emision input').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true
        
    }).on('changeDate', function(e) {
        console.log(e);//e here contains the extra attributes
        //console.log(e.date.getDate());//e here contains the extra attributes        
        //console.log(e.date.getMonth());//e here contains the extra attributes
        //console.log(e.date.getFullYear());//e here contains the extra attributes
        $scope.ordenesCompra.fechaEmision = formatoFecha(e.date);//funcion definida en lib/jquery.funciones/jquery.funciones.js
        
    });
   $('#fecha_entrega input').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true
        
    }).on('changeDate', function(e) {
        console.log(e);//e here contains the extra attributes
        $scope.ordenesCompra.fechaEntrega = formatoFecha(e.date);
        
    });
    
    
    $scope.agregarProducto_action = function(){
        $scope.productosBuscarList=[];
        
        console.log($scope.productosBuscar);
        mostrarVentanaModal("agregarProductoDialog");
    };
    
    $scope.buscarProducto_action = function(){
        
        
        //colocar en string los codproducto para que no se tomen en cuenta
        var i = 0;
        var codProducto = "0";
        for(i=0;i<$scope.ordenesCompraDetalleList.length;i++){
            codProducto =codProducto +","+ $scope.ordenesCompraDetalleList[i].productos.codProducto;
        }
        $scope.productosBuscar.sinCodProducto = codProducto;//sin los productos
        console.log("sin cod producto: "+$scope.productosBuscar.sinCodProducto);
        
        
        $scope.productosBuscarList = [];
        Data.post('/productos/cargarProductos', $scope.productosBuscar).then(function(data){
            $scope.productosBuscarList = data;
        });
        
    };
    Data.get('/productos/productos').then(function(data){
        $scope.producto = data;
        console.log($scope.producto);
    });
    
    $scope.guardarOrdenCompra_action = function(){
        //validaciones
        for(i=0;i<$scope.ordenesCompraDetalleList.length;i++){
                delete $scope.ordenesCompraDetalleList[i].tempCodProducto;
                delete $scope.ordenesCompraDetalleList[i].tempCantidadNeta;
            }
            $scope.ordenesCompraBusiness.ordenesCompra = angular.copy($scope.ordenesCompra);
            $scope.ordenesCompraBusiness.ordenesCompraDetalleList = angular.copy($scope.ordenesCompraDetalleList);
            
            Data.post("/ordenesCompra/guardarOrdenesCompraBusiness", $scope.ordenesCompraBusiness).then(function(data){
                    $location.path("navegadorOrdenesCompra");
                });
            
    };
    
    $scope.cancelar_action = function(){
        //window.location = "navegadorOrdenesCompra.html";
        $location.path("navegadorOrdenesCompra");
    };
    $scope.agregarProducto_action = function(){
        
        var ocd = angular.copy($scope.ordenesCompraDetalle);
        ocd.tiposEnvase.codTipoEnvase = 1;
        ocd.tempCodProducto = 0;
        ocd.tempCantidadNeta = 1;
        ocd.fechaFabricacion = fechaActualDDMMYYYY();
        ocd.fechaVencimiento = fechaActualDDMMYYYY();
        console.log(ocd);
        $scope.ordenesCompraDetalleList.push(ocd);
    };
    $scope.borrarOrdenCompraDetalle_action = function(ocd){
        var i = 0;
        for(i=0;i<$scope.ordenesCompraDetalleList.length;i++){
            if(parseInt($scope.ordenesCompraDetalleList[i].productos.codProducto) === parseInt(ocd.productos.codProducto)){
                $scope.ordenesCompraDetalleList.splice(i,1);//eliminar un elemento en el indice i
            }
        }
    };
    $scope.producto_change = function(ocd){
        console.log(ocd);
        //buscar el producto
        var productoBuscar = angular.copy($scope.producto);
        productoBuscar.codProducto = ocd.tempCodProducto;
        
        Data.post('/productos/buscarProductos', angular.copy(productoBuscar)).then(function(data){
            console.log(data);
            ocd.productos = angular.copy(data);
            $scope.cantidadProducto_change(ocd);
            //ocd.productos.unidadesMedidaCompra = angular.copy(data.unidadesMedidaCompra);
        });     
    };
    
    $scope.envaseProducto_change = function(ocd){
        //seteamos al mismo objeto de busqueda para realizar la busqueda buscar los datos del producto
        console.log(ocd);//,precio_compra,precio_compra_blister,precio_compra_caja
        $scope.cantidadProducto_change(ocd);
        
     
    };
    $scope.cantidadProducto_change = function(ocd){
        //seteamos al mismo objeto de busqueda para realizar la busqueda buscar los datos del producto
        console.log(ocd);//,precio_compra,precio_compra_blister,precio_compra_caja
        if(ocd.tiposEnvase.codTipoEnvase===1){//unidades
            ocd.cantidadNeta = ocd.tempCantidadNeta * 1;            
            ocd.precioTotal = ocd.tempCantidadNeta*ocd.productos.precioCompra;
        }
        if(ocd.tiposEnvase.codTipoEnvase===2){//blister
            ocd.cantidadNeta = ocd.tempCantidadNeta * ocd.productos.cantUnidadesBlister;            
            ocd.precioTotal = ocd.tempCantidadNeta * ocd.productos.precioCompraBlister;
        }
        if(ocd.tiposEnvase.codTipoEnvase===3){//cajas
            ocd.cantidadNeta = ocd.tempCantidadNeta * ocd.productos.cantUnidadesCaja;            
            ocd.precioTotal = ocd.tempCantidadNeta * ocd.productos.precioCompraCaja;
        }
    };
            
}
    ]);
});