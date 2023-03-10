;(function ($) {
  $.fn.single = function (options) {
    var opts = $.extend({}, $.fn.single.defaults, options)
    return this.each(function () {
      var element = $(this)
      changeCSS(element)
      changeIMG(opts)
      $(window).bind('resize', function () {
        changeCSS(element)
        changeIMG(opts)
      })
      $('[data-link]').bind('click', function (event) {
        event.preventDefault()
        goToSection(this, opts)
      })
    })
  }
  function changeCSS(element) {
    var windowWidth = '100%'
    var windowHeight = 'auto'
    var targetsSize = $('[data-target]').length
    $(element).css({ width: windowWidth, height: windowHeight * targetsSize })
    $(element)
      .children('div[data-target]')
      .each(function () {
        $(this).css({ width: windowWidth, height: windowHeight })
      })
  }
  function changeIMG(opts) {
    windowWidth = $(window).width()
    $("img[data-img='true']").each(function (index, element) {
      src = $(element).attr('src')
      imgName = ''
      imgFinal = ''
      imgSplit = {}
      imagePrefix = checkResolution(windowWidth, opts)
      if (src.match('/')) {
        re = new RegExp('.*/(.*)$')
        m = re.exec(src)
        imgName = m[1]
      } else imgName = src
      if (imgName.match(/\-\w+/)) src = src.replace(/\-\w+/, imagePrefix)
      else {
        imgSplit = imgName.split('.')
        imgFinal = imgSplit[0] + imagePrefix + '.' + imgSplit[1]
        src = src.replace(imgName, imgFinal)
      }
      $(element).attr('src', src)
    })
  }
  function goToSection(link, opts) {
    var goingTo = $(link).attr('data-link')
    var targetPosition = $('[data-target="' + goingTo + '"]').position().top
    $('html, body').animate(
      { scrollTop: targetPosition },
      { duration: opts.speed, easing: opts.animation }
    )
  }
  function checkResolution(windowWidth, opts) {
    if (windowWidth <= 480) return opts.sufixes.smallest
    if (windowWidth > 480 && windowWidth <= 767) return opts.sufixes.small
    if (windowWidth > 767 && windowWidth <= 979) return opts.sufixes.medium
    if (windowWidth > 979) return opts.sufixes.normal
  }
  $.fn.single.defaults = {
    speed: 2e3,
    animation: 'easeOutExpo',
    sufixes: {
      smallest: '-smallest',
      small: '-small',
      medium: '-medium',
      normal: ''
    }
  }
})(jQuery)
jQuery.easing['jswing'] = jQuery.easing['swing']
jQuery.extend(jQuery.easing, {
  def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d)
  },
  easeInQuad: function (x, t, b, c, d) {
    return c * (t /= d) * t + b
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b
    return (-c / 2) * (--t * (t - 2) - 1) + b
  },
  easeInCubic: function (x, t, b, c, d) {
    return c * (t /= d) * t * t + b
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b
    return (c / 2) * ((t -= 2) * t * t + 2) + b
  },
  easeInQuart: function (x, t, b, c, d) {
    return c * (t /= d) * t * t * t + b
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b
  },
  easeInQuint: function (x, t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b
    return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b
  },
  easeInOutSine: function (x, t, b, c, d) {
    return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
  },
  easeInExpo: function (x, t, b, c, d) {
    return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
  },
  easeOutExpo: function (x, t, b, c, d) {
    return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t == 0) return b
    if (t == d) return b + c
    if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b
    return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b
    return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
  },
  easeInElastic: function (x, t, b, c, d) {
    var s = 1.70158
    var p = 0
    var a = c
    if (t == 0) return b
    if ((t /= d) == 1) return b + c
    if (!p) p = d * 0.3
    if (a < Math.abs(c)) {
      a = c
      var s = p / 4
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
    return (
      -(
        a *
        Math.pow(2, 10 * (t -= 1)) *
        Math.sin(((t * d - s) * (2 * Math.PI)) / p)
      ) + b
    )
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s = 1.70158
    var p = 0
    var a = c
    if (t == 0) return b
    if ((t /= d) == 1) return b + c
    if (!p) p = d * 0.3
    if (a < Math.abs(c)) {
      a = c
      var s = p / 4
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
    return (
      a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
      c +
      b
    )
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s = 1.70158
    var p = 0
    var a = c
    if (t == 0) return b
    if ((t /= d / 2) == 2) return b + c
    if (!p) p = d * (0.3 * 1.5)
    if (a < Math.abs(c)) {
      a = c
      var s = p / 4
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a)
    if (t < 1)
      return (
        -0.5 *
          (a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
        b
      )
    return (
      a *
        Math.pow(2, -10 * (t -= 1)) *
        Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
        0.5 +
      c +
      b
    )
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158
    return c * (t /= d) * t * ((s + 1) * t - s) + b
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158
    if ((t /= d / 2) < 1)
      return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
    return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t /= d) < 1 / 2.75) return c * (7.5625 * t * t) + b
    else if (t < 2 / 2.75)
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b
    else if (t < 2.5 / 2.75)
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b
    else return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d / 2)
      return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b
    return (
      jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    )
  }
})
