define(['app'], function(app)
{
app.controller('agregarFacturaController',
    ['$scope','Data','$location','$window','DataCont','$q','DataFact',
function ($scope, Data,$location,$window,DataCont,$q,DataFact) {    
    
    $scope.salidasVenta = {};
    $scope.salidasVentaTotal = {};//de la fila total
    $scope.productos = {};
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.salidasVentaDetalleList = [];
    $scope.salidasVentaBusiness ={};
    $scope.sadi ={};//salida almacen detalle ingreso
    $scope.sadSeleccionado ={};
    $scope.productosSalida = {cantRestante:0,unidadesMedida:{},cantSalida:0};
    $scope.subGruposList = [];
    $scope.desabilitarBotonGuardar = false;
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.tiposPagoList = [];
    $scope.paramFacturaList = [];
    $scope.paramFactura = {};
    
    
    
    //$scope.salidasVenta =JSON.parse(sessionStorage.getItem("salidasVentaEditar"));
    //console.log($scope.salidasVenta);
    
    
    Data.get("/salidasVenta/salidasVenta").then(function(data) {
            console.log(data);
            
            $scope.salidasVenta = data;
            $scope.salidasVenta.gestion = angular.copy($scope.usuarioPersonal.gestion);
            $scope.salidasVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);
            $scope.salidasVenta.estadosSalidaVenta.codEstadoSalidaVenta= 1;
            $scope.salidasVenta.tiposVenta.codTipoVenta = 1;//venta al contado
            
            $scope.salidasVenta.fechaPagoCredito = fechaActualDDMMYYYY();            
            $scope.salidasVentaTotal = angular.copy(data);
            
            Data.post("/salidasVenta/nroSalidaVenta",$scope.salidasVenta).then(function(data) {//salida almacen
                $scope.salidasVenta.nroSalidaVenta = data;        
            });
            Data.get("/facturasEmitidas/facturasEmitidas").then(function(data) {        //factura emiida
                $scope.facturaEmitida = angular.copy(data);
                console.log($scope.facturaEmitida);
                Data.post("/facturasEmitidas/nroFacturaEmitida",$scope.salidasVenta).then(function(data) {
                    $scope.facturaEmitida.nroFactura = data;        
                });
            });
    });
    
    //cargar datos para facturacion
    
    var obtieneParametroFactura = function(nombreParam){
                
                for(var i=0;i<$scope.paramFacturaList.length;i++){
                    if($scope.paramFacturaList[i].nombre===nombreParam){
                        return $scope.paramFacturaList[i].valor;
                    }
                }
                return "";
    };
    
    DataFact.get("/facturacionelectronica/parametrosfactura").then(function(data) {
        $scope.paramFactura = data;
        
        DataFact.post("/facturacionelectronica/cargarParametrosFactura",$scope.paramFactura).then(function(data) {
                $scope.paramFacturaList = data;        
                console.log($scope.paramFacturaList);
                
                DataFact.get("/facturacionelectronica/parametros").then(function(data) {
                        $scope.parametros = angular.copy(data); //datos de facturacion electronica
                        $scope.parametrosFechaHora = angular.copy(data); //datos de facturacion electronica
                        $scope.parametros.codigoSistema = obtieneParametroFactura("CODSIS");
                        $scope.parametros.codigoAmbiente = parseInt(obtieneParametroFactura("CODAMB"));
                        
                        $scope.parametros.nit = parseInt(obtieneParametroFactura("NIT"));
                        $scope.parametros.codigoSucursal = parseInt(obtieneParametroFactura("SUC"));
                        
                        $scope.parametros.codigoPuntoVenta = parseInt(obtieneParametroFactura("POS"));                        
                        $scope.parametros.codigoParametrica = "";//falta
                        $scope.parametros.codigoModalidad = parseInt(obtieneParametroFactura("CODMOD"));
                        
                        $scope.parametros.codigoDocumentoSector = 0;//falta
                        $scope.parametros.codigoEmision = 0;//falta
                        
                        $scope.parametros.tipoFacturaDocumento = parseInt(obtieneParametroFactura("TIPOFAC"));
                        
                        //$scope.parametros.direccion = obtieneParametroFactura("DIR");
                        
                        console.log($scope.parametros);
                        DataFact.post("/codigos/obtenerCUIS",$scope.parametros).then(function(data) {                                
                                $scope.parametros.cuis = data.cuis;                                
                                console.log(data);
                                DataFact.post("/codigos/obtenerCUFD",$scope.parametros).then(function(data) {//obtener cufd
                                    $scope.parametros.cufd = data.cufd;
                                    console.log(data);
                                });
                                
                                $scope.parametros.codigoParametrica = "fechaHora";//tiene que tener los datos de sistema
                        
                                DataFact.post("/sincronizacion/sincronizar",$scope.parametros).then(function(data) {                                
                                        console.log(data);
                                        $scope.fechaHoraEmision = data.fechaHora;
                                        $scope.parametros.fechaEnvio = data.fechaHora;

                                });
                        });
                        
                        DataFact.get("/facturacionelectronica/facturaElectronicaCompraVenta").then(function(data) {//para agregar a parametros.facturaElectronicaCompraVentaList
                                $scope.facturaElectronicaCompraVentaObj = angular.copy(data);
                                $scope.facturaElectronicaCompraVenta = angular.copy(data);
                                //para agre
                                console.log($scope.facturaElectronicaCompraVenta);
                        });
                        DataFact.get("/facturacionelectronica/detalleFacturaCompraVenta").then(function(data) {//para agregar a parametros.facturaElectronicaCompraVentaList
                                $scope.detalleFacturaCompraVentaObj = angular.copy(data);
                                $scope.detalleFacturaCompraVenta = angular.copy(data);
                                //para agre
                                console.log($scope.detalleFacturaCompraVenta);
                        });
                        
                        
                        
                        
                        
                        
                        
                });
        
        });
        
        
        
        
        
        
    });
    
    
    
    DataFact.get('/sincronizacion/parametricasdto').then(function(data){//tipos de pago
        console.log(data);
        $scope.parametricasdto = angular.copy(data);
        $scope.parametricasdto.codParametrica = "tipoMetodoPago";
        $scope.parametricasdto.descripcion = "EFECTIVO";
        console.log($scope.parametricasdto);
        
        DataFact.post("/sincronizacion/cargarparametricasdtoItem",$scope.parametricasdto).then(function(data) {
                $scope.tiposPagoList = data;
                console.log($scope.tiposPagoList);
        });
        
        $scope.parametricasdto1 = angular.copy(data);
        $scope.parametricasdto1.codParametrica = "leyendasFactura";
        $scope.parametricasdto1.descripcion = "Tienes";
        DataFact.post("/sincronizacion/cargarparametricasdtoItem",$scope.parametricasdto1).then(function(data) {
                $scope.leyendasList = data;
                console.log($scope.leyendasList);
        });
        $scope.parametricasdto2 = angular.copy(data);
        $scope.parametricasdto2.codParametrica = "actividades";
        $scope.parametricasdto2.descripcion = "";
        DataFact.post("/sincronizacion/cargarparametricasdtoItem",$scope.parametricasdto2).then(function(data) {
                $scope.actividadesList = data;
                console.log($scope.actividadesList);
        });
        $scope.parametricasdto3 = angular.copy(data);
        $scope.parametricasdto3.codParametrica = "productosServicios";
        $scope.parametricasdto3.descripcion = "";
        DataFact.post("/sincronizacion/cargarparametricasdtoItem",$scope.parametricasdto3).then(function(data) {
                $scope.productosList = data;
                console.log($scope.productosList);
        });
    });
    
    
    
    
    
    
    
            
    
    
    
    $('#fecha_pago_credito .input-group.date').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
        
    }).datepicker("setDate",new Date()).on('changeDate', function (e) {
                $scope.salidasVenta.fechaPagoCredito = formatoFecha(e.date);
    });
    
    
    
    
    
    
    
    
    Data.get('/personal/cargarPersonalItem').then(function(data){
        $scope.personalList = data;
        $scope.personalList.splice(0,0,item);
    });    
    Data.get('/salidasVentaDetalle/salidasVentaDetalle').then(function(data){
        $scope.salidasVentaDetalle = data;
        console.log($scope.salidasVentaDetalle);
    });
    Data.get('/cliente/cargarClienteItem').then(function(data){
        $scope.clienteList = data;
        $scope.clienteList.splice(0,0,item);
    });
    
    Data.get('/proveedores/cargarProveedoresItem').then(function(data){
        $scope.proveedoresList = data;
        $scope.proveedoresList.splice(0,0,item);
    });
    
    Data.get('/productos/productos').then(function(data){
        $scope.productos = data;
        $scope.productosBuscar = angular.copy($scope.productos);//para buscar en agregar producto
    });
    
    /*Data.get('/tiposPago/cargarTiposPagoItem').then(function(data){
        var i = 0;        
        for(i=0;i<data.length;i++){
            if(data[i].codItem===2 || data[i].codItem===9){ //en fectivo, tarjeta o deposito
            $scope.tiposPagoList.splice(0,0,data[i]);
            }
        }
        //$scope.tiposPagoList = data;
    });*/

    /*Data.get('/gruposProducto/cargarGruposProductoItem').then(function(data){
        $scope.gruposProductoList = data;
    });*/
    
    Data.get('/salidasVentaDetalleIngreso/salidasVentaDetalleIngreso').then(function(data){
        console.log(data);
        $scope.sadi = data;
    });
    $scope.cliente_change = function(){
        //$scope.salidasVenta.clientes.nitCliente="";//para que busque por cod_cliente
        Data.post('/cliente/buscarCliente', $scope.salidasVenta.clientes).then(function (data) {
            
            $scope.salidasVenta.clientes.nitCliente = data.nitCliente;
            $scope.salidasVenta.clientes.tiposDescuento = angular.copy(data.tiposDescuento);
            $scope.salidasVenta.clientes.nombreCliente = data.nombreCliente;
            console.log($scope.salidasVenta);
        });
    };
                    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
                        $scope.tablaDetalle = data;                        
                        $scope.tablaDetalle.tabla.nombreTabla = "TIPOS_VENTA";
                        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
                            $scope.tiposVentaList = data;
                            console.log(data);
                        });
                        $scope.tablaDetalle.tabla.nombreTabla = "ACCION_TERAPEUTICA";
                        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
                            $scope.accionesTerapeuticasList = data;
                            console.log(data);
                        });
                        $scope.tablaDetalle.tabla.nombreTabla = "PRESENTACIONES_PRODUCTO";
                        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
                            $scope.presentacionesProductoList = data;
                            console.log(data);
                        });
                    });
    
    
    
    $scope.agregarProducto_action = function(){
        mostrarVentanaModal("agregarProductoDialog");
    };
    $scope.agregarFormaDePago_action = function(){
        if($scope.validarDetalle()===false){
                return null;
        }
            //validaciones
        if($scope.validarSalidaVenta()===false){
                return null;
        }
        mostrarVentanaModal("FormasDePagoDialog");
    };
    $scope.guardarFormaDePago_action = function(){        
        
        if(parseFloat($scope.facturaEmitida.tiposPago.codTipoPago) <=0){
                $.growl.warning({title:"ADVERTENCIA!", message: "Tipo de pago invalido" });
                return null;
        }
        if(parseFloat($scope.facturaEmitida.montoVuelto) <0){
                $.growl.warning({title:"ADVERTENCIA!", message: "Monto Cambio invalido" });
                return null;
        }
        if(parseFloat($scope.facturaEmitida.montoEfectivo) <=0){
                $.growl.warning({title:"ADVERTENCIA!", message: "Monto Efectivo invalido" });
                return null;
        }
        
        $scope.guardarSalidaVenta_action();
        $('#FormasDePagoDialog').modal('hide');
    };
    
    $scope.calculaVuelto = function(){
        $scope.facturaEmitida.montoVuelto = parseFloat($scope.facturaEmitida.montoEfectivo) - parseFloat($scope.salidasVentaTotal.montoTotal);
    };
    
    $scope.buscarProducto_action = function(){
        
        /*if ( parseInt($scope.productosBuscar.grupoProducto.codGrupoProducto) === 0) {                
                $.growl.warning({title:"ADVERTENCIA!", message: "Seleccione el grupo" });
                return null;
            }*/
        /*if ( parseInt($scope.productosBuscar.grupoProducto.codGrupoProducto)===0 && $scope.productosBuscar.nombreProducto.trim().length < 3) {
                $.growl.warning({title:"ADVERTENCIA!", message: "ingrese al menos 3 caracteres del nombre de producto" });
                return null;
        }*/
        
        //colocar en string los codproducto para que no se tomen en cuenta
        var i = 0;
        var codProducto = "0";
        for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
            codProducto =codProducto +","+ $scope.salidasVentaDetalleList[i].productos.codProducto;
        }
        $scope.productosBuscar.sinCodProducto = codProducto;//sin los productos
        console.log("sin cod producto: "+$scope.productosBuscar.sinCodProducto);
        
        
        $scope.productosBuscarList = [];
        Data.post('/productos/cargarProductos', $scope.productosBuscar).then(function(data){
            $scope.productosBuscarList = data;
        });
        
    };
    
    $scope.seleccionarProducto_action = function(p){
        
        
        
        $scope.sd = angular.copy($scope.salidasVentaDetalle);
        $scope.sd.productos=angular.copy(p);
        $scope.sd.unidadesMedida = angular.copy(p.unidadesMedida);
        $scope.sd.salidasVenta = angular.copy($scope.salidasVenta);
        $scope.sd.costoUnitario = angular.copy(p.precioVenta);
        $scope.sd.salidasVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);
        console.log($scope.sd);
        console.log("costo unitario"+p.precioVenta);
        $scope.sadi.ingresosVentaDetalle.ingresosVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);//que muestre del almacen y producto su cantidad restante
        $scope.sadi.ingresosVentaDetalle.productos = angular.copy(p);
               
        $scope.productosSalida = angular.copy(p);
        //colocar la cantidad restante en la salida detalle
        Data.post('/salidasVentaDetalle/cantRestanteIngresoVentaDetalle', $scope.sd).then(function(data){
            console.log(data);
            $scope.sd.ingresosVentaDetalle.cantRestante = parseInt(data);
            //para despliegue en la parte inferior de modal            
            $scope.productosSalida.cantRestante = parseInt(data);
            $scope.productosSalida.unidadesMedida = angular.copy(p.unidadesMedida);            
            p.cantPCompraVenta = parseInt(data);//para desplegar en la tabla
        });
    };
    
    
    
    
    $scope.cancelar_action = function(){
        //window.location = "navegadorSalidasVenta.html";
        $location.path("navegadorFacturasEmitidas");
    };
    
    $scope.sinCantidadVentaDetalle = function(){
        var i = 0;
        var sinCantidad = 0; 
        for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
            //iad = angular.copy($scope.salidasVentaDetalleList[i]);
            //auxList.push($scope.salidasVentaDetalleList[i]);
            if($scope.salidasVentaDetalleList[i].cantTotalSalida===""  || parseInt($scope.salidasVentaDetalleList[i].cantTotalSalida)===0  ){
                sinCantidad = 1;
            }
        }
        return sinCantidad;
    };
    $scope.borrarVentaDetalle_action = function(salidaVentaDetalle){
        var i = 0;        
        for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
            if(parseInt($scope.salidasVentaDetalleList[i].productos.codProducto) === parseInt(salidaVentaDetalle.productos.codProducto)){
                $scope.salidasVentaDetalleList.splice(i,1);//eliminar un elemento en el indice i
            }
        }        
    };
    $scope.cantidadProducto_change = function(sad){
           sad.montoSubTotal = redondeaDouble(parseFloat(sad.cantSalida) * parseFloat(sad.costoUnitario));
           calculaDescuentoDetalle(sad);
           obtieneCantidadTotal();
                
    };
    $scope.descuento_change = function(){
           obtieneCantidadTotal();
    };
    $scope.totalProducto_change = function(sad){
           sad.montoSubTotal = parseFloat(sad.cantSalida) * parseFloat(sad.costoUnitario);
    };
    $scope.verSalidaVentaDetalle_action = function(sad){
           console.log(sad);
           $scope.sadSeleccionado = sad;
           mostrarVentanaModal("detalleEtiquetasDialog");
    };
    
    $scope.guardarAgregarProducto_action = function(){
        
        
        var enDetalle = 0;
        //buscar el producto en el detalle
        for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
            if(parseInt($scope.salidasVentaDetalleList[i].productos.codProducto)===parseInt($scope.sd.productos.codProducto)){
                enDetalle = 1;
                break;
            }
        }
        if(enDetalle===1){                        
            $.growl.warning({title:"ADVERTENCIA!", message: "El producto " + $scope.sd.productos.nombreProducto+" ya se encuentra registrado " });
            return null;
        }
           
           if (parseFloat($scope.productosSalida.cantSalida)>parseFloat($scope.productosSalida.cantRestante)) {
                $scope.mensaje = "Cantidad sobrepasa el restante";
                $.growl.warning({title:"ADVERTENCIA!", message: "cantidad sobrepasa el restante" });
                return null;
            }
           if (parseFloat($scope.productosSalida.cantSalida)===0 || isNaN(parseFloat($scope.productosSalida.cantSalida))) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Cantidad debe ser mayor que cero" });
                return null;
            }
        
        
           $scope.sd.cantSalida = parseFloat($scope.productosSalida.cantSalida);
           $scope.sd.montoSubTotal = Math.round(parseFloat($scope.sd.cantSalida)*parseFloat($scope.sd.costoUnitario)*100)/100;
           $scope.sd.montoTotal = parseFloat($scope.sd.montoSubTotal) -parseFloat($scope.sd.porcDescuento)/100 * parseFloat($scope.sd.montoSubTotal);//con el descuendo porcentual           
           
           
           
           //para hallar el detalle de ingreso detalle -salida detalle
            Data.post('/salidasVentaDetalleIngreso/etiquetasSalidaVentaDetalleIngreso', $scope.sadi).then(function(data){                
                $scope.sd.salidasVentaDetalleIngresosList = angular.copy(data);
                detalleCantSacarSalidaVenta($scope.sd.salidasVentaDetalleIngresosList);
                $scope.sd.costoUnitario = $scope.sd.salidasVentaDetalleIngresosList[0].ingresosVentaDetalle.precioVenta!==0?$scope.sd.salidasVentaDetalleIngresosList[0].ingresosVentaDetalle.precioVenta:$scope.productosSalida.precioVenta; //colocamos primero el precio del primer ingreso si es cero colocamos el precio de venta del registro producto
                console.log($scope.sd);
                $scope.salidasVentaDetalleList.push($scope.sd);
                obtieneCantidadTotal();
                
                
            });
            $('#agregarProductoDialog').modal('hide');
    };
    
    
    
    var obtieneCantidadTotal = function(){
                //colocar el total en la ultima fila
                $scope.salidasVentaTotal.montoSubTotal = 0;
                $scope.salidasVentaTotal.montoCancelado = 0;
                //$scope.salidasVentaTotal.montoDescuento = 0;
                $scope.salidasVentaTotal.montoTotal = 0;
                
                for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
                    $scope.salidasVentaTotal.montoSubTotal = $scope.salidasVentaTotal.montoSubTotal + $scope.salidasVentaDetalleList[i].montoSubTotal;
                    $scope.salidasVentaTotal.montoCancelado = $scope.salidasVentaTotal.montoCancelado + $scope.salidasVentaDetalleList[i].montoCancelado;
                    //$scope.salidasVentaTotal.montoDescuento = $scope.salidasVentaTotal.montoDescuento + $scope.salidasVentaDetalleList[i].montoDescuento;
                    //$scope.salidasVentaTotal.montoTotal = $scope.salidasVentaTotal.montoTotal + $scope.salidasVentaDetalleList[i].montoTotal;
                }
                
                $scope.salidasVentaTotal.montoSubTotal = Math.round($scope.salidasVentaTotal.montoSubTotal*100)/100;
                $scope.salidasVentaTotal.montoCancelado = Math.round($scope.salidasVentaTotal.montoCancelado*100)/100;
                $scope.salidasVentaTotal.montoDescuento = Math.round($scope.salidasVentaTotal.montoDescuento*100)/100;
                $scope.salidasVentaTotal.montoTotal = $scope.salidasVentaTotal.montoSubTotal-$scope.salidasVentaTotal.montoDescuento;
                $scope.salidasVentaTotal.montoTotal = Math.round($scope.salidasVentaTotal.montoTotal*100)/100;
                
    };
    $scope.editarDescuento_action = function(sd){
        $scope.sadSeleccionado = sd;
        $scope.codDescuento = 1;
        $scope.porcDescuento = angular.copy($scope.sadSeleccionado.porcDescuento);
        $scope.descuentosList = [{codItem:1,nombreItem:"DESCUENTO A ESTE ITEM"},{codItem:2,nombreItem:"DESCUENTO TODOS LOS ITEMS"}];
        mostrarVentanaModal("editarDescuentoDialog");
    };
    $scope.guardarEditarDescuento_action = function(){
        $scope.sadSeleccionado.porcDescuento = $scope.porcDescuento;//despues de aceptar guardar
        if($scope.codDescuento===1){//para el item
            console.log($scope.sadSeleccionado);
            calculaDescuentoDetalle($scope.sadSeleccionado);            
            obtieneCantidadTotal();
        }
        if($scope.codDescuento===2){
            calculaDescuentoSimilarDetalle();
            obtieneCantidadTotal();
        }
        $('#editarDescuentoDialog').modal('hide');
    };
    calculaDescuentoSimilarDetalle =function(){
        for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
            $scope.salidasVentaDetalleList[i].porcDescuento = $scope.porcDescuento;//colocar el porcentaje de descuento
            calculaDescuentoDetalle($scope.salidasVentaDetalleList[i]);            
        }        
    };
    calculaDescuentoDetalle = function(sd){
        sd.montoDescuento = parseFloat(sd.porcDescuento)/100 * parseFloat(sd.montoSubTotal);
        sd.montoDescuento = Math.round(sd.montoDescuento*100)/100;
        sd.montoTotal = parseFloat(sd.montoSubTotal) - sd.montoDescuento;
        sd.montoTotal = Math.round(parseFloat(sd.montoTotal)*100)/100;//redondear a dos decimales
    };
    var detalleCantSacarSalidaVenta = function (salidasVentaDetalleIngresoList) {
        var cantSalida = $scope.sd.cantSalida;
        var i = 0;
        for (i = 0; i < salidasVentaDetalleIngresoList.length; i++) {
            var sadi = salidasVentaDetalleIngresoList[i];
            if (cantSalida > 0) {
                if (parseFloat(cantSalida) >= parseFloat(sadi.ingresosVentaDetalle.cantRestante)) {
                    sadi.cantSacar = sadi.ingresosVentaDetalle.cantRestante;
                    cantSalida = parseFloat(cantSalida) - sadi.ingresosVentaDetalle.cantRestante;
                } else {
                    sadi.cantSacar = cantSalida;
                    cantSalida = parseFloat(cantSalida) - parseFloat(sadi.ingresosVentaDetalle.cantRestante);
                }
            } else {
                sadi.cantSacar = 0;
            }
        }
    };
    
    $scope.guardarDetalleCantSacar_action = function(){
        //aqui hallar el total colocado
        var i = 0;
        var totalSd = 0;        
        
        for(i=0;i<$scope.sadSeleccionado.salidasVentaDetalleIngresosList.length;i++){                        
            if(isNaN(parseFloat($scope.sadSeleccionado.salidasVentaDetalleIngresosList[i].cantSacar))){
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre cantidades validas" });
                return null;
            }
            totalSd = parseFloat(totalSd) + parseFloat($scope.sadSeleccionado.salidasVentaDetalleIngresosList[i].cantSacar);            
        }
        if(totalSd<=0){
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre un subtotal mayor a cero" });
                return null;
        }
        
        $scope.sadSeleccionado.cantSalida = totalSd;
        
           //actualizar sub total y total monto
           $scope.sadSeleccionado.montoSubTotal = Math.round(parseFloat($scope.sadSeleccionado.cantSalida)*parseFloat($scope.sadSeleccionado.costoUnitario)*100)/100;
           //$scope.sadSeleccionado.montoTotal = parseFloat($scope.sadSeleccionado.montoSubTotal) -parseFloat($scope.sadSeleccionado.porcDescuento)/100 * parseFloat($scope.sadSeleccionado.montoSubTotal);//con el descuendo porcentual
           calculaDescuentoDetalle($scope.sadSeleccionado);            
            obtieneCantidadTotal();
        
        $('#detalleEtiquetasDialog').modal('hide');
        return null;
    };
    $scope.cantEtiquetas_change = function(e){
        if(isNaN(parseFloat(e.cantSacar))){
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre cantidades validas" });                
                return null;
        }
        if(parseFloat(e.cantSacar)>parseFloat(e.ingresosVentaDetalle.cantRestante)){
            $.growl.warning({title:"ADVERTENCIA!", message: "la cantidad excede el restante" });
            e.cantSacar = parseFloat(e.ingresosVentaDetalle.cantRestante);            
            return null;
        }
        console.log(e);
        
    };    
    
    $scope.validarSalidaVenta = function(){
        
            if (parseFloat($scope.salidasVenta.clientes.codCliente)===0) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el cliente" });
                
                return false;
            }
            if ($scope.salidasVenta.clientes.nitCliente.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nit de cliente" });
                
                return false;
            }
            /*if (parseFloat($scope.salidasVenta.clientes.tiposDescuento.codTipoDescuento)===0) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el descuento de cliente" });
                
                return false;
            }*/
            if (parseFloat($scope.salidasVenta.fechaSalidaVenta)===0) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre la fecha" });
                
                return false;
            }
            if (parseFloat($scope.salidasVenta.tiposVenta.codTipoVenta)===2 && isNaN(parseFloat($scope.salidasVentaTotal.montoCancelado))) {//pago a credito(debe tener monto el monto inicial)
                $.growl.warning({title:"ADVERTENCIA!", message: "Ingrese un monto inicial valido" });                
                return false;
            }
            
            if (parseFloat($scope.salidasVenta.tiposVenta.codTipoVenta)===2 && (parseFloat($scope.salidasVentaTotal.montoCancelado)<=0 
                    || parseFloat($scope.salidasVentaTotal.montoCancelado)>=parseFloat($scope.salidasVentaTotal.montoTotal))) {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el monto inicial menor al total" });                
                return false;
            }
            if ($scope.salidasVenta.fechaPagoCredito.trim()==="") {
                $.growl.warning({title:"ADVERTENCIA!", message: "ingrese la fecha de pago a credito" });                
                return false;
            }
            
            
            return true;
    };
    $scope.validarDetalle = function(){
        
        if($scope.salidasVentaDetalleList.length<=0){
            $.growl.warning({title:"ADVERTENCIA!", message: "Registre el detalle"});
            return false;
        }
        return true;
        
    };
    
    
    
    
    
    
    $scope.generarFactura_action = function(sa){
        
        if (parseFloat(sa.nroFactura)>0) {                
                $.growl.error({title:"ADVERTENCIA!", message: "no se puede generar, ya se emitio la factura nro "+sa.nroFactura });
                return null;
            }
            sa.almacenesVenta.sucursalVentas.codSucursal = angular.copy($scope.usuarioPersonal.sucursalVentas.codSucursal);
            
        $q.all([
            Data.post("/facturasEmitidas/generarFactura", sa).then(function(facturaEmitida){
                console.log(facturaEmitida);
                if(facturaEmitida.error.codError===1){
                    $.growl.error({title:"Error!", message: "Error: "+facturaEmitida.error.descrError });
                    throw new Error(facturaEmitida.error.descrError);//genera error para que no continue con el then del q.all
                }                
                
                $scope.facturaGenerada = angular.copy(facturaEmitida);
                
             })
        ]).then(function () {            
            //se debe generar el libro de ventas
            DataCont.get("/libroVentas/libroVentas").then(function(data){
                $scope.libroVentas = data;//colocar los datos de libro de ventas
                
                $scope.libroVentas.especificacion = 3;//3:venta standard
                $scope.libroVentas.numero = 0;
                $scope.libroVentas.fechaFactura = $scope.facturaGenerada.fechaFactura;
                $scope.libroVentas.nroFactura = $scope.facturaGenerada.nroFactura;//int<=varchar
                $scope.libroVentas.nroAutorizacion = $scope.facturaGenerada.nroAutorizacion;
                $scope.libroVentas.codEstado = "";//?
                $scope.libroVentas.clientes.codCliente = $scope.facturaGenerada.salidasVenta.clientes.codCliente;//el cliente en ambos servicios es distinto
                $scope.libroVentas.montoTotal = $scope.facturaGenerada.montoTotal;
                $scope.libroVentas.montoIceIehdTasas = 0;//?
                $scope.libroVentas.montoExportOperac = 0;//?
                $scope.libroVentas.montoVtasGrvTasaCero = 0;//?
                $scope.libroVentas.montoSubTotal = $scope.facturaGenerada.montoSubTotal;//?
                $scope.libroVentas.montoDctosBonific = 0;//?
                $scope.libroVentas.importeBaseCreditoFiscal = $scope.libroVentas.montoSubTotal-$scope.libroVentas.montoDctosBonific;//?
                $scope.libroVentas.debitoFiscal = $scope.libroVentas.importeBaseCreditoFiscal*0.13;
                $scope.libroVentas.codigoControl = $scope.facturaGenerada.codigoControl;
                console.log($scope.libroVentas);
                DataCont.post("/libroVentas/guardarLibroVentas",$scope.libroVentas).then(function(libroVentas){//libro de ventas retornado despues de guardar con codLibroVentas
                    console.log(libroVentas);                    
                    //actualizar el tipo documendo despues de generar la factura
                    sa.tiposDocumento.codTipoDocumento = 1;//factura
                    sa.libroVentas.codLibroVentas = libroVentas.codLibroVentas;
                    Data.post("/salidasVenta/editarSalidasVenta", sa).then(function(data){
                        console.log(data);
                        $.growl.notice({title:"NOTIFICACION!", message: "factura nro "+$scope.facturaGenerada.nroFactura+" generada "});
                        $location.path("navegadorFacturasEmitidas");
                    });
                    
                });                
            });
                        
        });
        
    };
    
    $scope.guardarSalidaVenta_action = function(){//funcion principal
        
            $scope.cajaChica = angular.copy(obtenerSession("cajaChica"));
            
            
            
            if(confirm("esta seguro de generar la factura?")===false){
                return null;
            }
            
            
        
            //validaciones
            $scope.desabilitarBotonGuardar = true;
            $scope.salidasVenta.ventaCompleta = $scope.salidasVenta.tiposVenta.codTipoVenta===1?3:$scope.salidasVenta.ventaCompleta;//al contado
            $scope.salidasVenta.ventaCompleta = $scope.salidasVenta.tiposVenta.codTipoVenta===2?2:$scope.salidasVenta.ventaCompleta;//a credito
            
            $scope.salidasVenta.estadosSalidaVenta.codEstadoSalidaVenta = 1;
            $scope.salidasVenta.tiposSalidaVenta.codTipoSalidaVenta=1;
            $scope.salidasVenta.fechaSalidaVenta = obtieneFechaActual();
            //asignacion de valores totales
            $scope.salidasVenta.montoSubTotal = $scope.salidasVentaTotal.montoSubTotal;
            $scope.salidasVenta.montoDescuento = $scope.salidasVentaTotal.montoDescuento;
            $scope.salidasVenta.montoTotal = $scope.salidasVentaTotal.montoTotal;            
            
            $scope.salidasVentaTotal.montoCancelado=isNaN($scope.salidasVentaTotal.montoCancelado)?0:$scope.salidasVentaTotal.montoCancelado;
            $scope.salidasVenta.montoTotal = isNaN($scope.salidasVenta.montoTotal)?0:$scope.salidasVenta.montoTotal;
            $scope.salidasVenta.montoCancelado = isNaN($scope.salidasVenta.montoCancelado)?0:$scope.salidasVenta.montoCancelado;
            
            $scope.salidasVenta.montoCancelado = parseFloat($scope.salidasVentaTotal.montoCancelado);
            $scope.salidasVenta.montoPorCobrar = parseFloat($scope.salidasVenta.montoTotal) - parseFloat($scope.salidasVenta.montoCancelado);
            
            
            
            $scope.salidasVentaBusiness.salidasVenta = angular.copy($scope.salidasVenta);
            $scope.salidasVentaBusiness.salidasVentaDetalleList = angular.copy($scope.salidasVentaDetalleList);            
            $scope.salidasVentaBusiness.facturasEmitidas = angular.copy($scope.facturaEmitida);
            $scope.salidasVentaBusiness.cajaChica = angular.copy($scope.cajaChica);//incluyendo caja chica
            console.log($scope.salidasVenta);
            console.log($scope.salidasVentaDetalleList);
            
            console.log($scope.salidasVentaBusiness);
            //mostrarVentanaModal('progressDialog');
            Data.post("/facturasEmitidas/guardarFacturaEmitidaBusiness", $scope.salidasVentaBusiness).then(function(data){
                //window.location = "navegadorSalidasVenta.html";
                //ocultarVentanaModal('#progressDialog');
                //generar factura
                //console.log(data.salidasVenta);
                //$scope.generarFactura_action(data.salidasVenta); verificar luego generacion de facturas
                if(data.salidasVenta.codSalidaVenta>0){//se guardo sin error
                    //preparar para enviar al servicio de facturacion electronica
                    //cafc
                    $scope.facturaElectronicaCompraVenta.cabecera.codigoCliente = $scope.salidasVenta.clientes.nitCliente; //nit de cliente
                    $scope.facturaElectronicaCompraVenta.cabecera.codigoDocumentoSector = $scope.parametros.codigoDocumentoSector; // 0
                    $scope.facturaElectronicaCompraVenta.cabecera.codigoExcepcion = "";
                    $scope.facturaElectronicaCompraVenta.cabecera.codigoMetodoPago = $scope.facturaEmitida.tiposPago.codTipoPago;
                    $scope.facturaElectronicaCompraVenta.cabecera.codigoMoneda = 1;//Boliviano
                    $scope.facturaElectronicaCompraVenta.cabecera.codigoPuntoVenta = $scope.parametros.codigoPuntoVenta;
                    $scope.facturaElectronicaCompraVenta.cabecera.codigoSucursal = $scope.parametros.codigoSucursal;
                    $scope.facturaElectronicaCompraVenta.cabecera.codigoTipoDocumentoIdentidad = 1;//"CI - CEDULA DE IDENTIDAD"
                    DataFact.post("/facturacionelectronica/generaCUF",$scope.facturaElectronicaCompraVenta).then(function(data) {
                        $scope.facturaElectronicaCompraVenta.cabecera.cuf = data;//generar el codigo unico de factura
                    });
                    $scope.facturaElectronicaCompraVenta.cabecera.cufd = $scope.parametros.cufd;
                    $scope.facturaElectronicaCompraVenta.cabecera.descuentoAdicional = 0;
                    $scope.facturaElectronicaCompraVenta.cabecera.direccion = $scope.parametros.direccion;                    
                    $scope.facturaElectronicaCompraVenta.cabecera.fechaEmision = $scope.fechaHoraEmision;                    
                    $scope.facturaElectronicaCompraVenta.cabecera.leyenda = $scope.leyendasList[0].nombreItem;
                    $scope.facturaElectronicaCompraVenta.cabecera.montoGiftCard = null;
                    $scope.facturaElectronicaCompraVenta.cabecera.montoTotal = $scope.salidasVenta.montoTotal;
                    $scope.facturaElectronicaCompraVenta.cabecera.montoTotalMoneda = $scope.salidasVenta.montoTotal;
                    $scope.facturaElectronicaCompraVenta.cabecera.montoTotalSujetoIva = $scope.salidasVenta.montoTotal;
                    $scope.facturaElectronicaCompraVenta.cabecera.municipio = obtieneParametroFactura("MUNICIPIO");
                    $scope.facturaElectronicaCompraVenta.cabecera.nitEmisor = $scope.parametros.nit;
                    $scope.facturaElectronicaCompraVenta.cabecera.nombreRazonSocial = $("#codCliente option:selected").text();//a la cual se emite la factura
                    $scope.facturaElectronicaCompraVenta.cabecera.numeroDocumento = $scope.salidasVenta.clientes.nitCliente;//nro doc del cliente
                    $scope.facturaElectronicaCompraVenta.cabecera.numeroFactura = data.facturasEmitidas.nroFactura;//nro de factura generada
                    $scope.facturaElectronicaCompraVenta.cabecera.numeroTarjeta = null;
                    $scope.facturaElectronicaCompraVenta.cabecera.razonSocialEmisor = $scope.usuarioPersonal.empresas.nombreEmpresa;
                    $scope.facturaElectronicaCompraVenta.cabecera.telefono = $scope.usuarioPersonal.empresas.telefono;//telefono del emisor
                    $scope.facturaElectronicaCompraVenta.cabecera.tipoCambio = 1;
                    $scope.facturaElectronicaCompraVenta.cabecera.usuario = $scope.usuarioPersonal.personal.nombrePersonal;
                    
                    //obtener de la lista el primer registro
                    for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
                        $scope.detalleFacturaCompraVenta = angular.copy($scope.detalleFacturaCompraVentaObj);
                        $scope.detalleFacturaCompraVenta.actividadEconomica = $scope.actividadesList[0].codItem;
                        $scope.detalleFacturaCompraVenta.codigoProductoSin = $scope.productosList[0].codItem;
                        $scope.detalleFacturaCompraVenta.codigoProducto = $scope.salidasVentaDetalleList[i].productos.codProducto;
                        $scope.detalleFacturaCompraVenta.descripcion = $scope.salidasVentaDetalleList[i].productos.nombreProducto;
                        $scope.detalleFacturaCompraVenta.cantidad = $scope.salidasVentaDetalleList[i].cantSalida;
                        $scope.detalleFacturaCompraVenta.unidadMedida = 57;//"UNIDAD (BIENES)"
                        $scope.detalleFacturaCompraVenta.precioUnitario = $scope.salidasVentaDetalleList[i].costoUnitario;
                        $scope.detalleFacturaCompraVenta.montoDescuento = 0;
                        $scope.detalleFacturaCompraVenta.subTotal = $scope.salidasVentaDetalleList[i].montoSubTotal;
                        $scope.detalleFacturaCompraVenta.numeroSerie = "";//numero serie del producto
                        $scope.detalleFacturaCompraVenta.numeroImei = "";//imei del celular
                        $scope.facturaElectronicaCompraVenta.detalle.push($scope.detalleFacturaCompraVenta);                    
                    }                    
                    
                    
                    $scope.parametros.facturaElectronicaCompraVentaList.push($scope.facturaElectronicaCompraVenta);//una sola factura 
                    console.log($scope.parametros);
                    //peticion para enviar a facturacion electronica
                    DataFact.post("/facturacionCompraVenta/enviarFacturaCompraVenta",$scope.parametros).then(function(data) {                                
                            console.log(data);
                        
                            //$location.path("navegadorFacturasEmitidas");                                
                    });
                    //guardar un ingreso en caja chica
                    
                }
                
            });
            
           
            
        
    };
    $scope.grupoProducto_change = function(g){
        //seteamos al mismo objeto de busqueda para realizar la busqueda
        $scope.productosBuscar.subGruposProducto.gruposProducto.codGrupoProducto = $scope.productosBuscar.grupoProducto.codGrupoProducto;
        Data.post('/subGruposProducto/cargarSubGruposProductoItem', $scope.productosBuscar.subGruposProducto).then(function(data){
            $scope.subGruposList = data;            
        });
    };
    $scope.actualizarClientes_action = function(){
        Data.get('/cliente/cargarClienteItem').then(function(data){
            $scope.clienteList = data;
            $scope.clienteList.splice(0,0,item);
        });
    };
    $scope.abrirClientes_action=function(){
        $window.open("/farmacia/navegador.html#/navegadorClientes");
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
        for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
            
            if($scope.salidasVentaDetalleList[i].productos.codBarrasProducto.trim()===$scope.productosBuscar.codBarrasProducto.trim()){                
               $.growl.warning({title:"ADVERTENCIA!", message: "El producto con el codigo de barras "+$scope.productosBuscar.codBarrasProducto+" ya esta registrado"});
               return;
            }
        }
        console.log($scope.productosBuscar);
        
        //buscar producto con el codigo de barras
        Data.post('/productos/buscarProductos', $scope.productosBuscar).then(function(producto){            
            if(producto.codProducto===0){                
                $.growl.warning({title:"ADVERTENCIA!", message: "El producto con el codigo de barras no existe"});                
                return null;
            }
            /*copia de seleccionar producto*/
            $scope.sd = angular.copy($scope.salidasVentaDetalle);
            $scope.sd.productos=angular.copy(producto);
            $scope.sd.unidadesMedida = angular.copy(producto.unidadesMedida);
            $scope.sd.salidasVenta = angular.copy($scope.salidasVenta);
            $scope.sd.costoUnitario = angular.copy(producto.precioVenta);
            console.log($scope.sd);
            console.log("costo unitario"+producto.precioVenta);
            $scope.sadi.ingresosVentaDetalle.ingresosVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);//que muestre del almacen y producto su cantidad restante
            $scope.sadi.ingresosVentaDetalle.productos = angular.copy(producto);
            $q.all([
                Data.post('/salidasVentaDetalle/cantRestanteIngresoVentaDetalle', $scope.sd).then(function(data){
                    console.log(data);
                    $scope.sd.ingresosVentaDetalle.cantRestante = parseInt(data);
                    //para despliegue en la parte inferior de modal
                    $scope.productosSalida.cantRestante = parseInt(data);
                    $scope.productosSalida.unidadesMedida = angular.copy(producto.unidadesMedida);            
                })
            ]).then(function () {
                console.log("la cantidad restante "+$scope.productosSalida.cantRestante);
                $scope.productosSalida.cantSalida=1;//sacaremos 1 unidad modificable
                $scope.guardarAgregarProducto_action();
                $scope.productosBuscar = angular.copy($scope.productos);//limpiamos el objeto de busqueda
            });
        
            
            
            
        });
        
    };
    
    
   
    
}
]);
});

