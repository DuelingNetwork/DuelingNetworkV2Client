function pagenavto(target) {
    'use strict';
    $('.activescreen').removeClass('activescreen');
    $('section').css('left', '100vw');
    $('#' + target).css('left', '0').addClass('activescreen');
    return false;
}