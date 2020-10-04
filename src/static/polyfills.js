(function () {
    'use strict';

    // Go to a certain URL, trigger reload if necessary
    window.goto = function (href, newtab) {
        window.open(href, newtab ? '_blank' : '_top');
        if (window.location.pathname === href.split('#')[0]) {
            window.location.reload();
        }
    };

    String.prototype.titleCase = function titleCase() {
        return this.toLowerCase().split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
    };

})();