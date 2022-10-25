define(['routes','services/dependencyResolverFor'], function(config, dependencyResolverFor)
{
	
    var app = angular.module('app', ['ngRoute']);

    app.config(
    [
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)
        {
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;

            $locationProvider.html5Mode(false);
			
			console.log(config.routes);

            if(config.routes !== undefined)
            {
                angular.forEach(config.routes, function(route, path)
                {
					console.log("path " + path);
					console.log("route.templateUrl " + route.templateUrl);
					console.log(dependencyResolverFor(route.dependencies));
					
					
                    $routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)});
                });
            }

            if(config.defaultRoutePaths !== undefined)
            {
                $routeProvider.otherwise({redirectTo:config.defaultRoutePaths});
            }
        }
    ]);
    
    //definir el servicio habian 2 definiciones pero este es el que funciona
    app.factory("Data", ['$http', '$location',
    function ($http, $q, $location) {
        //normalizar el objeto json

        //var serviceBase = 'https://farmacia-servicios.herokuapp.com/rest';
        var serviceBase = 'http://192.168.0.3:8080/FARMACIA_1_0_SERVICIOS-1.0-SNAPSHOT/rest';

        var obj = {};

        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            var strJson = JSON.stringify(object,function (key, value) {//reemplazar los valores falsy en 0
                        
                        if(isNaN(value) && (typeof value ==="number"))//buscaria los valores de tipo entero
                        {    value = 0;}
                        
                        
                        return value;                        
                      });
            
            object = JSON.parse(strJson);//retornar el objeto depurado al objeto origen
            return $http.post(serviceBase + q, object).then(function (results) {
                
                var strJson2 = JSON.stringify(results.data,function (key, value) {//reemplazar los valores falsy en 0
                        
                        if(value===null)//buscaria los valores de tipo entero
                          { value = "";}
                        
                        return value;                        
                      });
                
                return JSON.parse(strJson2);//retornar el objeto depurado al objeto origen
                
                //return results.data;
            });
        };
        obj.put = function (q, object) {
            var strJson = JSON.stringify(object,function (key, value) {//reemplazar los valores falsy en 0
                        if(isNaN(value) && (typeof value ==="number"))//buscaria los valores de tipo entero
                        {    value = 0;}
                        
                        return value;        
                      });
            object = JSON.parse(strJson);//retornar el objeto depurado al objeto origen
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        return obj;
}]);

app.factory("DataCont", ['$http', '$location',
    function ($http, $location) {


        //var serviceBase = 'https://contabilidad-servicios.herokuapp.com/rest';
        var serviceBase = 'http://192.168.0.3:8080/CONTABILIDAD_1_0_SERVICIOS-1.0-SNAPSHOT/rest';
        
        var obj = {};

        obj.get = function (q) {            
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            var strJson = JSON.stringify(object,function (key, value) {//reemplazar los valores falsy en 0
                        if(isNaN(value) && (typeof value ==="number"))//buscaria los valores de tipo entero
                        {    value = 0;}
                        
                        return value;        
                      });
            object = JSON.parse(strJson);//retornar el objeto depurado al objeto origen
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            var strJson = JSON.stringify(object,function (key, value) {//reemplazar los valores falsy en 0
                        if(isNaN(value) && (typeof value ==="number"))//buscaria los valores de tipo entero
                        {    value = 0;}
                        
                        return value;
                      });
            object = JSON.parse(strJson);//retornar el objeto depurado al objeto origen
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {            
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        return obj;
}]);

   return app;
});