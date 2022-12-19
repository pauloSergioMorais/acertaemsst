$(function () {
  // vars
  var $carrossel_img = $('.carrossel .img-position'),
    $carrossel_item = $('.carrossel-item'),
    $carrossel_botao = $('.carrossel-nav-botao'),
    $carrossel_this = '',
    _carrossel_ativo = 0,
    _carrossel_total = $carrossel_botao.length - 1,
    _carrossel_run = true,
    _carrossel_timer = ''

  // click
  $carrossel_botao.on('click', function () {
    $carrossel_this = $(this)

    if (
      _carrossel_run == true &&
      !$carrossel_this.hasClass('carrossel-nav-botao-ativo')
    ) {
      clearTimeout(_carrossel_timer)

      _carrossel_ativo = parseInt(
        $carrossel_this.attr('id').replace('carrossel-nav-botao-', '')
      )
      _carrossel_run = false

      $carrossel_botao.removeClass('carrossel-nav-botao-ativo')
      $carrossel_this.addClass('carrossel-nav-botao-ativo')

      $('#carrossel-item-' + _carrossel_ativo)
        .addClass('carrossel-item-ativo carrossel-transition')
        .one('animationend', function () {
          $carrossel_img.removeClass('carrossel-zoom')
          $carrossel_item.removeClass('carrossel-item-ativo')

          $('#carrossel-item-' + _carrossel_ativo)
            .addClass('carrossel-item-ativo')
            .removeClass('carrossel-transition')
            .find('.img-position')
            .addClass('carrossel-zoom')

          _carrossel_run = true
          _carrossel_timer = setTimeout(function () {
            if (_carrossel_ativo == _carrossel_total) {
              _carrossel_ativo = 0
            } else {
              _carrossel_ativo++
            }

            $('#carrossel-nav-botao-' + _carrossel_ativo).click()
          }, 6000)
        })
    }
  })

  // start
  $('#carrossel-nav-botao-' + _carrossel_ativo).click()
})
