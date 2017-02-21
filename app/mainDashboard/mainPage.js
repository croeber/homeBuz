
(function () {

    function Appcontroller() {
    var ctrl = this;
}


angular.module('realtyApp').component('mainContainer', {
    templateUrl: 'app/mainDashboard/mainPage.html',
    controller: Appcontroller,
    controllerAs: 'ctrl'
});
})();