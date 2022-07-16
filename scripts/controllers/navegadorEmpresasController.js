define(['app'], function(app)
{
app.controller('navegadorEmpresasController',
    ['$scope','Data','$location',
    function ($scope, Data,$location) {    
    //try {
    
    $scope.empresasBuscar = {};//empresasBuscar
    $scope.empresa = {};//empresasBuscar
    $scope.empresaObj = {};//empresasBuscar
    $scope.empresasList = [];
    $scope.estadosRegistroList = [];
    $scope.ciudadList = [];
    $scope.monedaList = [];
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    
    
    
    Data.get("/estadosRegistro/cargarEstadosRegistroItem").then(function(data){
            $scope.estadosRegistroList = data;
            $scope.estadosRegistroList.splice(0,0,item);
            console.log(data);
    });
    Data.get("/ciudad/cargarCiudadItem").then(function(data){
            $scope.ciudadList = data;
            $scope.ciudadList.splice(0,0,item);
            console.log(data);
    });
    Data.get("/moneda/cargarMonedasItem").then(function(data){
            $scope.monedaList = data;
            $scope.monedaList.splice(0,0,item);
            console.log(data);
    });
    
    
    Data.get('/empresas/empresas').then(function(data){
         $scope.empresasBuscar = data;
         $scope.empresaObj = angular.copy(data);
         $scope.empresasBuscar.filaInicial = 0;//de este floor a 10
         
         console.log($scope.empresasBuscar);         
         Data.post("/empresas/cargarEmpresas", $scope.empresasBuscar).then(function(data){
            $scope.empresasList = data;
            console.log(data);
         });
    });
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.empresasBuscar);
        $scope.empresasBuscar.filaInicial = parseInt($scope.empresasBuscar.filaInicial) + 10;
        sessionStorage.setItem("empresas",  JSON.stringify($scope.empresasBuscar));
        Data.post("/empresas/cargarEmpresas", $scope.empresasBuscar).then(function(data){
            $scope.empresasList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.empresasBuscar.filaInicial = parseInt($scope.empresasBuscar.filaInicial) - 10;
        sessionStorage.setItem("empresas",  JSON.stringify($scope.empresasBuscar));
        Data.post("/empresas/cargarEmpresas", $scope.empresasBuscar).then(function(data){
            $scope.empresasList = data;
            console.log(data);
         });
    };
    $scope.agregarEmpresa_action = function() {       
        $scope.empresa = angular.copy($scope.empresaObj);
        mostrarVentanaModal("agregarEmpresaDialog");
        //$('#agregarEmpresaDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();    
    };
    $scope.guardarEmpresa_action = function() {
        $scope.empresa.estadosRegistro.codEstado = 1;
        $scope.empresa.logotipoEmpresa = $scope.empresa.logotipoEmpresa.replace("data:image/jpeg;base64,","");//reemplaza la primera ocurrencia
        Data.post('/empresas/guardarEmpresas', $scope.empresa).then(function(data){            
            $('#agregarEmpresaDialog').modal('hide');
            Data.post("/empresas/cargarEmpresas", $scope.empresasBuscar).then(function(data){
                $scope.empresasList = data;
                console.log(data);
            });
        });
    };
    $scope.editarEmpresa_action = function(e){
        /*var i=0;
        for(i=0;i<$scope.empresasList.length;i++){
            if($scope.empresasList[i].checked===true){
                $scope.empresa = angular.copy($scope.empresasList[i]);                
                break;
            }
        }*/
        $scope.empresa = angular.copy(e);
        mostrarVentanaModal("editarEmpresaDialog");
        //$('#editarEmpresaDialog').modal('show');
        //$('.modal-backdrop').appendTo('.container');
        //$('body').removeClass();        
        
    };
    
    $scope.guardarEditarEmpresa_action = function() {
        $scope.empresa.logotipoEmpresa = $scope.empresa.logotipoEmpresa.replace("data:image/jpeg;base64,","");//reemplaza la primera ocurrencia
        Data.post('/empresas/editarEmpresas', $scope.empresa).then(function(data){            
            $('#editarEmpresaDialog').modal('hide');
            Data.post("/empresas/cargarEmpresas", $scope.empresasBuscar).then(function(data){
                $scope.empresasList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarEmpresa_action = function(e){
        /*var i=0;
        for(i=0;i<$scope.empresasList.length;i++){
            if($scope.empresasList[i].checked===true){
                $scope.empresa = angular.copy($scope.empresasList[i]);
                 Data.post('/empresas/eliminarEmpresas', $scope.empresa).then(function(data){
                    Data.post("/empresas/cargarEmpresas", $scope.empresasBuscar).then(function(data){
                        $scope.empresasList = data;
                        console.log(data);
                    });
                });
                break;
            }
        }*/
        if(confirm("Esta seguro de eliminar la Empresa?")===false){
            return;
        }
        
        $scope.empresa = angular.copy(e);
        Data.post('/empresas/eliminarEmpresas', $scope.empresa).then(function (data) {
            Data.post("/empresas/cargarEmpresas", $scope.empresasBuscar).then(function (data) {
                $scope.empresasList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarEmpresa_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarEmpresaDialog");
    };
    $scope.buscarEmpresa_action = function(){
        Data.post("/empresas/cargarEmpresas", $scope.empresasBuscar).then(function (data) {
                $scope.empresasList = data;
                console.log(data);
        });
         console.log("entro hide:::");
         ocultarVentanaModal("#buscarEmpresaDialog");
    };
    document.getElementById('file').onchange = function (evt) {//carga la vista previa de la imagen (carga la variable de logotipo con base64)
        var tgt = evt.target || window.event.srcElement;
        var files = tgt.files;
        
        
        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function (e) {
                $scope.empresa.logotipoEmpresa = e.target.result;//coloca el valor base 64 de la imagen en la variable
                document.getElementById("previa").src = fr.result;
            };
            fr.readAsDataURL(files[0]);
        }

        // Not supported
        else {
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
        }
    };
    document.getElementById('file1').onchange = function (evt) {//carga la vista previa de la imagen (carga la variable de logotipo con base64)
        var tgt = evt.target || window.event.srcElement;
        var files = tgt.files;
        
        
        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function (e) {
                $scope.empresa.logotipoEmpresa = e.target.result;//coloca el valor base 64 de la imagen en la variable
                document.getElementById("previa1").src = fr.result;
            };
            fr.readAsDataURL(files[0]);
        }

        // Not supported
        else {
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
        }
    };
    
    }
    ]);
});