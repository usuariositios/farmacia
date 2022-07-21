define(['app'], function(app)
{
app.controller('editarIngresosVentaController',
    ['$scope','Data','$location','$timeout','DataCont','$window','$q',  
function ($scope, Data, $location,$timeout,DataCont,$window,$q) {
    
    $scope.ingresosVenta = {};
    $scope.materiales = {};
    
    
    //$scope.ingresosVenta =JSON.parse(sessionStorage.getItem("ingresosVentaEditar"));
    $scope.ingresosVenta = obtenerSession("ingresosVentaEditar");
    $scope.ingresosVenta.fechaIngresoVenta = $scope.ingresosVenta.fechaIngresoVenta.substring(0,10);//quitando la hora
    //$scope.ingresosVenta.tempFechaIngresoVenta = $scope.ingresosVenta.fechaIngresoVenta.substring(0,10);
    
    console.log($scope.ingresosVenta);
    
    $scope.productos = {};
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.ingresosVentaDetalleList = [];
    $scope.ingresosVentaBusiness ={};
    $scope.subGruposList = [];
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.tiposDocumentoList = [];
    //console.log($scope.ordenCompraAprobada);
    
    $scope.tipoDocumentoSeleccionado = obtenerSession("tipoDocumentoSeleccionado");//buscarlo y cargarlo en el boton editar
    //console.log($scope.tipoDocumentoSeleccionado);
    $scope.reciboCompras = {};
    
    $scope.infDocumento = {
        fechaDocumento:$scope.ingresosVenta.fechaIngresoVenta,
        totalDocumento:0,
        descuentoDocumento:0,
        importePagadoDocumento:0
    };
    
    
    //$scope.ingresosVenta =JSON.parse(sessionStorage.getItem("ingresosVentaEditar"));
    //console.log($scope.ingresosVenta);    
    
    
    $scope.buscarProducto = function(pb,ivd){
        console.log(ivd);
        Data.post('/productos/buscarProductos', pb).then(function (p) {
            console.log(p);
            ivd.productos = angular.copy(p);
            ivd.unidadesMedida = angular.copy(p.unidadesMedida);
        });
    };
    
    Data.post('/ingresosVentaDetalle/cargarIngresosVentaDetalle',$scope.ingresosVenta).then(function(data){
        $scope.ingresosVentaDetalleList = angular.copy(data);
        console.log($scope.ingresosVentaDetalleList);
        for(i=0;i<$scope.ingresosVentaDetalleList.length;i++){
            
            $scope.ingresosVentaDetalleList[i].tempCodProducto = $scope.ingresosVentaDetalleList[i].productos.codProducto;
            $scope.ingresosVentaDetalleList[i].tempCantIngreso = $scope.ingresosVentaDetalleList[i].cantIngreso;
            
            
            $scope.buscarProducto($scope.ingresosVentaDetalleList[i].productos,$scope.ingresosVentaDetalleList[i]);
        }
    });
    
    
    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
        $scope.tablaDetalle = data;

        $scope.tablaDetalle.tabla.nombreTabla = "TIPOS_ENVASE";

        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.tiposEnvaseList = data;
            console.log(data);
        });
    });
    
    Data.get('/personal/cargarPersonalItem').then(function(data){
        $scope.personalList = data;
        $scope.personalList.splice(0,0,item);
    });    
    Data.get('/ingresosVentaDetalle/ingresosVentaDetalle').then(function(data){
        $scope.ingresosVentaDetalle = angular.copy(data);
        console.log($scope.ingresosVentaDetalle);
        
    });
    
    
    Data.get('/tiposFuentePago/cargarTiposFuentePagoItem').then(function(data){
        $scope.tiposFuentePagoList = data;
        $scope.tiposFuentePagoList.splice(0,0,item);
    });
    
    Data.get('/proveedores/cargarProveedoresItem').then(function(data){
        $scope.proveedoresList = data;
        $scope.proveedoresList.splice(0,0,item);
    });
    
    Data.get('/productos/productos').then(function(data){
        $scope.productos = data;
        $scope.productosBuscar = angular.copy($scope.productos);//para buscar en agregar producto
    });
    Data.get('/gruposProducto/cargarGruposProductoItem').then(function(data){
        $scope.gruposProductoList = data;
    });
    Data.get('/tiposDocumento/cargarTiposDocumentoItem').then(function(data){
            $scope.tiposDocumentoList = data;

        });
    
    $scope.init = function(){
        
        if ($scope.ingresosVenta.tiposDocumento.codTipoDocumento !== null && parseInt($scope.ingresosVenta.tiposDocumento.codTipoDocumento) === 1) {//factura de drop down
            DataCont.get('/libroCompras/libroCompras').then(function (data) {
                
                $scope.libroCompras = data;
                $scope.libroCompras.codLibroCompras = $scope.ingresosVenta.codLibroCompras;
                if($scope.libroCompras.codLibroCompras>0){
                    DataCont.post('/libroCompras/buscarLibroCompras', $scope.libroCompras).then(function (data) {
                        console.log(data);
                        $scope.libroCompras = angular.copy(data);
                        $scope.libroCompras.importePagado = parseFloat($scope.libroCompras.totalFactura) - parseFloat($scope.libroCompras.descuentosBonificaciones);

                        $scope.proveedor_change();

                        //$scope.libroCompras.fechaLibro = fechaActualDDMMYYYY();                        
                        $scope.guardarLibroCompras_action();
                        //mostrarVentanaModal("agregarLibroComprasDialog");
                    });
                }
                
            });
        }
        $('#fecha .input-group.date').datepicker({
                            language: "es",
                            format: "dd/mm/yyyy",
                            autoclose: true,
                            todayHighlight: true
                        }).on('changeDate', function (e) {
                            $scope.libroCompras.fechaLibro = formatoFecha(e.date);
                        });
        
        if ($scope.ingresosVenta.tiposDocumento.codTipoDocumento !== null && parseInt($scope.ingresosVenta.tiposDocumento.codTipoDocumento) === 2) {//recibo de drop down
            DataCont.get('/reciboCompras/reciboCompras').then(function (data) {
                $scope.reciboCompras = data;
                $scope.reciboCompras.codRecibo = $scope.ingresosVenta.codReciboCompras;
                if($scope.reciboCompras.codRecibo>0){
                    DataCont.post('/reciboCompras/buscarReciboCompras', $scope.reciboCompras).then(function (data) {
                        $scope.reciboCompras = angular.copy(data);
                        $scope.proveedor_change1();
                        console.log($scope.reciboCompras);
                        //$scope.reciboCompras.fechaRecibo = fechaActualDDMMYYYY();
                        

                        //mostrarVentanaModal("agregarReciboComprasDialog");

                    });
                }
                
                
            });
        }
            
    $('#fecha_recibo .input-group.date').datepicker({
                            language: "es",
                            format: "dd/mm/yyyy",
                            autoclose: true,
                            todayHighlight: true
                        }).datepicker("setDate", creaDate(fechaActualDDMMYYYY())).on('changeDate', function (e) {
                            $scope.reciboCompras.fechaRecibo = formatoFecha(e.date);
                        });
                        //$scope.reciboCompras.fechaPago = fechaActualDDMMYYYY();
                        $('#fecha_pago .input-group.date').datepicker({
                            language: "es",
                            format: "dd/mm/yyyy",
                            autoclose: true,
                            todayHighlight: true
                        }).datepicker("setDate", creaDate(fechaActualDDMMYYYY())).on('changeDate', function (e) {
                            $scope.reciboCompras.fechaPago = formatoFecha(e.date);
                        });    
        
        
    };
    $scope.init();
    
    
    
    
    
    
    $scope.proveedor_change = function(){
        DataCont.post('/proveedor/buscarProveedor', $scope.libroCompras.proveedores).then(function (data) {
            console.log(data);
            $scope.libroCompras.proveedores.nitProveedor = data.nitProveedor;            
        });
    };
    $scope.proveedor_change1 = function(){
        DataCont.post('/proveedor/buscarProveedor', $scope.reciboCompras.proveedor).then(function (data) {
            console.log(data);
            $scope.reciboCompras.proveedor.nitProveedor = data.nitProveedor;            
        });
    };
    $scope.importe_change = function(){
        $scope.libroCompras.importePagado = parseFloat($scope.libroCompras.totalFactura) - parseFloat($scope.libroCompras.descuentosBonificaciones);
        $scope.libroCompras.importeSubTotal = parseFloat($scope.libroCompras.totalFactura) - parseFloat($scope.libroCompras.importeNoSujetoCreditoFiscal) ;
        $scope.libroCompras.importeBaseCreditoFiscal = parseFloat($scope.libroCompras.importeSubTotal) - parseFloat($scope.libroCompras.descuentosBonificaciones) ;
        $scope.libroCompras.importeCreditoFiscal = Math.round((parseFloat($scope.libroCompras.importeBaseCreditoFiscal)*0.13)*100)/100;
        
    };
    $scope.importeRecibo_change = function(){
        $scope.reciboCompras.importeCancelado = parseFloat($scope.reciboCompras.importeTotal) - parseFloat($scope.reciboCompras.descuentosRebajas);
    };
    DataCont.get("/tiposDocumentoLibroCompras/cargarTiposDocumentoLibroComprasItem").then(function(data){
            $scope.tiposDocumentoLibroComprasList = data;
            //$scope.tiposDocumentoLibroComprasList.splice(0,0,item);
            console.log(data);
    });
    $scope.validarLibroCompras = function(){
        
        
        if ( parseInt($scope.libroCompras.proveedores.codProveedor)===0) {                
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el proveedor" });
                
                return false;
        }
        if (  $scope.libroCompras.nroFactura.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro de factura" });                
                
                return false;
        }
        if (  $scope.libroCompras.nroAutorizacion.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro de autorizacion" });
                
                
                return false;
        }
        if (  $scope.libroCompras.codigoControl.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el codigo de control" });
                
                
                return false;
        }
        if (  $scope.libroCompras.fechaLibro.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre la fecha de factura" });
                
                
                return false;
        }
        if (  parseFloat($scope.libroCompras.totalFactura) === 0 || isNaN(parseFloat($scope.libroCompras.totalFactura))) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el importe total" });
                
                
                return false;
        }
        if ( parseInt($scope.libroCompras.tiposDocumentoLibrosCompra.codTipoDocumentoLibroCompra) === 0) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Seleccione el tipo de documento" });
                
                
                return false;
        }
        return true;
    };
    $scope.guardarLibroCompras_action = function(){
        //validaciones
        console.log(parseFloat($scope.libroCompras.totalFactura));
        if($scope.validarLibroCompras()===false){
            return null;
        }
        //setear valores desde libro compras a ingreso almacen
        $scope.ingresosVenta.proveedores.codProveedor = angular.copy($scope.libroCompras.proveedores.codProveedor);
        $scope.infDocumento.fechaDocumento = angular.copy($scope.libroCompras.fechaLibro);
        $scope.infDocumento.totalDocumento = angular.copy($scope.libroCompras.totalFactura);
        $scope.infDocumento.descuentoDocumento = angular.copy($scope.libroCompras.descuentosBonificaciones);
        $scope.infDocumento.importePagadoDocumento = angular.copy($scope.libroCompras.importePagado);
        
        
        
        $('#agregarLibroComprasDialog').modal('hide');
    };
    $scope.validarReciboCompras = function(){
        //validaciones
        
        if ( parseInt($scope.reciboCompras.proveedor.codProveedor)===0) {                
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el proveedor" });
                
                return false;
        }
        if (  $scope.reciboCompras.nroRecibo === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nro de recibo" });                
                
                return false;
        }
        if (  $scope.reciboCompras.fechaRecibo.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre la fecha de recibo" });
                return false;
        }
        
        if (  parseFloat($scope.reciboCompras.importeTotal) === 0) {   
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el importe total" });               
                
                return false;
        }
        if (  $scope.reciboCompras.fechaPago.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre la fecha de pago" });                
                return false;
        }
        
        
        
        
        
    };
    $scope.guardarReciboCompras_action = function(){
        if($scope.validarReciboCompras()===false){
            return null;
        }        
        $scope.ingresosVenta.proveedores.codProveedor = angular.copy($scope.reciboCompras.proveedor.codProveedor);
        $scope.infDocumento.fechaDocumento = angular.copy($scope.reciboCompras.fechaRecibo);
        $scope.infDocumento.totalDocumento = angular.copy($scope.reciboCompras.importeTotal);
        $scope.infDocumento.descuentoDocumento = angular.copy($scope.reciboCompras.descuentosRebajas);
        $scope.infDocumento.importePagadoDocumento = angular.copy($scope.reciboCompras.importeCancelado);
        $('#agregarReciboComprasDialog').modal('hide');
    };    
    
    
    $scope.editarLibroCompras_action=function(){
        mostrarVentanaModal("agregarLibroComprasDialog");
    };
    $scope.editarReciboCompras_action=function(){
        mostrarVentanaModal("agregarReciboComprasDialog");
    };
    
    
    $scope.agregarProducto_action = function(){
        //$scope.productosBuscarList=[];
        
        console.log($scope.productosBuscar);
        mostrarVentanaModal("agregarProdIngrVentaDialog");
    };
    
    //registro cod Barras
    $('#agregarProductoCodBarrasDialog').on('shown.bs.modal', function () {        
        $("#codBarrasProducto").focus();
    });
    $scope.mostrarAgregarProductoCodBarras = function(){
        //$scope.productosBuscarList=[];
        $scope.productosBuscar = angular.copy($scope.productos);
        console.log($scope.productosBuscar);
        mostrarVentanaModal("agregarProductoCodBarrasDialog");
    };
    $scope.agregarProductoCodBarras_action = function(){
        //$scope.productosBuscarList=[];
        for(i=0;i<$scope.ingresosVentaDetalleList.length;i++){
            
            if($scope.ingresosVentaDetalleList[i].productos.codBarrasProducto.trim()===$scope.productosBuscar.codBarrasProducto.trim()){                
               $.growl.warning({title:"ADVERTENCIA!", message: "El producto con el codigo de barras "+$scope.productosBuscar.codBarrasProducto+" ya esta registrado"});
               return;
            }
        }
        console.log($scope.productosBuscar);
        var iad = angular.copy($scope.ingresosVentaDetalle);
        //buscar producto con el codigo de barras
        Data.post('/productos/buscarProductos', $scope.productosBuscar).then(function(producto){
            $scope.productosBuscar = producto;
            iad.productos = angular.copy($scope.productosBuscar);
            iad.unidadesMedida = angular.copy($scope.productosBuscar.unidadesMedida);
            if(iad.productos.codProducto!==0){                
                $scope.ingresosVentaDetalleList.push(iad);
                $scope.productosBuscar = angular.copy($scope.productos);
            }else{
                $.growl.warning({title:"ADVERTENCIA!", message: "El producto con el codigo de barras no existe"});                
            }
            
        });
        
    };
    
    
    
    $scope.buscarProducto_action = function(){
        
        /*if ( parseInt($scope.productosBuscar.grupoProducto.codGrupoProducto) === 0) {
                $scope.mensaje = "Seleccione el grupo";
                mostrarVentanaModal('mensajeDialog');                
                return null;
            }*/
        //colocar en string los codproducto para que no se tomen en cuenta
        var i = 0;
        var codProducto = "0";
        for(i=0;i<$scope.ingresosVentaDetalleList.length;i++){
            codProducto =codProducto +","+ $scope.ingresosVentaDetalleList[i].productos.codProducto;
        }
        $scope.productosBuscar.sinCodProducto = codProducto;//sin los productos
        console.log("sin cod producto: "+$scope.productosBuscar.sinCodProducto);
        
        
        $scope.productosBuscarList = [];
        Data.post('/productos/cargarProductos', $scope.productosBuscar).then(function(data){
            $scope.productosBuscarList = data;
        });
        
    };
    
    $scope.seleccionarProducto_action = function(p){
        var id = angular.copy($scope.ingresosVentaDetalle);
        id.productos=angular.copy(p);
        id.unidadesMedida = angular.copy(p.unidadesMedida);
        id.estadosRegistro.codEstado = 1;
        var enDetalle = 0;
        //buscar el producto en el detalle
        for(i=0;i<$scope.ingresosVentaDetalleList.length;i++){
            if(parseInt($scope.ingresosVentaDetalleList[i].productos.codProducto)===parseInt(id.productos.codProducto)){
                enDetalle = 1;
                break;
            }
        }
        if(enDetalle===1){
            $scope.mensaje = "El producto " + id.productos.nombreProducto+" ya se encuentra registrado ";
            mostrarVentanaModal('mensajeDialog');
            return null;            
        }
            
        
        id.fechaFabricacion = fechaActualDDMMYYYY();
        id.fechaVencimiento = fechaActualDDMMYYYY();
        id.precioUnitario=id.productos.precioCompra;


        id.tempCodEnvase = "1";//envase
        id.tempCantIngreso = 1;//cantidad por defecto
        $scope.ingresosVentaDetalleList.push(id);
        $scope.envaseProducto_change(id);
        console.log("entro hide agregarProdIngrVentaDialog");
        $('#agregarProdIngrVentaDialog').modal('hide');  
        
        
        
        
    };
    $scope.validarDetalleTotal_action = function(){
        var totalDetalle = 0;
        for(i=0;i<$scope.ingresosVentaDetalleList.length;i++){
            totalDetalle = totalDetalle+parseFloat($scope.ingresosVentaDetalleList[i].totalMonto);            
        }
        if($scope.ingresosVentaDetalleList.length<=0){
            $.growl.warning({title:"ADVERTENCIA!", message: "Registre el detalle"});
            return false;
        }
        /*if(parseFloat(totalDetalle)!==parseFloat($scope.infDocumento.importePagadoDocumento)){
            $.growl.warning({title:"ADVERTENCIA!", message: "El detalle no coincide con el total del documento"});
            return false;
        }*/
    
    
    };
    
    
    $scope.guardarIngresoVenta_action = function(){
        //validaciones
        
            
       /*     if(parseInt($scope.tipoDocumentoSeleccionado.codItem)===1 && $scope.validarLibroCompras()===false){
                return null;
        }
            if(parseInt($scope.tipoDocumentoSeleccionado.codItem)===2 && $scope.validarReciboCompras()===false){
                return null;
        }*/
            if($scope.validarDetalleTotal_action()===false){
                return null;
        }
        
        
        
        $scope.ingresosVenta.fechaIngresoVenta = $scope.ingresosVenta.fechaIngresoVenta+" "+obtieneFechaActual().substring(11);//agregando hora
        
        
              
            //copiar cantidad restante
            var i= 0;
            for(i=0;i<$scope.ingresosVentaDetalleList.length;i++){
                delete $scope.ingresosVentaDetalleList[i].tempCantIngreso;
                delete $scope.ingresosVentaDetalleList[i].tempCodEnvase;
                delete $scope.ingresosVentaDetalleList[i].tempCodProducto;
                $scope.ingresosVentaDetalleList[i].cantRestante=$scope.ingresosVentaDetalleList[i].cantIngreso;
            }
        
            $scope.ingresosVentaBusiness.ingresosVenta = angular.copy($scope.ingresosVenta);
            $scope.ingresosVentaBusiness.ingresosVentaDetalleList = angular.copy($scope.ingresosVentaDetalleList);
            
            console.log($scope.ingresosVentaBusiness);
            /*dataGet("/ingresosVenta/codigoIngresosVenta", function(data) {
                $scope.ingresosVenta.codIngresoVenta = data;
                Data.post("/ingresosVenta/guardarIngresosVentaBusiness", $scope.ingresosVentaBusiness).then(function(data){
                    $location.path("navegadorIngresosVenta");
                });
            },false);*/
        /*if(parseInt($scope.tipoDocumentoSeleccionado.codItem)===1){
            DataCont.post('/libroCompras/editarLibroCompras', $scope.libroCompras).then(function(data){            
              
            
            Data.post("/ingresosVenta/editarIngresosVentaBusiness", $scope.ingresosVentaBusiness).then(function(data){
                    ocultarVentanaModal('#progressDialog');
                    $location.path("navegadorIngresosVenta");
                });
                
            });
            }*/
            //if(parseInt($scope.tipoDocumentoSeleccionado.codItem)===2){
            //DataCont.post('/reciboCompras/editarReciboCompras', $scope.reciboCompras).then(function(data){
            //            console.log(data);                        
            /*Data.post("/ingresosVenta/editarIngresosVentaBusiness", $scope.ingresosVentaBusiness).then(function(data){
                    console.log(data);
                    $location.path("navegadorIngresosVenta");                    
            });*/
            
$q.all([
            Data.post("/ingresosVenta/editarIngresosVentaBusiness", $scope.ingresosVentaBusiness).then(function(data){
                    $scope.ivbguardado = angular.copy(data);
                    console.log(data);
                    
                    
                    if(data.ingresosVenta.codIngresoVenta>0){//se guardo el ingreso venta
                        /*if($scope.ordenCompraAprobada!==null ){
                            $scope.ordenCompraAprobada.estadosOrdenCompra.codEstadoOrdenCompra = 3;//aprobado
                            Data.post("/ordenesCompra/editarOrdenesCompra", $scope.ordenCompraAprobada).then(function(data){
                                $location.path("navegadorIngresosVenta");
                            });
                        }*/
                    }                    
                })
        ]).then(function () {
                
            /*});
            }*/
            if($scope.ingresosVenta.tiposDocumento.codTipoDocumento===2){
                $scope.reciboCompras.gestion = angular.copy($scope.usuarioPersonal.gestion);
                DataCont.post('/reciboCompras/eliminarReciboCompras', $scope.reciboCompras).then(function(data){
                    console.log(data);
                    DataCont.post('/reciboCompras/guardarReciboCompras', $scope.reciboCompras).then(function(recibo){
                        console.log(recibo);
                        $scope.ivbguardado.ingresosVenta.reciboCompras.codRecibo = recibo.codRecibo;
                        Data.post("/ingresosVenta/editarIngresosVenta", $scope.ivbguardado.ingresosVenta ).then(function(data){
                            console.log(data);
                            $location.path("navegadorIngresosVenta");
                        });
                    });
                });
            }else{
                $scope.libroCompras.gestion.codGestion = angular.copy($scope.usuarioPersonal.gestion.codGestion);
                console.log($scope.libroCompras);
                DataCont.post('/libroCompras/eliminarLibroCompras', $scope.libroCompras).then(function(data){
                    console.log(data);
                    DataCont.post('/libroCompras/guardarLibroCompras', $scope.libroCompras).then(function(libroCompras){
                        console.log(libroCompras);
                        $scope.ivbguardado.ingresosVenta.libroCompras.codLibroCompras = libroCompras.codLibroCompras;
                        Data.post("/ingresosVenta/editarIngresosVenta", $scope.ivbguardado.ingresosVenta ).then(function(data){
                            console.log(data);
                            $location.path("navegadorIngresosVenta");
                        });

                    });
                });
            }
        
            });    
            //});
            //}
            
            
            
            
            
            
            
    };
    
    $scope.cancelar_action = function(){
        //window.location = "navegadorIngresosVenta.html";
        $location.path("navegadorIngresosVenta");
    };
    
    $scope.sinCantidadVentaDetalle = function(){
        var i = 0;
        var sinCantidad = 0; 
        for(i=0;i<$scope.ingresosVentaDetalleList.length;i++){
            //iad = angular.copy($scope.ingresosVentaDetalleList[i]);
            //auxList.push($scope.ingresosVentaDetalleList[i]);
            if($scope.ingresosVentaDetalleList[i].cantTotalIngreso===""  || parseInt($scope.ingresosVentaDetalleList[i].cantTotalIngreso)===0  ){
                sinCantidad = 1;
            }
        }
        return sinCantidad;
    };
    $scope.borrarVentaDetalle_action = function(ingresoVentaDetalle){
        var i = 0;        
        for(i=0;i<$scope.ingresosVentaDetalleList.length;i++){
            if(parseInt($scope.ingresosVentaDetalleList[i].productos.codProducto) === parseInt(ingresoVentaDetalle.productos.codProducto)){
                $scope.ingresosVentaDetalleList.splice(i,1);//eliminar un elemento en el indice i
            }
        }        
    };
    $scope.cantidadProducto_change = function(iad){
        //iad.precioUnitario = parseFloat(iad.totalMonto)/parseFloat(iad.cantIngreso);
        
        //if(parseInt($scope.ingresosVenta.conIva) == 1){//con iva
           //console.log("iva " + $scope.ingresosVenta.conIva);
           //iad.costoUnitario = (parseFloat(iad.totalMonto)/parseFloat(iad.cantIngreso))*(1-0.13);//el monto menos el trece% por que ya esta en la factura el 13%
           //iad.subTotalMonto = parseFloat(iad.totalMonto) * (1-0.13);
        //}
           $scope.envaseProducto_change(iad);
                
    };
    $scope.totalProducto_change = function(iad){
        iad.precioUnitario = parseFloat(iad.totalMonto)/parseFloat(iad.cantIngreso);
        
        if(parseInt($scope.ingresosVenta.conIva) === 1){//con iva
            console.log("iva " + $scope.ingresosVenta.conIva);
           iad.costoUnitario = (parseFloat(iad.totalMonto)/parseFloat(iad.cantIngreso))*(1-0.13);//el monto menos el trece% por que ya esta en la factura el 13%
           iad.subTotalMonto = parseFloat(iad.totalMonto) * (1-0.13);
        }                
                
    };
    $scope.grupoProducto_change = function(g){
        //seteamos al mismo objeto de busqueda para realizar la busqueda
        $scope.productosBuscar.subGruposProducto.gruposProducto.codGrupoProducto = $scope.productosBuscar.grupoProducto.codGrupoProducto;
        Data.post('/subGruposProducto/cargarSubGruposProductoItem', $scope.productosBuscar.subGruposProducto).then(function(data){
            $scope.subGruposList = data;            
        });
    };
    $scope.envaseProducto_change = function(ivd){
        //seteamos al mismo objeto de busqueda para realizar la busqueda
        //tempCantIngreso es cantidad de blister o cajas
        console.log(ivd);
        if(ivd.tiposEnvase.codTipoEnvase===1){//unidades
            ivd.cantIngreso = ivd.tempCantIngreso * 1;
            ivd.cantRestante = ivd.cantIngreso;
            ivd.subTotalMonto = ivd.tempCantIngreso*ivd.productos.precioCompra ;
            ivd.totalMonto = ivd.tempCantIngreso*ivd.productos.precioCompra;
            
        }
        if(ivd.tiposEnvase.codTipoEnvase===2){//blister
            ivd.cantIngreso = ivd.tempCantIngreso * ivd.productos.cantUnidadesBlister;
            ivd.cantRestante = ivd.cantIngreso;
            ivd.subTotalMonto = ivd.tempCantIngreso * ivd.productos.precioCompraBlister ;
            ivd.totalMonto = ivd.tempCantIngreso * ivd.productos.precioCompraBlister;
        }
        if(ivd.tiposEnvase.codTipoEnvase===3){//cajas
            ivd.cantIngreso = ivd.tempCantIngreso * ivd.productos.cantUnidadesCaja;
            ivd.cantRestante = ivd.cantIngreso;
            ivd.subTotalMonto = ivd.tempCantIngreso * ivd.productos.precioCompraCaja;
            ivd.totalMonto = ivd.tempCantIngreso * ivd.productos.precioCompraCaja;
        }
        ivd.totalMonto = redondeaDouble(ivd.subTotalMonto *(1- (ivd.porcentajeDescuento/100)));//con el descuento
        ivd.precioUnitario = redondeaDouble(ivd.subTotalMonto/ivd.cantIngreso);
        
    };
    $scope.pUnitPorcDesc_change = function(ivd){
        ivd.subTotalMonto = redondeaDouble(ivd.precioUnitario * ivd.cantIngreso);
        ivd.totalMonto = redondeaDouble(ivd.subTotalMonto *(1- (ivd.porcentajeDescuento/100)));//con el descuento
    };
    $scope.actualizarProveedores_action = function(){
        Data.get('/proveedores/cargarProveedoresItem').then(function (data) {
            $scope.proveedoresList = data;
            $scope.proveedoresList.splice(0, 0, item);
        });
    };
    $scope.abrirProveedores_action=function(){
        $window.open("/farmacia/navegador.html#/navegadorProveedores");
    };
    $scope.registrarDocumento_action=function(){
        if($scope.ingresosVenta.tiposDocumento.codTipoDocumento===1){
            $scope.editarLibroCompras_action();
        }
        if($scope.ingresosVenta.tiposDocumento.codTipoDocumento===2){
            $scope.editarReciboCompras_action();
        }
    };
    
    
    
   
    
}
]);
});
