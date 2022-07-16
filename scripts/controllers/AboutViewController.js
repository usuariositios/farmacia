define(['app'], function(app)
{
    app.controller('AboutViewController',
    [
        '$scope',
        function($scope)
        {
	    console.log("about.....");
            $scope.page =
            {
                heading: 'About Us'
            };
        }
    ]);
});