define(['app'], function(app)
{
app.controller('navegadorSalidasVentaController',
    ['$scope','Data','$location','$window','DataCont','$q',
function ($scope, Data,$location,$window,DataCont,$q) {
    
    $scope.salidasVenta = {};//salidasVentaBuscar
    $scope.salidasVentaBuscar = {};//salidasVentaBuscar
    $scope.salidasVentaList = [];
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.salidasVentaBusiness = {};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    
    
    Data.get('/salidasVenta/salidasVenta').then(function(data){
         console.log(data);
         $scope.salidasVenta = data;
         $scope.salidasVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);
         $scope.salidasVenta.gestion = angular.copy($scope.usuarioPersonal.gestion);
         $scope.salidasVenta.filaInicial = 0;//de este floor a 10
         
         $scope.salidasVentaBuscar = angular.copy($scope.salidasVenta);
         $scope.salidasVentaBuscar.fechaSalidaVentaInicio = "";
         $scope.salidasVentaBuscar.fechaSalidaVentaFinal = "";
         
         //console.log($scope.salidasVentaBuscar);
         //console.log($scope.salidasVenta);
         console.log(sessionStorage.getItem("salidasVentaBuscar"));
        
         
        if(sessionStorage.getItem("salidasVentaBuscar")!==null){
            $scope.salidasVentaBuscar =JSON.parse(sessionStorage.getItem("salidasVentaBuscar"));
         }
         
         Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
            $scope.salidasVentaList = data;
            console.log(data);
         });
         
         
         $scope.salidasVenta =JSON.parse(sessionStorage.getItem("salidasVentaEditar"));
         
    });
    Data.get('/cliente/cargarClienteItem').then(function(data){
        $scope.clientesList = data;
        $scope.clientesList.splice(0,0,item);
    });
    
    
    Data.get('/tablaDetalle/tablaDetalle').then(function(data){
        $scope.tablaDetalleAlmacenVenta = data;
        console.log($scope.tablaDetalleAlmacenVenta);
        $scope.tablaDetalleAlmacenVenta.tabla.nombreTabla = "ESTADOS_SALIDA_VENTA";

        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalleAlmacenVenta).then(function(data){
           $scope.estadosSalidaVentaList = data;
           $scope.salidasVentaBuscar.estadosSalidaVenta.codEstadoSalidaVenta = $scope.estadosSalidaVentaList[0].codItem;
           console.log(data);
        });
    });
    
    $scope.cajaChica = angular.copy(obtenerSession("cajaChica"));    
    
    
    
        
    
    $('#fechaSalidaVentaInicio .input-group.date').datepicker({
    language: "es",
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: true
    }).on('changeDate', function (e) {
        $scope.salidasVentaBuscar.fechaSalidaVentaInicio = formatoFecha(e.date);
    });
    
    $('#fechaSalidaVentaFinal .input-group.date').datepicker({
    language: "es",
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: true
    }).on('changeDate', function (e) {
        $scope.salidasVentaBuscar.fechaSalidaVentaFinal = formatoFecha(e.date);
    });

        
    
    
    /*Data.get('/proveedores/cargarProveedoresItem').then(function(data){
        $scope.proveedoresList = data;
        $scope.proveedoresList.splice(0,0,item);
    });*/
    /*Data.get('/estadosSalidaVenta/cargarEstadosSalidaVentaItem').then(function(data){
        $scope.estadosSalidaVentaList = data;
        $scope.estadosSalidaVentaList.splice(0,0,item);
    });*/
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.salidasVentaBuscar);
        $scope.salidasVentaBuscar.filaInicial = parseInt($scope.salidasVentaBuscar.filaInicial) + 10;
        sessionStorage.setItem("salidasVentaBuscar",  JSON.stringify($scope.salidasVentaBuscar));
        Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
            $scope.salidasVentaList = data;
            console.log(data);
            sessionStorage.setItem("salidasVentaBuscar",  JSON.stringify($scope.salidasVentaBuscar));
         });
    };
    $scope.atras_action = function(){
        $scope.salidasVentaBuscar.filaInicial = parseInt($scope.salidasVentaBuscar.filaInicial) - 10;
        sessionStorage.setItem("salidasVentaBuscar",  JSON.stringify($scope.salidasVentaBuscar));
        Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
            $scope.salidasVentaList = data;
            console.log(data);
            sessionStorage.setItem("salidasVentaBuscar",  JSON.stringify($scope.salidasVentaBuscar));
         });
    };
    $scope.agregarSalidaVenta_action = function() {        
        //window.location = "agregarSalidasVenta.html";
        //validar si tiene caja chica
        console.log($scope.cajaChica);
        if($scope.cajaChica.personal.codPersonal>0){//existe la caja chica con el personal
            $location.path("agregarSalidasVenta");
        }else{
            $.growl.error({title:"ADVERTENCIA!", message: " Debe aperturar la caja chica " });
            return null;
        }
        
    };
    $scope.editarSalidaVenta_action = function(){
        //validaciones
        
        var i=0;        
        for(i=0;i<$scope.salidasVentaList.length;i++){
            if($scope.salidasVentaList[i].checked===true){                
                sessionStorage.setItem("salidasVentaEditar",  JSON.stringify(angular.copy($scope.salidasVentaList[i])));
                break;
            }
        }
        $location.path("editarSalidasVenta");
        //window.location = "editarSalidaVenta.html";
    };
    $scope.devolverSalidaVenta_action = function(sa){
        //validaciones
        
        sessionStorage.setItem("salidasVenta",  JSON.stringify(angular.copy(sa)));
        $location.path("agregarIngresosVentaDevolucion");
        //window.location = "editarSalidaVenta.html";
    };
    $scope.editarSalidaVenta3_action = function(sa){
        if (parseFloat(sa.nroFactura)>0) {                
                $.growl.error({title:"ADVERTENCIA!", message: "no se puede editar, ya se emitio la factura nro "+sa.nroFactura });
                return null;
            }
        console.log("entro.....>");
        sessionStorage.setItem("salidasVentaEditar",  JSON.stringify(angular.copy(sa)));
        $location.path("editarSalidasVenta");
        //window.location = "editarSalidaVenta.html";
    };
    $scope.mostrarBuscarSalidaVenta_action = function(){        
        //$('#buscaringresoVentaDialog').modal('show');
        //appending modal background inside the bigform-content
        //$('.modal-backdrop').appendTo('.container');
        //removing body classes to able click events
        //$('body').removeClass();
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarsalidaVentaDialog");
    };
    $scope.buscarSalidaVenta_action = function(){
        Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
            $scope.salidasVentaList = data;
            console.log(data);
         });
         //console.log("entro hide:::");
         ocultarVentanaModal("#buscarsalidaVentaDialog");
    };
    $scope.generarFactura_action = function(sa){
        if(confirm("esta seguro de generar la factura?")===false){
            return null;
        }
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
                Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
                    $scope.salidasVentaList = data;
                    console.log(data);
                });
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
                        Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(salidasVentaList){
                            $scope.salidasVentaList = salidasVentaList;
                            console.log(salidasVentaList);
                        });
                    });
                    
                });                
            });
                        
        });
        
    };
    $scope.eliminarSalidaVenta_action = function(sa){
        if (parseFloat(sa.nroFactura)>0) {                
                $.growl.error({title:"ADVERTENCIA!", message: "no se puede eliminar, ya se emitio la factura nro "+sa.nroFactura });
                return null;
            }
        //console.log("entro eliminar");
        if(confirm("esta seguro de eliminar la salida venta?")===false){
            return;
        }
        
        $scope.salidasVentaBusiness.salidasVenta = angular.copy(sa);
        console.log($scope.salidasVentaBusiness);
        
        //$scope.salidasVentaBusiness.salidasVentaDetalleList = angular.copy($scope.salidasVentaDetalleList);
            
        Data.post("/salidasVenta/eliminarSalidasVentaBusiness", $scope.salidasVentaBusiness).then(function(data){
            //$scope.salidasVentaList = data;
            Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
                $scope.salidasVentaList = data;
                console.log(data);
            });
         });
    };
    
    
    $scope.anularSalidaVenta_action = function(sa){
        if (parseFloat(sa.nroFactura)>0) {                
                $.growl.error({title:"ADVERTENCIA!", message: "no se puede anular, ya se emitio la factura nro "+sa.nroFactura });
                return null;
            }
        //console.log("entro eliminar");
        if(confirm("esta seguro de anular la salida venta?")===false){
            return;
        }
        
        $scope.salidasVentaBusiness.salidasVenta = angular.copy(sa);
        console.log($scope.salidasVentaBusiness);
        
        //$scope.salidasVentaBusiness.salidasVentaDetalleList = angular.copy($scope.salidasVentaDetalleList);
            
        Data.post("/salidasVenta/anularSalidasVentaBusiness", $scope.salidasVentaBusiness).then(function(data){
            //$scope.salidasVentaList = data;
            Data.post("/salidasVenta/cargarSalidasVenta", $scope.salidasVentaBuscar).then(function(data){
                $scope.salidasVentaList = data;
                console.log(data);
            });
         });
    };
    
    $scope.verFactura_action = function(s){
        console.log(s);
        $window.open(pathFarmaciaReportes+"/factura/reporteFacturaPdf.jsp?codSalidaVenta="+s.codSalidaVenta +"&codFacturaEmitida="+s.codFacturaEmitida+"&montoTotal="+s.montoTotal+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
    };
    
    $scope.reporteSalidaVenta_action = function(s){
        console.log(s);
        $window.open(pathFarmaciaReportes+"/salidasAlmacen/salidasAlmacenPdf/reporteSalidasAlmacenPdf.jsp?codSalidaVenta="+s.codSalidaVenta);
    };
    
    
    
}
]);
});
