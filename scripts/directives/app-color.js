define(['app'], function(app)
{
    app.directive('appColor',
    [
        function()
        {
            return function(scope, $element, attrs)
            {
                $element.css({'color': attrs.appColor});
            };
        }
    ]);
    
    app.directive('loading',   ['$http' ,function ($http)
    {
        return {
            restrict: 'A',
            link: function (scope, $element, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        //$element.show();
                        $element.css({'display': 'block'});
                    }else{
                        $element.css({'display': 'none'});
                        //$element.hide();
                    }
                });
            }
        };

    }]);

    app.directive("datepicker", function () {

        function link(scope, element, attrs) {
            // CALL THE "datepicker()" METHOD USING THE "element" OBJECT.
            element.datepicker({
                dateFormat: "dd/mm/yy",
                format: "dd/mm/yyyy"
            });
        }

        return {
            require: 'ngModel',
            link: link
        };
    });



});