
(function () {

    function navCtrl() {
    var ctrl = this;
}


angular.module('realtyApp').component('topNav', {
    templateUrl: 'app/common/topNav/topNav.html',
    controller: navCtrl,
    controllerAs: 'ctrl'
});
})();