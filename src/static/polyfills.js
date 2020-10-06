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

    /**
     * Shorthand for creating an element with attributes and attaching it to a root.
     *
     * @param {String} tag
     * @param {Map<String, Object>} attributes
     * @param {HTMLElement} root
     * @param {boolean} prepend
     * @returns {HTMLElement}
     */
    window.attachElement = function attachElement(tag, attributes, root = null, prepend = false) {
        const elem = document.createElement(tag);
        Object.assign(elem, attributes);
        if (root) prepend ? root.prepend(elem) : root.append(elem);
        return elem;
    };

})();