define(['app'], function(app)
{
	app.controller('HomeViewController',
    [
        '$scope',

        function($scope)
        {
			console.log("entro........");
            $scope.page =
            {
                heading: 'Welcomessss'
            };
        }
    ]);
});