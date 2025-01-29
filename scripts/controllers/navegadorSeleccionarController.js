define(['app'], function (app)
{
    
    app.controller('seleccionarGestionEmpresaController',
            ['$scope', 'Data', '$location','$q', 
                function ($scope, Data,$location,$q) {
                    if(obtenerSession("usuarioPersonal")===null){//validacion de usuario personal
                        window.location = "index.html";        
                    }
                    
                    //$scope.usuarioPersonal = JSON.parse(sessionStorage.getItem("usuarioPersonal"));
                    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
                    
                    
                    $scope.empresasList = [];
                    $scope.gestionesList = [];
                    
                    
                    Data.get('/empresas/empresas').then(function(empresa){
                        $scope.empresa = empresa;
                        Data.post("/empresas/cargarEmpresas", $scope.empresa).then(function(empresasList){
                           $scope.empresasList = empresasList;
                           console.log(empresasList);
                        });
                    });
                    
                        Data.get("/gestion/cargarGestion").then(function(gestionesList){
                           $scope.gestionesList = gestionesList;
                           //buscar la gestion activa
                           for(i=0;i<gestionesList.length;i++){                               
                                if(parseFloat(gestionesList[i].estadosRegistro.codEstado)===1){
                                    $scope.usuarioPersonal.gestion.codGestion = gestionesList[i].codGestion;
                                }
                           }                           
                           console.log(gestionesList);
                        });                    
                   
                   
                   $scope.seleccionarEmpresa_action = function(e){
                       for(i=0;i<$scope.gestionesList.length;i++){//buscar la gestion
                            if($scope.gestionesList[i].codGestion===$scope.usuarioPersonal.gestion.codGestion){
                                $scope.usuarioPersonal.gestion=angular.copy($scope.gestionesList[i]);
                                break;
                            }
                        }
                       $scope.usuarioPersonal.empresas = e;                       
                       guardarSession("usuarioPersonal",$scope.usuarioPersonal);
                       window.location = "seleccionarSucursalAlmacen.html";
                   };
                    $scope.cancelar_action = function () {
                        sessionStorage.setItem("usuarioPersonal",null);
                        window.location = "index.html";
                    };
                }
                
            ]);
            app.controller('seleccionarSucursalAlmacenController',
            ['$scope', 'Data', '$location','$q', 
                function ($scope, Data,$location,$q) {
                    if(obtenerSession("usuarioPersonal")===null){//validacion de usuario personal
                        window.location = "index.html";        
                    }
                    //$scope.usuarioPersonal = JSON.parse(sessionStorage.getItem("usuarioPersonal"));
                    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
                    console.log($scope.usuarioPersonal);
                    var item = {codItem:0,nombreItem:"-NINGUNO-"};
                    
                    $scope.sucursalesVentaList = [];
                    Data.get('/almacenes/almacenes').then(function (almacen) {
                            $scope.almacenVentas = almacen;
                            
                        });
                    
                    Data.get('/sucursalVenta/sucursalVenta').then(function(sucursalVentas){
                        $scope.sucursalVentas = sucursalVentas;
                        sucursalBuscar = angular.copy(sucursalVentas);
                        $scope.usuarioPersonal.sucursalVentas = angular.copy(sucursalVentas);
                        $scope.sucursalVentas.empresas = $scope.usuarioPersonal.empresas;
                        Data.post("/sucursalVenta/cargarSucursalVentas", $scope.sucursalVentas).then(function(sucursalVentasList){
                           $scope.sucursalVentasList = sucursalVentasList;
                           
                           sucursalBuscar.nombreSucursal = "-NINGUNO-";
                           sucursalBuscar.codSucursal = -1;
                           $scope.usuarioPersonal.sucursalVentas.codSucursal=-1;
                           $scope.sucursalVentasList.splice(0,0,sucursalBuscar);
                           console.log($scope.sucursalVentasList);
                        });
                   });
                   $scope.sucursalVenta_change=function(){
                        $scope.almacenVentas.sucursalVentas.codSucursal = $scope.usuarioPersonal.sucursalVentas.codSucursal;
                        $scope.usuarioPersonal.sucursalVentas.nombreSucursal = $("#codSucursal option:selected").text();
                            Data.post("/almacenes/cargarAlmacenes", $scope.almacenVentas).then(function (almacenesList) {
                                $scope.almacenesVentaList = almacenesList;
                                console.log($scope.almacenesVentaList);
                            });
                   };
                   $scope.seleccionarAlmacen_action = function(a){
                       $scope.usuarioPersonal.almacenesVenta.codAlmacenVenta = a.codAlmacenVenta;
                       $scope.usuarioPersonal.almacenesVenta.nombreAlmacenVenta = a.nombreAlmacenVenta;
                       guardarSession("usuarioPersonal",$scope.usuarioPersonal);
                       window.location = "navegador.html";
                   };
                   $scope.seleccionarSucursalVentas_action = function(e){
                       $scope.usuarioPersonal.sucursalVentas.codSucursal = e.codSucursal;
                       $scope.usuarioPersonal.sucursalVentas.nombreSucursal = e.nombreSucursal;
                       guardarSession("usuarioPersonal",$scope.usuarioPersonal);
                       window.location = "configuracion.html";
                   };
                    $scope.cancelar_action = function () {
                        sessionStorage.setItem("usuarioPersonal",null);
                        window.location = "index.html";
                    };
                    $scope.atras_action = function () {                        
                        window.location = "seleccionarGestionEmpresa.html";
                    };
                }
                
            ]);
});
