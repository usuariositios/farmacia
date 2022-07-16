define(['app'], function(app)
{
app.controller('agregarSalidasVentaAmortizacionController',
    ['$scope','Data','$location',
function ($scope, Data,$location) {    
    
    $scope.salidasVenta = {};
    
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    $scope.salidasVenta = obtenerSession("salidasVentaAmortizacion");
    $scope.salidasVentaAmortizacion = {};
    $scope.salidasVentaAmortizacionAgr = {};
    $scope.salidasVentaAmortizacionList = [];
    $scope.montoTotalPagado = 0;
   
    
    
    //$scope.salidasVenta =JSON.parse(sessionStorage.getItem("salidasVentaEditar"));
    //console.log($scope.salidasVenta);    
    
    $scope.obtieneTotalAmortizacion = function(){
        $scope.salidasVenta.montoAmortizado = 0;
        for(i=0;i<$scope.salidasVentaAmortizacionList.length;i++){
            $scope.salidasVenta.montoAmortizado =  parseFloat($scope.salidasVenta.montoAmortizado)+parseFloat($scope.salidasVentaAmortizacionList[i].montoPagado);
        }
        $scope.salidasVenta.montoAmortizado = Math.round($scope.salidasVenta.montoAmortizado*100)/100;
        $scope.salidasVenta.montoPorCobrar =  $scope.salidasVenta.montoTotal - (parseFloat($scope.salidasVenta.montoCancelado) + parseFloat($scope.salidasVenta.montoAmortizado));
        $scope.salidasVenta.montoPorCobrar = Math.round($scope.salidasVenta.montoPorCobrar*100)/100;
        $scope.montoTotalPagado = parseFloat($scope.salidasVenta.montoCancelado) + parseFloat($scope.salidasVenta.montoAmortizado);
        $scope.montoTotalPagado = Math.round($scope.montoTotalPagado*100)/100;
        //verificar si se completo la venta
        
        
    };
    
    Data.get('/salidasVentaAmortizacion/salidasVentaAmortizacion').then(function(data){
        
        $scope.salidasVentaAmortizacion = angular.copy(data);
        $scope.salidasVentaAmortizacion.salidasVenta = angular.copy($scope.salidasVenta);
        Data.post('/salidasVentaAmortizacion/cargarSalidasVentaAmortizacion',$scope.salidasVentaAmortizacion).then(function(data){
                console.log(data);
                $scope.salidasVentaAmortizacionList = data;
                $scope.obtieneTotalAmortizacion();
        });
        
    });
    
    
    
    $scope.agregarPagoAmortizacion_action = function(){
        //$scope.productosBuscarList=[];
        $scope.salidasVentaAmortizacionAgr = angular.copy($scope.salidasVentaAmortizacion);
        
        $('#fecha_pago .input-group.date').datepicker({
        language: "es",
        format: "dd/mm/yyyy",
        autoclose: true,
        todayHighlight: true,
        startDate:fechaActualDDMMYYYY()
        
            }).datepicker("setDate",new Date()).on('changeDate', function (e) {
                $scope.salidasVentaAmortizacionAgr.fechaPago = formatoFecha(e.date);
            });
        $scope.salidasVentaAmortizacionAgr.fechaPago = fechaActualDDMMYYYY();
        mostrarVentanaModal("agregarPagoAmortizacionDialog");
    };
    $scope.guardarAgregarPagoAmortizacion_action=function(){
        if($scope.montoTotalPagado + parseFloat($scope.salidasVentaAmortizacionAgr.montoPagado) > $scope.salidasVenta.montoTotal){
            $.growl.warning({title:"ADVERTENCIA!", message: "El monto de pago sobrepasa el total a pagar" });
            return null;
        }
        if(parseFloat($scope.salidasVentaAmortizacionAgr.montoPagado)<=0){
            $.growl.warning({title:"ADVERTENCIA!", message: "Ingrese un monto valido" });
            return null;
        }
        $scope.salidasVentaAmortizacionList.push($scope.salidasVentaAmortizacionAgr);
        $scope.obtieneTotalAmortizacion();
        $('#agregarPagoAmortizacionDialog').modal('hide');
    };
    
    $scope.guardarPagoAmortizacion_action = function(){
        if(confirm("Esta seguro de realizar el pago de amortizacion?")===false){
                return;
        }
        if($scope.salidasVenta.montoPorCobrar===0){
            $scope.salidasVenta.ventaCompleta = 3;//se completo la amortizacion
        }
        $scope.salidasVentaAmortizacionGuardar = {
            salidasVenta:{},
            salidasVentaAmortizacionList:[]
        };
        $scope.salidasVentaAmortizacionGuardar.salidasVenta = angular.copy($scope.salidasVenta);
        $scope.salidasVentaAmortizacionGuardar.salidasVentaAmortizacionList = angular.copy($scope.salidasVentaAmortizacionList);
        
        Data.post("/salidasVentaAmortizacion/guardarSalidasVentaAmortizacionBusiness",$scope.salidasVentaAmortizacionGuardar).then(function(data){
            console.log(data);
        });
        $location.path("navegadorSalidasVentaAmortizacion");
    };
    $scope.cancelarPagoAmortizacion_action = function(){
        
        $location.path("navegadorSalidasVentaAmortizacion");
    };
    
    $scope.borrarAmortizacionDetalle_action = function(ad){        
        //eliminar el registro
        var i = 0;        
        for(i=0;i<$scope.salidasVentaAmortizacionList.length;i++){
            if(parseInt($scope.salidasVentaAmortizacionList[i].codAmortizacion) === parseInt(ad.codAmortizacion)){
                $scope.salidasVentaAmortizacionList.splice(i,1);//eliminar un elemento en el indice i
            }
        }
        $scope.obtieneTotalAmortizacion();
    };
    
    
    
   
    
}
]);
});

