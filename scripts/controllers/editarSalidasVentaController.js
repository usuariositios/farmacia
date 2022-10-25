define(['app'], function(app)
{
app.controller('editarSalidasVentaController',
    ['$scope','Data','$location','$window',
function ($scope, Data,$location,$window) {    
    
    $scope.salidasVenta = {}; 
    $scope.salidasVentaTotal = {};//de la fila total
    $scope.salidasVenta =JSON.parse(sessionStorage.getItem("salidasVentaEditar"));
    $scope.salidasVentaTotal = angular.copy($scope.salidasVenta);
    $scope.productos = {};
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.salidasVentaDetalleList = [];
    $scope.salidasVentaBusiness ={};
    $scope.sadi ={};//salida almacen detalle ingreso
    $scope.sadSeleccionado ={};
    $scope.productosSalida = {cantRestante:0,unidadesMedida:{},cantSalida:0};
    $scope.subGruposList = [];
    $scope.svdi ={};
    
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.salidasVenta.fechaPagoCredito = $scope.salidasVenta.fechaPagoCredito.substring(0,10);//quitamos la hora
    
    //$scope.salidasVenta =JSON.parse(sessionStorage.getItem("salidasVentaEditar"));
    //console.log($scope.salidasVenta);
    
    $scope.salidasVentaDetalleDevolverList = [];//detalle de productos que se borran (debe retornarse la cantidad restante)
    
    Data.get('/facturasEmitidas/facturasEmitidas').then(function(data){
        $scope.facturaEmitida = angular.copy(data);
    });
    
    Data.get('/personal/cargarPersonalItem').then(function(data){
        $scope.personalList = data;
        $scope.personalList.splice(0,0,item);
    });
    Data.get('/salidasVentaDetalle/salidasVentaDetalle').then(function(data){
        $scope.salidasVentaDetalle = data;
        console.log($scope.salidasVentaDetalle);
        
        var sad= angular.copy($scope.salidasVentaDetalle);
        sad.salidasVenta = angular.copy($scope.salidasVenta);
        
        Data.post('/salidasVentaDetalle/cargarSalidasVentaDetalle',sad).then(function(data){
            $scope.salidasVentaDetalleList = angular.copy(data);
            console.log($scope.salidasVentaDetalleList);
            
            
            for (var j = 0; j < $scope.salidasVentaDetalleList.length; j++) {
                var sd = $scope.salidasVentaDetalleList[j];
                sd.montoDescuento = parseFloat(sd.montoSubTotal)*parseFloat(sd.porcDescuento)/100;   //calculo del monto descuento a partir del porcentaje descuento
                sd.montoDescuento = Math.round(sd.montoDescuento*100)/100;
                for (var i = 0; i < sd.salidasVentaDetalleIngresosList.length; i++) {
                    
                    var sadi = sd.salidasVentaDetalleIngresosList[i];
                    sadi.ingresosVentaDetalle.cantRestante = parseFloat(sadi.ingresosVentaDetalle.cantRestante) + parseFloat(sadi.cantSacar);//se quita lo que se esta registrando en la salida de almacen
                }
            }
        });
    
    });
    
    $('#fecha_pago_credito .input-group.date').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true
        
    }).datepicker("setDate",creaDate($scope.salidasVenta.fechaPagoCredito)).on('changeDate', function (e) {
                $scope.salidasVenta.fechaPagoCredito = formatoFecha(e.date);
    });
    
    
    
    
    Data.get('/tiposSalidaVenta/cargarTiposSalidaVentaItem').then(function(data){
        $scope.tiposSalidaVentaList = data;
        $scope.tiposSalidaVentaList.splice(0,0,item);
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
    Data.get('/gruposProducto/cargarGruposProductoItem').then(function(data){
        $scope.gruposProductoList = data;
    });
    Data.get('/salidasVentaDetalleIngreso/salidasVentaDetalleIngreso').then(function(data){
        console.log(data);
        $scope.sadi = data;
        
        
        
    });
    $scope.cliente_change = function(){
        $scope.salidasVenta.clientes.nitCliente="";//para que busque por cod_cliente
        $scope.salidasVenta.clientes.nombreCliente="";
        Data.post('/cliente/buscarCliente', $scope.salidasVenta.clientes).then(function (data) {
            console.log(data);
            $scope.salidasVenta.clientes.nitCliente = data.nitCliente;
            $scope.salidasVenta.clientes.tiposDescuento = angular.copy(data.tiposDescuento);
        });
    };
                    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
                        $scope.tablaDetalleTiposVenta = data;
    
                        $scope.tablaDetalleTiposVenta.tabla.nombreTabla = "TIPOS_VENTA";
    
                        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalleTiposVenta).then(function (data) {
                            $scope.tiposVentaList = data;
                            console.log(data);
                        });
                    });
    
    
    
    $scope.agregarProducto_action = function(){
        $scope.productosBuscarList=[];
        
        console.log($scope.productosBuscar);
        mostrarVentanaModal("agregarProductoDialog");
    };
    
    $scope.buscarProducto_action = function(){
        
        /*if ( parseInt($scope.productosBuscar.grupoProducto.codGrupoProducto) === 0) {
                
                $.growl.warning({title:"ADVERTENCIA!", message: "Seleccione el grupo" });
                return null;
            }*/
        /*if ( $scope.productosBuscar.nombreProducto.trim().length < 3) {
                $.growl.warning({title:"ADVERTENCIA!", message: "ingrese al menos 3 caracteres del nombre de producto" });
                return null;
        }*/
        //colocar en string los codproducto para que no se tomen en cuenta
        var i = 0;
        var codProducto = "0";
        for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
            if($scope.salidasVentaDetalleList[i].eliminar===0){
            codProducto =codProducto +","+ $scope.salidasVentaDetalleList[i].productos.codProducto;
        }
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
        $scope.sd.costoUnitario = angular.copy(p.precioTienda);
        console.log("costo unitario"+p.precioTienda);
        $scope.sadi.ingresosVentaDetalle.ingresosVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);//que muestre del almacen y producto su cantidad restante
        $scope.sadi.ingresosVentaDetalle.productos = angular.copy(p);
        
        
        
        //colocar la cantidad restante en la salida detalle
        Data.post('/salidasVentaDetalle/cantRestanteIngresoVentaDetalle', $scope.sd).then(function(data){
            console.log(data);
            $scope.sd.ingresosVentaDetalle.cantRestante = parseInt(data);
            //para despliegue en la parte inferior de modal
            $scope.productosSalida.cantRestante = parseInt(data);
            $scope.productosSalida.unidadesMedida = angular.copy(p.unidadesMedida);            
        });
    };
    
    
    $scope.guardarSalidaVenta1_action = function(){
        //validaciones
        
        
            
            $scope.salidasVentaBusiness.salidasVenta = angular.copy($scope.salidasVenta);
            $scope.salidasVentaBusiness.salidasVentaDetalleList = angular.copy($scope.salidasVentaDetalleList);
            
            console.log($scope.salidasVentaBusiness);
            /*dataGet("/salidasVenta/codigoSalidasVenta", function(data) {
                $scope.salidasVenta.codSalidaVenta = data;
                Data.post("/salidasVenta/guardarSalidasVentaBusiness", $scope.salidasVentaBusiness).then(function(data){
                    $location.path("navegadorSalidasVenta");
                });
            },false);*/
            
            Data.post("/salidasVenta/guardarSalidasVentaBusiness", $scope.salidasVentaBusiness).then(function(data){
                    $location.path("navegadorSalidasVenta");
                });
            
            
            
            
            
            
            
            
    };
    
    $scope.cancelar_action = function(){
        //window.location = "navegadorSalidasVenta.html";
        $location.path("navegadorSalidasVenta");
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
                //$scope.salidasVentaDetalleDevolverList.push($scope.salidasVentaDetalleList[i]);
                //console.log($scope.salidasVentaDetalleDevolverList);
                //$scope.salidasVentaDetalleList.splice(i,1);//eliminar un elemento en el indice i
                $scope.salidasVentaDetalleList[i].eliminar=1;                
            }
        }        
    };
    $scope.cantidadProducto_change = function(sad){
           sad.montoSubTotal = redondeaDouble(parseFloat(sad.cantSalida) * parseFloat(sad.costoUnitario));
           calculaDescuentoDetalle(sad);
           obtieneCantidadTotal();
        
                
    };
    $scope.totalProducto_change = function(sad){
           sad.montoSubTotal = parseFloat(sad.cantSalida) * parseFloat(sad.costoUnitario);
    };
    $scope.verSalidaVentaDetalle_action = function(sad){
           
           //$scope.sadCopy = JSON.stringify(sad);//como string
           console.log(sad);
           $scope.svdi = angular.copy(sad.salidasVentaDetalleIngresosList);//copia de lo necesario;
           
           
           $scope.sadSeleccionado = sad;
           mostrarVentanaModal("detalleEtiquetasDialog");
    };
    $scope.cancelarDetalleCantSacar_action = function(){
            console.log($scope.svdi);
            $scope.sadSeleccionado.salidasVentaDetalleIngresosList = angular.copy($scope.svdi);//recuperando la copia
           $('#detalleEtiquetasDialog').modal('hide');
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
    $scope.guardarAgregarProducto_action = function(){
        
        
        var enDetalle = 0;
        //buscar el producto en el detalle
        for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
            if(parseInt($scope.salidasVentaDetalleList[i].productos.codProducto)===parseInt($scope.sd.productos.codProducto)){
                if($scope.salidasVentaDetalleList[i].eliminar === 0)
                {    enDetalle = 1;}
                else
                {
                    $scope.salidasVentaDetalleList.splice(i,1);                    
                }    
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
                $scope.salidasVentaTotal.montoDescuento = 0;
                $scope.salidasVentaTotal.montoTotal = 0;
                
                for(i=0;i<$scope.salidasVentaDetalleList.length;i++){
                    $scope.salidasVentaTotal.montoSubTotal = $scope.salidasVentaTotal.montoSubTotal + $scope.salidasVentaDetalleList[i].montoSubTotal;
                    $scope.salidasVentaTotal.montoCancelado = $scope.salidasVentaTotal.montoCancelado + $scope.salidasVentaDetalleList[i].montoCancelado;
                    $scope.salidasVentaTotal.montoDescuento = $scope.salidasVentaTotal.montoDescuento + $scope.salidasVentaDetalleList[i].montoDescuento;
                    $scope.salidasVentaTotal.montoTotal = $scope.salidasVentaTotal.montoTotal + $scope.salidasVentaDetalleList[i].montoTotal;
                }
                
                $scope.salidasVentaTotal.montoSubTotal = Math.round($scope.salidasVentaTotal.montoSubTotal*100)/100;
                $scope.salidasVentaTotal.montoCancelado = Math.round($scope.salidasVentaTotal.montoCancelado*100)/100;
                $scope.salidasVentaTotal.montoDescuento = Math.round($scope.salidasVentaTotal.montoDescuento*100)/100;
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
            /*if ($scope.salidasVenta.clientes.nitCliente.trim() === "") {
                $.growl.warning({title:"ADVERTENCIA!", message: "Registre el nit de cliente" });
                return false;
            }*/
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
            console.log($scope.salidasVentaTotal.montoCancelado + " " + $scope.salidasVentaTotal.montoTotal);
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
    
    $scope.guardarSalidaVenta_action = function(){            
            
            if($scope.validarDetalle()===false){
                return null;
            }
            //validaciones
            if($scope.validarSalidaVenta()===false){
                return null;
            }
            
            
            for (var j = 0; j < $scope.salidasVentaDetalleList.length; j++) {
                var sd = $scope.salidasVentaDetalleList[j];
                if(sd.eliminar===0){
                for (var i = 0; i < sd.salidasVentaDetalleIngresosList.length; i++) {
                    var sadi = sd.salidasVentaDetalleIngresosList[i];
                    sadi.ingresosVentaDetalle.cantRestante = parseFloat(sadi.ingresosVentaDetalle.cantRestante) - parseFloat(sadi.cantSacar);//se quita lo que se esta registrando en la salida de almacen
                }
            }
            }            
            //console.log($scope.salidasVentaDetalleList);
            //return;
            //asignacion de valores totales
            $scope.salidasVenta.montoSubTotal = $scope.salidasVentaTotal.montoSubTotal;
            $scope.salidasVenta.montoDescuento = $scope.salidasVentaTotal.montoDescuento;
            $scope.salidasVenta.montoTotal = $scope.salidasVentaTotal.montoTotal;            
            $scope.salidasVenta.montoCancelado = $scope.salidasVentaTotal.montoCancelado;
            $scope.salidasVenta.montoPorCobrar = parseFloat($scope.salidasVenta.montoTotal) - parseFloat($scope.salidasVenta.montoCancelado);
            
            $scope.salidasVentaBusiness.salidasVenta = angular.copy($scope.salidasVenta);
            $scope.salidasVentaBusiness.salidasVentaDetalleList = angular.copy($scope.salidasVentaDetalleList);
            $scope.salidasVentaBusiness.facturasEmitidas = angular.copy($scope.facturaEmitida);
            
            console.log($scope.salidasVentaBusiness);
            
            
            Data.post("/salidasVenta/editarSalidasVentaBusiness", $scope.salidasVentaBusiness).then(function(data){
                //window.location = "navegadorSalidasVenta.html";
                $location.path("navegadorSalidasVenta");
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
   
    
}
]);
});
