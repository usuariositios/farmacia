define(['app'], function(app)
{
app.controller('navegadorProveedoresController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {    
    //try {    
    $scope.proveedoresBuscar = {};//proveedoresBuscar
    $scope.proveedor = {};//proveedoresBuscar
    $scope.proveedorCopia = {};//proveedoresBuscar
    $scope.proveedoresList = {};
    
    $scope.tiposProveedorList = [];
    $scope.estadosRegistroList = [];
    $scope.monedasList = [];
    $scope.tiposPagoList = [];
    $scope.tiposDocumentoList = [];
    $scope.paisList = [];
    $scope.ciudadList = [];
    $scope.tiposMedioPagoList = [];
    
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    
    
    Data.get("/tiposProveedor/cargarTiposProveedorItem").then(function(data){
            $scope.tiposProveedorList = data;
            $scope.tiposProveedorList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    Data.get("/estadosRegistro/cargarEstadosRegistroItem").then(function(data){
            $scope.estadosRegistroList = data;
            $scope.estadosRegistroList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    
    Data.get("/moneda/cargarMonedasItem").then(function(data){
            $scope.monedasList = data;
            $scope.monedasList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    Data.get("/tiposPago/cargarTiposPagoItem").then(function(data){
            $scope.tiposPagoList = data;
            $scope.tiposPagoList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    
    Data.get('/tiposDocumento/cargarTiposDocumentoItem').then(function(data){
        $scope.tiposDocumentoList = data;
        $scope.tiposDocumentoList.splice(0,0,item);//index,?,item
    });
    Data.get('/pais/cargarPaisItem').then(function(data){
        $scope.paisList = data;
        $scope.paisList.splice(0,0,item);//index,?,item
    });
    Data.get('/ciudad/cargarCiudadItem').then(function(data){
        $scope.ciudadList = data;
        $scope.ciudadList.splice(0,0,item);//index,?,item
    });
    Data.get('/tiposMedioPago/cargarTiposMedioPagoItem').then(function(data){
        $scope.tiposMedioPagoList = data;
        $scope.tiposMedioPagoList.splice(0,0,item);//index,?,item
    });
    
    //busca el objeto proveedor luego carga la lista de proveedores
    Data.get('/proveedores/proveedores').then(function(data){
         $scope.proveedoresBuscar = data;
         $scope.proveedoresBuscar.filaInicial = 0;//de este floor a 10
         $scope.proveedorCopia = angular.copy($scope.proveedoresBuscar);
         console.log($scope.proveedoresBuscar);         
         Data.post("/proveedores/cargarProveedores", $scope.proveedoresBuscar).then(function(data){
            $scope.proveedoresList = data;
            console.log(data);
         });
    });
    
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.proveedoresBuscar);
        $scope.proveedoresBuscar.filaInicial = parseInt($scope.proveedoresBuscar.filaInicial) + 10;
        sessionStorage.setItem("proveedores",  JSON.stringify($scope.proveedoresBuscar));
        Data.post("/proveedores/cargarProveedores", $scope.proveedoresBuscar).then(function(data){
            $scope.tiposProveedorList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.proveedoresBuscar.filaInicial = parseInt($scope.proveedoresBuscar.filaInicial) - 10;
        sessionStorage.setItem("proveedores",  JSON.stringify($scope.proveedoresBuscar));
        Data.post("/proveedores/cargarProveedores", $scope.proveedoresBuscar).then(function(data){
            $scope.tiposProveedorList = data;
            console.log(data);
         });
    };
    $scope.agregarProveedor_action = function() {       
        $scope.proveedor = angular.copy($scope.proveedorCopia);
        mostrarVentanaModal("agregarProveedorDialog");
        
        /*$('#agregarProveedorDialog').modal('show');
        $('#agregarProveedorDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.cancelarAgregarProveedor_action = function() {
        ocultarVentanaModal('#agregarProveedorDialog');
        /*$('#agregarProveedorDialog').modal('show');
        $('#agregarProveedorDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.guardarProveedor_action = function() {
        if ( $scope.proveedor.nombreProveedor === "") {
                $scope.mensaje = "Registre Nombre proveedor";
                mostrarVentanaModal('mensajeDialog');
                return null;
        }
        if ( $scope.proveedor.nitProveedor === "") {
                $scope.mensaje = "Registre NIT proveedor";
                mostrarVentanaModal('mensajeDialog');
                return null;
        }
        if ( parseInt($scope.proveedor.tiposProveedor.codTipoProveedor) === 0) {
                $scope.mensaje = "Seleccione tipo proveedor";
                mostrarVentanaModal('mensajeDialog');
                return null;
        }
        
        
        
       
        
        $scope.proveedor.estadosProveedor.codEstadoProveedor = 1;
        console.log($scope.proveedor);
        Data.post('/proveedores/guardarProveedores', $scope.proveedor).then(function(data){            
            $('#agregarProveedorDialog').modal('hide');
            Data.post("/proveedores/cargarProveedores", $scope.proveedoresBuscar).then(function(data){
                $scope.proveedoresList = data;
                console.log(data);
            });
        });
    };
    $scope.editarProveedor_action = function(pr){
        /*var i=0;
        for(i=0;i<$scope.proveedoresList.length;i++){
            if($scope.proveedoresList[i].checked===true){
                $scope.proveedor = angular.copy($scope.proveedoresList[i]);                
                break;
            }
        }*/
        
        $scope.proveedor = angular.copy(pr);
        
        //$('#editarProveedorDialog').modal('show');
        //$('#editarProveedorDialog').appendTo('body');
        //$('body').removeClass();
        mostrarVentanaModal("editarProveedorDialog");
        
    };    
    
    
    $scope.guardarEditarProveedor_action = function() {
        if ( $scope.proveedor.nombreProveedor === "") {
                $scope.mensaje = "Registre Nombre proveedor";
                mostrarVentanaModal('mensajeDialog');
                return null;
        }
        if ( $scope.proveedor.nitProveedor === "") {
                $scope.mensaje = "Registre NIT proveedor";
                mostrarVentanaModal('mensajeDialog');
                return null;
        }
        if ( parseInt($scope.proveedor.tiposProveedor.codTipoProveedor) === 0) {
                $scope.mensaje = "Seleccione tipo proveedor";
                mostrarVentanaModal('mensajeDialog');
                return null;
        }
        Data.post('/proveedores/editarProveedores', $scope.proveedor).then(function(data){            
            $('#editarProveedorDialog').modal('hide');
            Data.post("/proveedores/cargarProveedores", $scope.proveedoresBuscar).then(function(data){
                $scope.proveedoresList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarProveedor_action = function(pr){
        if(confirm("esta seguro de eliminar el proveedor "+ pr.nombreProveedor+"?")==false){
            return null;
        }
        
        $scope.proveedor = angular.copy(pr);
        Data.post('/proveedores/eliminarProveedores', $scope.proveedor).then(function (data) {
            Data.post("/proveedores/cargarProveedores", $scope.proveedoresBuscar).then(function (data) {
                $scope.proveedoresList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarProveedor_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarProveedorDialog");
    };
    $scope.buscarProveedor_action = function(){
        Data.post("/proveedores/cargarProveedores", $scope.proveedoresBuscar).then(function (data) {
                $scope.proveedoresList = data;
                console.log(data);
            });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarProveedorDialog");
    };
    
    }
    ]);
});