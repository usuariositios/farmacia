require.config({
    baseUrl: '/farmacia/scripts',
    paths: {
                'jquery': '../bower_components/jquery/dist/jquery',
                'jquery-ui': '../bower_components/jquery_ui/jquery-ui',
                'angular': '../bower_components/angular/angular',
		'angular-route': '../bower_components/angular-route/angular-route',
		'bootstrap': '../lib/bootstrap/js/bootstrap.min',
		'slideBar': '../js/slideBar/slidebars',		
		'scriptSB': '../js/slideBar/scripts',
                'jquery.funciones': '../lib/jquery.funciones/jquery.funciones',                
                'datePicker': '../js/datePicker/js/bootstrap-datepicker',
                'datePicker_es': '../js/datePicker/locales/bootstrap-datepicker.es.min',
                'app-color':'./directives/app-color',
                'loginController': './controllers/loginController',
                'navegadorController': './controllers/navegadorController',
                'navegadorSeleccionarController': './controllers/navegadorSeleccionarController',
                'growl': '../js/growl/jquery.growl'
    },
	shim: {
		'app': {
			deps: ['angular', 'angular-route', 'bootstrap','jquery']
		},
		'angular-route': {
			deps: ['angular']
		},
		'app-color': {
			deps: ['angular']
		},
		'bootstrap': {
			deps: ['jquery']
		},
                'slideBar': {
			deps: ['jquery']
		},
                'scriptSB': {
			deps: ['jquery','slideBar']
		},
                'jquery-ui': {
                        exports:"$",
			deps: ['jquery']
		},
                'jquery.funciones': {                        
			deps: ['jquery']
		},
                'datePicker': {                        
			deps: ['jquery']
		},
                'datePicker_es': {
			deps: ['jquery','datePicker']
		},
                'growl': {                        
			deps: ['jquery']
		}
                
                
	}
});


require(
    ['jquery','bootstrap','app','scriptSB','jquery.funciones','datePicker','datePicker_es','app-color','loginController','navegadorController','navegadorSeleccionarController','growl'],//escripts de inicio de aplicacion (se ejecuta)
    function($,bootstrap,app,scriptSB,jqFunciones,datePicker,datePicker_es,appColor,loginController,navegadorController,navegadorSeleccionarController,growl){
        
        angular.bootstrap(document, ['app']);
        
        
        
        

        
    }
);