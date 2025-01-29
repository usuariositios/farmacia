define(['app'], function (app)
{
    app.controller('navegadorController',
            ['$scope', 'Data', '$location','$window','$q', 
                function ($scope, Data, $location,$window,$q) {
                    
                    $scope.prodVenc = 0.0;
                    
                    $scope.usuarioPersonal = {};
                    $("[data-toggle=popover]").popover();
                    
                    if(obtenerSession("usuarioPersonal")===null){
                        window.location = "index.html";        
                    }                    
                    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
                    
                    //cargar gestion por defecto
                    Data.get('/gestion/gestionActiva').then(function(data){//para obtener productos vencidos
                        $scope.usuarioPersonal.gestion = data;
                    });
                    //colocar la primera farmacia por defecto
                    
                    Data.get('/empresas/empresas').then(function(empresa){
                        $scope.empresa = empresa;
                        Data.post("/empresas/cargarEmpresas", $scope.empresa).then(function(empresasList){
                           $scope.usuarioPersonal.empresas = angular.copy(empresasList[0]);
                           //colocar sucursal y almacen
                            Data.get('/sucursalVenta/sucursalVenta').then(function(sucursalVentas){
                                $scope.sucursalVentas = sucursalVentas;
                                $scope.sucursalVentas.empresas = $scope.usuarioPersonal.empresas;
                                Data.post("/sucursalVenta/cargarSucursalVentas", $scope.sucursalVentas).then(function(sucursalVentasList){
                                   $scope.usuarioPersonal.sucursalVentas = sucursalVentasList[0];
                                   Data.get('/almacenes/almacenes').then(function (almacen) {
                                     $scope.almacenVentas = almacen;
                                     $scope.almacenVentas.sucursalVentas = angular.copy($scope.usuarioPersonal.sucursalVentas);
                                     Data.post("/almacenes/cargarAlmacenes", $scope.almacenVentas).then(function (almacenesList) {
                                            $scope.usuarioPersonal.almacenesVenta = almacenesList[0];
                                            guardarSession("usuarioPersonal",$scope.usuarioPersonal);
                                            //---------- productos vencidos
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
                                    });                                     
                            
                                   });
                                });
                           });                           
                        });
                    });
                    
                    //buscar la caja chica activa del usuario
                    Data.get('/cajaChica/cajaChica').then(function(data){
                        $scope.cajaChicasBuscar = angular.copy(data);
                        $scope.cajaChicaObj = angular.copy(data);
                        $scope.cajaChicasBuscar.filaInicial = 0;//de este floor a 10
                        $scope.cajaChicasBuscar.estadoApertura.codApertura = 1;//todas las cajas chicas activas del usuario
                        //debe ser con la fecha actual
                        $scope.cajaChicasBuscar.personal = angular.copy($scope.usuarioPersonal.personal);
                        
                        console.log($scope.cajaChicasBuscar);         
                        Data.post("/cajaChica/cargarCajaChica", $scope.cajaChicasBuscar).then(function(data){
                           console.log(data);
                           if(data.length>0){
                               guardarSession("cajaChica",data[0]);
                           }
                           else{
                               //$scope.cajaChicaObj.personal= angular.copy($scope.usuarioPersonal.personal);
                               //$scope.cajaChicaObj.personal.codPersonal =0.4;//para validaciones
                               guardarSession("cajaChica",angular.copy($scope.cajaChicaObj));//la lista no tiene objetos
                           }
                           
                        });
                   });
                    
                    
                    
                    
                    
                    
                    console.log($scope.usuarioPersonal);
                    cargarContenido($scope.usuarioPersonal.personal.codPersonal);//cargar menu en el navegador 3
                    
                    $scope.salir_action = function () {
                        sessionStorage.setItem("usuarioPersonal",null);
                        window.location = "index.html";
                    };
                    $scope.configuracion_action = function () {
                        window.location = "seleccionarSucursalAlmacen.html";
                    };
                    
                    
                    //para reporte de productos vencidos
                

                console.log($scope.usuarioPersonal);

                $scope.verReporte_prodVencidos = function(){
                    $scope.datosReporte = {
                       codGestion:$scope.usuarioPersonal.gestion.codGestion,                           
                       codAlmacenVenta:$scope.usuarioPersonal.almacenesVenta.codAlmacenVenta,
                       nombreAlmacenVenta:$scope.usuarioPersonal.almacenesVenta.nombreAlmacenVenta,
                       codEmpresa:$scope.usuarioPersonal.empresas.codEmpresa
                       };
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
