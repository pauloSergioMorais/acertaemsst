$(function () {
  // vars
  var $body = $('html, body'),
    $filtro_mobile = $('#p-filtro-mobile'),
    $filtro_nav = $('#p-filtro-nav'),
    $filtro_icone = $('#p-filtro-mobile-icone'),
    $filtro_botao = $('.p-filtro-nav-menu-botao'),
    $filtro_ordenacao = $('#produtos-filtro-ordenacao'),
    $filtro_quantidade = $('#produtos-filtro-quantidade'),
    $div_produtos_lista = $('#produtos-lista'),
    $filtro_linhas = $('.js-filtro-linhas'),
    $div_marcas = $('#div-marcas'),
    pag_atual = 1

  // mobile
  $filtro_mobile.on('click', function () {
    $filtro_nav.toggleClass('p-filtro-nav-ativo')

    if ($filtro_nav.hasClass('p-filtro-nav-ativo')) {
      $filtro_icone.html('close')
    } else {
      $filtro_icone.html('filter_list')
    }
  })

  // botoes
  $filtro_botao.on('click', function () {
    $(this).toggleClass('p-filtro-nav-menu-botao-ativo')
  })

  var $fn_busca_produtos = function () {
    $div_produtos_lista.addClass('fx-loader')

    var quantidade = $filtro_quantidade.val()
    var ordenacao = $filtro_ordenacao.val()
    var marcas = ''
    var linhas = ''

    $('.js-filtro-marcas').each(function () {
      if ($(this).hasClass('p-filtro-nav-menu-botao-ativo')) {
        marcas += $(this).attr('data-cod') + ','
      }
    })
    if (marcas.length > 0) {
      marcas = marcas.substring(0, marcas.length - 1)
    }

    $filtro_linhas.each(function () {
      if ($(this).hasClass('p-filtro-nav-menu-botao-ativo')) {
        linhas += $(this).attr('data-cod') + ','
      }
    })
    if (linhas.length == 0) {
      $filtro_linhas.each(function () {
        linhas += $(this).attr('data-cod') + ','
      })
    }

    linhas = linhas.substring(0, linhas.length - 1)

    if (pag_atual === undefined || isNaN(pag_atual)) {
      pag_atual = 1
    }

    var pesquisa = $('#pesquisar-input').val()

    // voltar o site pro topo
    $body
      .stop()
      .animate({ scrollTop: $div_produtos_lista.offset().top - 60 }, 200)

    $.post(
      'ajax/produtos-buscar.php',
      {
        pesquisa: pesquisa,
        pagina: pag_atual,
        marcas: marcas,
        linhas: linhas,
        quantidade: quantidade,
        ordem: ordenacao
      },
      function (data) {
        $div_produtos_lista.html(data)
        $div_produtos_lista.removeClass('fx-loader')

        var urlNormal = window.location.href.split('?')
        history.pushState(
          false,
          false,
          urlNormal[0] +
            '?marcas=' +
            marcas +
            '&linhas=' +
            linhas +
            '&ordenacao=' +
            ordenacao +
            '&quantidade=' +
            quantidade +
            '&pagina=' +
            pag_atual
        )
      }
    )
  }

  var $fn_busca_marcas = function (primeiravez = 0) {
    if (primeiravez == 1) {
      $fn_verifica_filtros(0)
    }

    $('.js-filtro-marcas').each(function () {
      $(this).removeClass('p-filtro-nav-menu-botao-ativo')
    })

    var linhas_selecionadas = ''

    $filtro_linhas.each(function () {
      var $this = $(this)

      if ($this.hasClass('p-filtro-nav-menu-botao-ativo')) {
        linhas_selecionadas += $this.attr('data-cod') + ','
      }
    })

    if (linhas_selecionadas == '') {
      $filtro_linhas.each(function () {
        linhas_selecionadas += $(this).attr('data-cod') + ','
      })
    }

    linhas_selecionadas = linhas_selecionadas.substring(
      0,
      linhas_selecionadas.length - 1
    )

    $.post(
      'ajax/consulta-marcas-produtos-buscar.php',
      {
        linhas: linhas_selecionadas,
        pesquisa: $('#pesquisar-input').val()
      },
      function (data) {
        $div_marcas.html(data)

        if (primeiravez == 1) {
          $fn_verifica_filtros()
        }
      }
    )
  }

  $filtro_quantidade.change(function () {
    pag_atual = 1
    $fn_busca_produtos()
  })

  $filtro_ordenacao.change(function () {
    pag_atual = 1
    $fn_busca_produtos()
  })

  $('body').delegate('.js-filtro-marcas', 'click', function () {
    $(this).toggleClass('p-filtro-nav-menu-botao-ativo')
    pag_atual = 1
    $fn_busca_produtos()
  })

  $filtro_linhas.on('click', function () {
    pag_atual = 1
    $fn_busca_marcas()
    $fn_busca_produtos()
  })

  $('body').delegate('.p-lista-navegacao-botao-d', 'click', function () {
    //pag_atual = parseInt($("#pag-atual").val())+1;
    if (pag_atual <= $(this).attr('data-tamanho')) {
      pag_atual = parseInt(pag_atual) + 1
      $('#pag-atual').val(pag_atual)
      $fn_busca_produtos()
    }
  })

  $('body').delegate('.p-lista-navegacao-botao-e', 'click', function () {
    //pag_atual = parseInt($("#pag-atual").val());
    if (pag_atual > 1) {
      pag_atual = parseInt(pag_atual) - 1
      $('#pag-atual').val(pag_atual)
      $fn_busca_produtos()
    }
  })

  $('body').delegate('#pag-atual', 'keydown', function (e) {
    if (e.keyCode == 13) {
      var $this = $(this)

      if ($this.val() <= 0) {
        $this.val(1)
      }

      if ($this.val() > $this.attr('data-tamanho')) {
        $this.val($this.attr('data-tamanho'))
      }

      pag_atual = $this.val()

      $fn_busca_produtos()
    } else {
      return $fn_verifica_numero(e)
    }
  })

  $('body').delegate('#pag-atual', 'blur', function () {
    var $this = $(this)

    if (Number.isInteger(parseInt($this.val()))) {
      if ($this.val() <= 0) {
        $this.val(1)
      }

      if ($this.val() > $this.attr('data-tamanho')) {
        $this.val($this.attr('data-tamanho'))
      }
    } else {
      $this.val(1)
    }

    pag_atual = $this.val()

    $fn_busca_produtos()
  })

  var $fn_verifica_filtros = function (buscaProduto = 1) {
    var quantidade = 48,
      ordenacao = 0,
      pagina = 1,
      marcasArray = '',
      linhasArray = ''

    var urlAtual = window.location.href.split('?'),
      partes = urlAtual[1].split('&')

    for (var $i = 0; $i < partes.length; $i++) {
      var quebra = partes[$i].split('=')

      if (quebra[0] == 'linhas') {
        linhasArray = quebra[1]
      } else if (quebra[0] == 'marcas') {
        marcasArray = quebra[1]
      } else if (quebra[0] == 'ordenacao') {
        ordenacao = quebra[1]
      } else if (quebra[0] == 'quantidade') {
        quantidade = quebra[1]
      } else if (quebra[0] == 'pagina') {
        pagina = quebra[1]
      }
    }

    $filtro_quantidade.val(quantidade)
    $filtro_ordenacao.val(ordenacao)
    $('#pag-atual').val(pagina)
    pag_atual = pagina

    var marcas = marcasArray.split(',')
    var linhas = linhasArray.split(',')

    $filtro_linhas.each(function () {
      var $this = $(this)
      if (linhas.indexOf($this.attr('data-cod')) != -1) {
        $this.addClass('p-filtro-nav-menu-botao-ativo')
      }
    })

    $('.js-filtro-marcas').each(function () {
      var $this = $(this)
      if (marcas.indexOf($this.attr('data-cod')) != -1) {
        $this.addClass('p-filtro-nav-menu-botao-ativo')
      }
    })

    if (buscaProduto == 1) {
      $fn_busca_produtos()
    }
  }

  // 1a vez
  $fn_busca_marcas(1)

  var $fn_verifica_numero = function (e) {
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105) ||
      e.keyCode == 37 ||
      e.keyCode == 39 ||
      e.keyCode == 8 ||
      e.keyCode == 46
    ) {
      return true
    } else {
      return false
    }
  }
})
