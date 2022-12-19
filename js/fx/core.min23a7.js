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

  /* ---- Pesquisar ---- */

  // vars
  var $pesquisar = $('#pesquisar'),
    $pesquisar_input = $('#pesquisar-input'),
    $pesquisar_botao = $('#pesquisar-botao')

  $topo_pesquisar.on('click', function () {
    $pesquisar.toggleClass('pesquisar-ativo')

    if ($pesquisar.hasClass('pesquisar-ativo')) {
      $pesquisar_input.focus()
    }
  })

  $pesquisar_input.on('keydown', function (e) {
    if (e.keyCode == 13) {
      $pesquisar_botao.click()
    }
  })

  $pesquisar_botao.on('click', function () {
    window.location.href =
      'https://www.cenciseg.com.br/site/pesquisa/' +
      $pesquisar_input.val() +
      '?'
  })

  /* ---- Or�amento ---- */

  // vars
  var $orcamento = $('#orcamento'),
    $orcamento_botao = $('#orcamento-botao'),
    $cart_botao_numero = $('#cart-botao-numero'),
    $mais_produtos = $('#botao-mais-produtos'),
    $concluir_pedido = $('#botao-concluir-pedido'),
    $concluir_topo = $('#concluir-pedido-topo'),
    $sem_resultados = $('#div-sem-resultados')

  // abrir e fechar
  $topo_orcamento.on('click', function () {
    $body.toggleClass('body-ativo')
    $orcamento.toggleClass('orcamento-ativo')
  })

  $orcamento_botao.on('click', function () {
    $body.removeClass('body-ativo')
    $orcamento.removeClass('orcamento-ativo')
  })

  // excluir
  $('body').delegate('.orcamento-li-excluir', 'click', function () {
    $this = $(this).parent()

    $.post(
      'ajax/cart-remove-item.php',
      {
        item: $this.attr('data-item'),
        banco: $this.attr('data-banco')
      },
      function (e) {
        e = e.split('|')

        $this
          .parent()
          .parent()
          .slideUp(300, function () {
            $this.parent().parent().remove()
          })

        if (e[0] == 1) {
          localStorage.setItem('cart', e[1])

          $cart_botao_numero.html(e[2])

          if (e[2] <= 0) {
            $mais_produtos.attr('href', '/site')
            $concluir_pedido.addClass('display-none')
            $concluir_topo.addClass('orcamento-topo-icone-inativo')
            $sem_resultados.removeClass('display-none')
          }
        } else if (e[0] == 0) {
          if (!isNaN(e[2])) {
            $cart_botao_numero.html(e[2])
          }
          localStorage.removeItem('cart')
          $mais_produtos.attr('href', '/site')
          $concluir_pedido.addClass('display-none')
          $concluir_topo.addClass('orcamento-topo-icone-inativo')
          $sem_resultados.removeClass('display-none')
        }
      }
    )
  })

  // somente numeros
  $('body').delegate('.orcamento-li-quantidade-input', 'keydown', function (e) {
    var code

    if (e.keyCode) code = e.keyCode // Internet Explorer
    else if (e.which) code = e.which // Netscape
    else if (e.charCode) code = e.charCode // Mozilla

    // numeros // teclado numerico // backspace // tab // esq // dir // del
    if (
      (code > 47 && code < 59) ||
      (code > 95 && code < 106) ||
      code == 8 ||
      code == 9 ||
      code == 37 ||
      code == 39 ||
      code == 46
    ) {
      return true
    } else if (e.keyCode == 13) {
      $('.orcamento-li-quantidade').blur()
    } else {
      return false
    }
  })

  // alterar quantidade
  $('body').delegate('.orcamento-li-quantidade-input', 'blur', function () {
    $this = $(this)

    $.post(
      'ajax/cart-quantity.php',
      {
        item: $this.parent().parent().attr('data-item'),
        banco: $this.parent().parent().attr('data-banco'),
        tamanho: $this.parent().parent().attr('data-tamanho'),
        quantidade: $this.val()
      },
      function (e) {
        e = e.split('|')

        if (e[0] == 1) {
          $this.val(e[1])
          $this.parent().attr('data-quantidade', e[1])
          localStorage.setItem('cart', e[2])
        }
      }
    )
  })

  /* ---- Parceiros ---- */

  // vars
  var $parceiros_slider = $('#parceiros-slider'),
    $parceiros_setas = $('.parceiros-setas'),
    $parceiros_setas_d = $('#parceiros-setas-d'),
    $parceiros_this = '',
    _parceiros_atual = 0,
    _parceiros_total = $('.parceiros-div').length,
    _parceiros_view = 1,
    _parceiros_timer = ''

  // maximo
  var fn_parceiros_resize = function () {
    $parceiros_slider.css('transform', 'none')
    _parceiros_atual = 0

    if ($window.width() < 480) {
      _parceiros_view = 1
    } else if ($window.width() >= 480 && $window.width() < 720) {
      _parceiros_view = 2
    } else if ($window.width() >= 720 && $window.width() < 960) {
      _parceiros_view = 3
    } else if ($window.width() >= 960 && $window.width() < 1280) {
      _parceiros_view = 4
    } else if ($window.width() >= 1280) {
      _parceiros_view = 6
    }
  }

  // resize
  $window.on('resize', fn_parceiros_resize)
  fn_parceiros_resize()

  // click
  $parceiros_setas.on('click', function () {
    $parceiros_this = $(this)
    clearInterval(_parceiros_timer)

    if ($parceiros_this.attr('id') == 'parceiros-setas-e') {
      if (_parceiros_atual > 0) {
        _parceiros_atual--
      } else {
        _parceiros_atual = _parceiros_total - _parceiros_view
      }
    } else if ($parceiros_this.attr('id') == 'parceiros-setas-d') {
      if (_parceiros_total - _parceiros_view > _parceiros_atual) {
        _parceiros_atual++
      } else {
        _parceiros_atual = 0
      }
    }

    $parceiros_slider.css(
      'transform',
      'translateX(-' + (_parceiros_atual * 100) / 12 + '%)'
    )
    fn_parceiros_timer()
  })

  // timer
  var fn_parceiros_timer = function () {
    _parceiros_timer = setInterval(function () {
      $parceiros_setas_d.trigger('click')
    }, 4e3)
  }
  fn_parceiros_timer()

  /* ---- Newsletter ---- */

  // vars
  var $news_alerta = $('#news-alerta'),
    $news_botao = $('#news-botao'),
    $news_input_nome = $('#news-input-nome'),
    $news_input_mail = $('#news-input-mail'),
    $news_input_area = $('#news-input-area'),
    $news_input_checkbox = $('#news-input-checkbox'),
    _news_erros = false

  // validar e-mail
  var fn_news_mail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  // alerta
  $news_alerta.on('click', function () {
    $news_alerta
      .addClass('display-none')
      .removeClass('newsletter-form-alerta-certo newsletter-form-alerta-erros')
      .html('')
  })

  // validar
  $news_input_nome.on('blur', function () {
    if ($news_input_nome.val().length < 8) {
      _news_erros = true
      $news_input_nome
        .addClass('news-form-input-erros')
        .removeClass('news-form-input-certo')
    } else {
      $news_input_nome
        .addClass('news-form-input-certo')
        .removeClass('news-form-input-erros')
    }
  })

  $news_input_mail.on('blur', function () {
    if (!fn_news_mail.test($news_input_mail.val())) {
      _news_erros = true
      $news_input_mail
        .addClass('news-form-input-erros')
        .removeClass('news-form-input-certo')
    } else {
      $news_input_mail
        .addClass('news-form-input-certo')
        .removeClass('news-form-input-erros')
    }
  })

  $news_input_area.on('change', function () {
    if ($news_input_area.val().length < 1) {
      _news_erros = true
      $news_input_area
        .addClass('news-form-input-erros')
        .removeClass('news-form-input-certo')
    } else {
      $news_input_area
        .addClass('news-form-input-certo')
        .removeClass('news-form-input-erros')
    }
  })

  $news_input_checkbox.on('input', function () {
    if (!$news_input_checkbox.is(':checked')) {
      _news_erros = true
      $news_input_checkbox
        .parent()
        .addClass('news-form-input-erros')
        .removeClass('news-form-input-certo')
    } else {
      $news_input_checkbox
        .parent()
        .addClass('news-form-input-certo')
        .removeClass('news-form-input-erros')
    }
  })

  // click
  $news_botao.on('click', function () {
    _news_erros = false

    $news_input_nome.trigger('blur')
    $news_input_mail.trigger('blur')
    $news_input_area.trigger('change')
    $news_input_checkbox.trigger('input')

    if (_news_erros) {
      $news_alerta
        .removeClass('display-none')
        .addClass('news-form-alerta-erros')
        .html('Todos os campos precisam ser preenchidos.')
    } else {
      $.post(
        'https://www.cenciseg.com.br/site/ajax/assinar-news.php',
        {
          nome: $news_input_nome.val(),
          email: $news_input_mail.val(),
          interesse: $news_input_area.val(),
          aceite: $news_input_checkbox.val()
        },
        function (data) {
          data = JSON.parse(data)

          if (data.sucesso == 1) {
            $news_alerta
              .addClass('news-form-alerta-certo')
              .removeClass('display-none')
              .html(data.mensagem)

            $news_input_nome
              .val('')
              .removeClass('news-form-input-certo news-form-input-erros')
            $news_input_mail
              .val('')
              .removeClass('news-form-input-certo news-form-input-erros')
            $news_input_area
              .val('')
              .removeClass('news-form-input-certo news-form-input-erros')
            $news_input_checkbox
              .prop('checked', false)
              .parent()
              .removeClass('news-form-input-certo news-form-input-erros')
          } else {
            $news_alerta
              .addClass('news-form-alerta-erros')
              .removeClass('display-none')
              .html(data.mensagem)
          }
        }
      )
    }
  })

  /* ---- Privacidade ---- */

  if (!localStorage.getItem('privacidade')) {
    var $privacidade = $('#privacidade')

    $privacidade.show()

    $('#privacidade-botao').on('click', function () {
      $privacidade.animate({ bottom: '-96px' }, 200, function () {
        $privacidade.hide()
      })

      localStorage.setItem('privacidade', true)
    })
  }

  // isdesign.com.br
})
