define(['app'], function(app)
{
app.controller('navegadorProductosController',
    ['$scope','Data','$location','$window',
    function ($scope, Data,$location,$window) {    
    //try {    
    $scope.productosBuscar = {};//productosBuscar
    $scope.producto = {};//productosBuscar
    $scope.productoObj = {};//productosBuscar
    $scope.productosList = [];
    $scope.gruposProductoList = [];
    $scope.proveedoresList = [];
    $scope.subGruposList = [];
    $scope.subGrupoCopia = {};
    var item = {codItem:0,nombreItem:"-NINGUNO-"};
    $scope.usuarioPersonal = obtenerSession("usuarioPersonal");
    
    $scope.empaqueExternoList = [];
    $scope.subGruposList.splice(0,0,item);//index,?,item
    
    Data.get("/gruposProducto/cargarGruposProductoItem").then(function(data){
            $scope.gruposProductoList = data;
            $scope.gruposProductoList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    Data.get("/proveedores/cargarProveedoresItem").then(function(data){
            $scope.proveedoresList = data;
            $scope.proveedoresList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    
    Data.get("/empaqueExterno/cargarEmpaqueExternoItem").then(function(data){
            $scope.empaqueExternoList = data;
            $scope.empaqueExternoList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    Data.get("/unidadesMedida/cargarUnidadesMedidaItem").then(function(data){
            $scope.unidadesMedidaList = data;
            $scope.unidadesMedidaList.splice(0,0,item);//index,?,item
            console.log(data);
    });
    
    
    Data.get('/estadosRegistro/cargarEstadosRegistroItem').then(function(data){
        $scope.estadosRegistroList = data;
        $scope.estadosRegistroList.splice(0,0,item);//index,?,item
    });
    
    Data.get('/tablaDetalle/tablaDetalle').then(function (data) {
        $scope.tablaDetalle = data;

        $scope.tablaDetalle.tabla.nombreTabla = "LABORATORIOS";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.laboratoriosList = data;
            console.log(data);
        });
        $scope.tablaDetalle.tabla.nombreTabla = "PRESENTACIONES_PRODUCTO";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.presentacionesProductoList = data;
            console.log(data);
        });
        $scope.tablaDetalle.tabla.nombreTabla = "CATEGORIAS_PRODUCTO";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.categoriasProductoList = data;
            console.log(data);
        });
        $scope.tablaDetalle.tabla.nombreTabla = "ACCION_TERAPEUTICA";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.accionTerapeuticaList = data;
            console.log(data);
        });
        $scope.tablaDetalle.tabla.nombreTabla = "NOMBRE_GENERICO";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.nombreGenericoList = data;
            console.log(data);
        });
        $scope.tablaDetalle.tabla.nombreTabla = "FORMA_FARMACEUTICA";
        Data.post("/tablaDetalle/cargarTablaDetalleItem", $scope.tablaDetalle).then(function (data) {
            $scope.formaFarmaceuticaList = data;
            console.log(data);
        });
        
    });
    
    
    //busca el objeto producto luego carga la lista de productos
    Data.get('/productos/productos').then(function(data){
         $scope.productosBuscar = data;
         $scope.productoObj = angular.copy(data);
         $scope.productosBuscar.filaInicial = 0;//de este floor a 10
         
         console.log($scope.productosBuscar);         
         Data.post("/productos/cargarProductos", $scope.productosBuscar).then(function(data){
             //para ver si tiene imagen jpg
             /*for(i=0;i<data.length;i++){
                if(data[i].length>0 && base64ToHex(data[i].imagenProducto).substring(0,2)==="FF"){
                    data[i].imagenProductoJPG=1;                    
                }else{
                    data[i].imagenProductoJPG=0;
                }
            }*/
            $scope.productosList = data;
            console.log(data);
         });
    });
    
    
    /*navegacion de la tabla*/
    $scope.siguiente_action = function(){
        console.log($scope.productosBuscar);
        $scope.productosBuscar.filaInicial = parseInt($scope.productosBuscar.filaInicial) + 10;
        sessionStorage.setItem("productos",  JSON.stringify($scope.productosBuscar));
        Data.post("/productos/cargarProductos", $scope.productosBuscar).then(function(data){
            $scope.productosList = data;
            console.log(data);
         });
    };
    $scope.atras_action = function(){
        $scope.productosBuscar.filaInicial = parseInt($scope.productosBuscar.filaInicial) - 10;
        sessionStorage.setItem("productos",  JSON.stringify($scope.productosBuscar));
        Data.post("/productos/cargarProductos", $scope.productosBuscar).then(function(data){
            $scope.productosList = data;
            console.log(data);
         });
    };
    $scope.agregarProducto_action = function() {       
        $scope.producto = angular.copy($scope.productoObj);
        $scope.producto.stockMinimo = 5;
        $scope.producto.stockMaximo = 100;
        
        mostrarVentanaModal("agregarProductoDialog");
        
        /*$('#agregarProductoDialog').modal('show');
        $('#agregarProductoDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.cancelarAgregarProducto_action = function() {
        ocultarVentanaModal('#agregarProductoDialog');
        /*$('#agregarProductoDialog').modal('show');
        $('#agregarProductoDialog').appendTo('body');
        
        $('body').removeClass("modal-open");*/
        
    };
    $scope.guardarProducto_action = function() {
        /*if($scope.producto.unidadesMedida.codUnidadMedida <=0){                        
            $.growl.warning({title:"ADVERTENCIA!", message: "Registre la unidad de medida del producto " });
            return null;
        }*/
        $scope.producto.estadosRegistro.codEstado = 1;
        $scope.producto.grupoProducto.codGrupoProducto = 5;//medicamentos
        //$scope.producto.imagenProducto = $scope.producto.imagenProducto.replace("data:image/jpeg;base64,","");//reemplaza la primera ocurrencia
        Data.post('/productos/guardarProductos', $scope.producto).then(function(data){            
            $('#agregarProductoDialog').modal('hide');
            Data.post("/productos/cargarProductos", $scope.productosBuscar).then(function(data){
                $scope.productosList = data;
                console.log(data);
            });
        });
    };
    $scope.editarProducto_action = function(pr){
        /*var i=0;
        for(i=0;i<$scope.productosList.length;i++){
            if($scope.productosList[i].checked===true){
                $scope.producto = angular.copy($scope.productosList[i]);                
                break;
            }
        }*/
        
        $scope.producto = angular.copy(pr);
        
        //$('#editarProductoDialog').modal('show');
        //$('#editarProductoDialog').appendTo('body');
        //$('body').removeClass();
        mostrarVentanaModal("editarProductoDialog");
        
    };    
    
    
    $scope.guardarEditarProducto_action = function() {
        
        //$scope.producto.imagenProducto = $scope.producto.imagenProducto.replace("data:image/jpeg;base64,","");//reemplaza la primera ocurrencia
        Data.post('/productos/editarProductos', $scope.producto).then(function(data){            
            $('#editarProductoDialog').modal('hide');
            Data.post("/productos/cargarProductos", $scope.productosBuscar).then(function(data){
                $scope.productosList = data;
                console.log(data);
            });
        });
    };
    $scope.eliminarProducto_action = function(pr){
        /*var i=0;
        for(i=0;i<$scope.productosList.length;i++){
            if($scope.productosList[i].checked===true){
                $scope.producto = angular.copy($scope.productosList[i]);
                 Data.post('/productos/eliminarProductos', $scope.producto).then(function(data){
                    Data.post("/productos/cargarProductos", $scope.productosBuscar).then(function(data){
                        $scope.productosList = data;
                        console.log(data);
                    });
                });
                break;
            }
        }*/
        
        if(confirm("esta seguro de eliminar el producto?")===false){
            return null;
        }
        
        $scope.producto = angular.copy(pr);
        Data.post('/productos/eliminarProductos', $scope.producto).then(function (data) {
            Data.post("/productos/cargarProductos", $scope.productosBuscar).then(function (data) {
                $scope.productosList = data;
                console.log(data);
            });
        });
    };
    
    $scope.mostrarBuscarProducto_action = function(){
        console.log("entro mostrar:");
        mostrarVentanaModal("buscarProductoDialog");
    };
    $scope.buscarProducto_action = function(){
        $scope.productosBuscar.filaInicial = 0;
        
        Data.post("/productos/cargarProductos", $scope.productosBuscar).then(function (data) {
                $scope.productosList = data;
                console.log(data);
            });
        
         
         ocultarVentanaModal("#buscarProductoDialog");
    };
    $scope.grupoProducto_change = function(g){
        $scope.subGrupoCopia = angular.copy($scope.productoObj.subGruposProducto);
        
        $scope.subGrupoCopia.gruposProducto.codGrupoProducto = $scope.producto.grupoProducto.codGrupoProducto;
        Data.post('/subGruposProducto/cargarSubGruposProductoItem', $scope.subGrupoCopia).then(function(data){
            $scope.subGruposList = data;
            $scope.subGruposList.splice(0,0,item);//index,?,item
        });
    };
    
    $scope.verReporteProducto_action = function(pr){
        
        $window.open(pathFarmaciaReportes+"/producto/reporteProducto.jsp?codProducto="+pr.codProducto +"&nombreProducto="+pr.nombreProducto+"&codEmpresa="+$scope.usuarioPersonal.empresas.codEmpresa);
    };
    
    document.getElementById('fileImgProducto').onchange = function (evt) {//carga la vista previa de la imagen (carga la variable de logotipo con base64)
        var tgt = evt.target || window.event.srcElement;
        var files = tgt.files;
        
        
        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function (e) {
                $scope.producto.imagenProducto = e.target.result;//coloca el valor base 64 de la imagen en la variable
                document.getElementById("imgPreviaProducto").src = fr.result;
            };
            fr.readAsDataURL(files[0]);
        }

        // Not supported
        else {
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
        }
    };
    document.getElementById('fileImgProductoEd').onchange = function (evt) {//carga la vista previa de la imagen (carga la variable de logotipo con base64)
        var tgt = evt.target || window.event.srcElement;
        var files = tgt.files;
        
        
        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function (e) {
                $scope.producto.imagenProducto = e.target.result;//coloca el valor base 64 de la imagen en la variable
                document.getElementById("imgPreviaProductoEd").src = fr.result;
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