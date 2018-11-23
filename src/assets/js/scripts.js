(function($){
  'use strict';
  // ----------------------------------
  // Mobile Menu
  // ----------------------------------
  $('.js-mobile-menu').on('click', function() {
    var app = $(this).closest('.app');
    app.hasClass('menu') ? app.removeClass('menu') : app.addClass('menu');
  });
  // Menu Tree
  $('.menu-parent').on('click', function() {
    $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open');
  });
  // ----------------------------------
  // Modal
  // ----------------------------------
  $('.js-modal').on('click', function() {
    var app = $(this).closest('.app');
    var modal = $(this).data('modal');
    app.hasClass('modal') ? app.removeClass('modal') : app.addClass('modal');
    $('.modal-container').find('.modal-wrapper').removeClass('active');
    $('.modal-container').find('*[data-target="'+ modal +'"]').addClass('active');
  });
  $('.js-modal-close').on('click', function() {
    var app = $(this).closest('body').find('.app');
    app.hasClass('modal') ? app.removeClass('modal') : app.addClass('modal');
  });
  // ----------------------------------
  // Date Picker
  // ----------------------------------
  $('[data-toggle="datepicker"]').datepicker({
    format: 'DD/MM/YYYY',
    autoHide: true
  });
  // ----------------------------------
  // Accordion
  // ----------------------------------
  $('.contract-accordion-header').on('click', function() {
    var parent = $(this).closest('.contract-accordion');
    parent.hasClass('open') ? parent.removeClass('open') : parent.addClass('open');
  });
})(jQuery);