angular.module("umbraco").controller("ContentRController", function ($scope, $routeParams, userService, contentResource, notificationsService) {
    var vm = this;

    vm.AllContent = [];
    vm.disableButtons = false;

    // Some docs stuff
    // https://apidocs.umbraco.com/v10/ui/#/api/umbraco.resources.contentResource

    // Find object in array
    //function search(nameKey, myArray) {
    //    for (var i = 0; i < myArray.length; i++) {
    //        if (myArray[i].id === nameKey) {
    //            return myArray[i];
    //        }
    //    }
    //}

    function removeContent(id, arr) {
        const indx = arr.findIndex(v => v.id === id);
        arr.splice(indx, 1);
    }

    contentResource.getChildren(1085).then(function (response) {
        for (var i = 0; i < response.items.length; i++) {
            contentResource.getChildren(response.items[i].id).then(function (r) {
                if (r.items) {
                    for (var i = 0; i < r.items.length; i++) {
                        if (!r.items[i].published) {
                            vm.AllContent.push(r.items[i]);
                        }
                    }
                }
            });
        }
    });

    vm.publisher = function ($event, id) {
        vm.disableButtons = true;

        contentResource.getById(id).then(function (content) {
            content.variants[0].save = true;

            contentResource.publish(content, false, [], true)
                .then(function (content) {
                    removeContent(id, vm.AllContent);

                    vm.disableButtons = false;
                });
        });
    }

    vm.deleter = function ($event, id) {
        vm.disableButtons = true;

        contentResource.deleteById(id)
            .then(function () {
                removeContent(id, vm.AllContent);

                vm.disableButtons = false;

                notificationsService.success('Content deleted', '');
            });
    }

    

    //$scope.save = function (content) {
    //    console.log(content)
    //    console.log('scope.save')
    //    //contentResource.sendToPublish(content, false, [])
    //    //    .then(function (response) {
    //    //        console.log('sendToPublish', response);

    //    //        notificationsService.success("Document sent for approval", "");
    //    //    }, function (err) {
    //    //        notificationsService.success(err, "");
    //    //    });
    //}
});