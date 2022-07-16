define(['app'], function (app)
{
    app.controller('navegadorController',
            ['$scope', 'Data', '$location', function ($scope, Data) {
                    cargarContenido(3);//cargar menu en el navegador
                    
                    $scope.usuarioPersonal = {};
                    $("[data-toggle=popover]").popover();
                    
                    if(obtenerSession("usuarioPersonal")===null){
                        window.location = "index.html";        
                    }
                    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
                    console.log($scope.usuarioPersonal);
                    
                    
                    $scope.salir_action = function () {
                        sessionStorage.setItem("usuarioPersonal",null);
                        window.location = "index.html";
                    };
                    $scope.configuracion_action = function () {
                        window.location = "seleccionarSucursalAlmacen.html";
                    };
                    
                }
            ]);
    app.controller('configuracionController',
            ['$scope', 'Data', '$location','$q', 
                function ($scope, Data,$location,$q) {
                    if(obtenerSession("usuarioPersonal")===null){//validacion de usuario personal
                        window.location = "index.html";        
                    }
                    //$scope.usuarioPersonal = JSON.parse(sessionStorage.getItem("usuarioPersonal"));
                    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
                    $scope.empresasList = [];
                    
                    $scope.tablaDetalleAlmacenVenta = {};
                    
                   Data.get('/almacenes/almacenes').then(function(almacen){                        
                        $scope.almacenVentas = almacen;
                        $scope.almacenVentas.sucursalVentas = angular.copy($scope.usuarioPersonal.sucursalVentas);
                        Data.post("/almacenes/cargarAlmacenes", $scope.almacenVentas).then(function(almacenesList){
                           $scope.almacenesVentaList = almacenesList;
                           console.log($scope.almacenesVentaList);
                        });
                   });
                   
                   
                   $scope.seleccionarAlmacen_action = function(a){
                       $scope.usuarioPersonal.almacenesVenta.codAlmacenVenta = a.codAlmacenVenta;
                       $scope.usuarioPersonal.almacenesVenta.nombreAlmacenVenta = a.nombreAlmacenVenta;
                       guardarSession("usuarioPersonal",$scope.usuarioPersonal);
                       window.location = "navegador.html";
                   };
                   
                   
                    
                    
                    $scope.salir_action = function () {
                        sessionStorage.setItem("usuarioPersonal",null);
                        window.location = "index.html";
                    };
                    $scope.atras_action = function () {                        
                        window.location = "seleccionarSucursal.html";
                    };
                    
                    
                    
                }
                
            ]);
});
