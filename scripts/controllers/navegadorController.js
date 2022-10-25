define(['app'], function (app)
{
    app.controller('navegadorController',
            ['$scope', 'Data', '$location','$window', function ($scope, Data, $location,$window) {
                    
                    $scope.prodVenc = 0.0;
                    
                    $scope.usuarioPersonal = {};
                    $("[data-toggle=popover]").popover();
                    
                    if(obtenerSession("usuarioPersonal")===null){
                        window.location = "index.html";        
                    }
                    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
                    console.log($scope.usuarioPersonal);
                    cargarContenido($scope.usuarioPersonal.personal.codPersonal);//cargar menu en el navegador 3
                    
                    $scope.salir_action = function () {
                        sessionStorage.setItem("usuarioPersonal",null);
                        window.location = "index.html";
                    };
                    $scope.configuracion_action = function () {
                        window.location = "seleccionarSucursalAlmacen.html";
                    };
                    
                    Data.get('/ingresosVentaDetalle/ingresosVentaDetalle').then(function(data){//para obtener productos vencidos
                        $scope.ingresosVentaDetalle = data;
                        console.log($scope.ingresosVentaDetalle);
                        $scope.ingresosVentaDetalle.ingresosVenta.gestion = angular.copy($scope.usuarioPersonal.gestion);
                        $scope.ingresosVentaDetalle.ingresosVenta.almacenesVenta = angular.copy($scope.usuarioPersonal.almacenesVenta);                        
                        console.log($scope.ingresosVentaDetalle);
                        Data.post('/ingresosVentaDetalle/cantProdVencidos', $scope.ingresosVentaDetalle).then(function (data) {
                            console.log(data); 
                            $scope.prodVenc = data;
                        });
                    });
                    //para reporte de productos vencidos
                $scope.datosReporte = {
                       codGestion:$scope.usuarioPersonal.gestion.codGestion,                           
                       codAlmacenVenta:$scope.usuarioPersonal.almacenesVenta.codAlmacenVenta,
                       nombreAlmacenVenta:$scope.usuarioPersonal.almacenesVenta.nombreAlmacenVenta,
                       codEmpresa:$scope.usuarioPersonal.empresas.codEmpresa
                       };

                console.log($scope.usuarioPersonal);

                $scope.verReporte_prodVencidos = function(){
                    $window.open(pathFarmaciaReportes+"/productosVencidos/reporteProductosVencidos.jsp?codGestion="+$scope.datosReporte.codGestion +                
                            "&codAlmacenVenta="+$scope.datosReporte.codAlmacenVenta+
                            "&codEmpresa="+$scope.datosReporte.codEmpresa
                            );
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
