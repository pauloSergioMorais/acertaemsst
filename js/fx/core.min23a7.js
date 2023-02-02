$(function () {
  // vars
  var $body = $('body'),
    $this = '',
    $window = $(window)

  /* ---- Topo ---- */

  // var
  var $topo_menu = $('#topo-menu'),
    $topo_mobile = $('#topo-mobile'),
    $topo_mobile_icone = $('#topo-mobile-icone'),
    $topo_orcamento = $('#topo-orcamento'),
    $topo_pesquisar = $('#topo-pesquisar'),
    $topo_botao = $('.topo-centro-botao'),
    $menu = $('.menu'),
    $menu_botao = $('.menu-botao'),
    $submenu = $('.submenu')

  // mobile
  $topo_mobile.on('click', function () {
    if ($topo_menu.hasClass('topo-menu-ativo')) {
      $topo_mobile_icone.html('menu')
      $topo_menu.removeClass('topo-menu-ativo')
    } else {
      $topo_mobile_icone.html('menu_open')
      $topo_menu.addClass('topo-menu-ativo')
    }
  })

  // menu
  $topo_botao.on('click', function () {
    $this = $(this)

    $menu_botao.removeClass('menu-botao-ativo')
    $submenu.removeClass('submenu-ativo')

    if ($this.hasClass('topo-centro-botao-ativo')) {
      $this.removeClass('topo-centro-botao-ativo')
      $menu.removeClass('menu-ativo')
    } else {
      $menu.removeClass('menu-ativo')
      $topo_botao.removeClass('topo-centro-botao-ativo')
      $this
        .addClass('topo-centro-botao-ativo')
        .parent()
        .find('.menu')
        .addClass('menu-ativo')
    }
  })

  // submenu
  $menu_botao.on('click', function () {
    $this = $(this)

    if ($this.hasClass('menu-botao-ativo')) {
      $this.removeClass('menu-botao-ativo')
      $submenu.removeClass('submenu-ativo')
    } else {
      $submenu.removeClass('submenu-ativo')
      $menu_botao.removeClass('menu-botao-ativo')
      $this
        .addClass('menu-botao-ativo')
        .parent()
        .find('.submenu')
        .addClass('submenu-ativo')
    }
  })

  
})
