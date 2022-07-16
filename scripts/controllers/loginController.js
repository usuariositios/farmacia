define(['app'], function (app)
{
    app.controller('loginController',
            ['$scope', 'Data', '$location', function ($scope, Data) {

                    $scope.usuarioPersonal = {};
                    $scope.usuarioPersonalBuscar = {};
                    $scope.mostrarMensaje = false;


                    Data.get("/usuarioPersonal/usuarioPersonal").then(function (data) {
                        $scope.usuarioPersonal = data;
                        console.log(data);
                    });


                    $scope.login_action = function (formInvalido) {
                        //console.log($scope.usuarioPersonal.nombreUsuario);

                        $scope.mensaje = "";


                        if (formInvalido === true) {
                            return false;
                        }


                        Data.post("/usuarioPersonal/buscarUsuarioPersonal", $scope.usuarioPersonal).then(function (data) {
                            $scope.usuarioPersonalBuscar = data;//buscar en base el mismo objeto
                            console.log(data);
                            console.log($scope.usuarioPersonalBuscar.personal.codPersonal);
                            if ($scope.usuarioPersonalBuscar.personal.codPersonal > 0) {                                
                                //sessionStorage.setItem("usuarioPersonal",  JSON.stringify($scope.usuarioPersonalBuscar));
                                guardarSession("usuarioPersonal",$scope.usuarioPersonalBuscar);
                                window.location = "seleccionarGestionEmpresa.html";//configuracion.html
                            } else {
                                $scope.mensaje = "usuario y/o password incorrecto";
                                $scope.mostrarMensaje = true;
                            }
                        });






                    };
                    //ng-keypress="input_keypress($event)" 
                    $scope.input_keypress = function (keyEvent) {
                        console.log(keyEvent.which);
                        $scope.mostrarMensaje = false;
                    };
                    
                    $scope.input_focus = function () {
                        
                        $scope.mostrarMensaje = false;
                    };
                    
                    
                    
                }
            ]);
});
