;(function ($) {
  $.extend({
    smoothScroll: function () {
      var defaultOptions = {
        frameRate: 60,
        animationTime: 900,
        stepSize: 120,
        pulseAlgorithm: true,
        pulseScale: 10,
        pulseNormalize: 1,
        accelerationDelta: 20,
        accelerationMax: 1,
        keyboardSupport: true,
        arrowScroll: 50,
        touchpadSupport: true,
        fixedBackground: true,
        excluded: ''
      }
      var options = defaultOptions
      var isExcluded = false
      var isFrame = false
      var direction = { x: 0, y: 0 }
      var initDone = false
      var root = document.documentElement
      var activeElement
      var observer
      var deltaBuffer = [120, 120, 120]
      var key = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36
      }
      function initTest() {
        var disableKeyboard = false
        if (document.URL.indexOf('google.com/reader/view') > -1)
          disableKeyboard = true
        if (options.excluded) {
          var domains = options.excluded.split(/[,\n] ?/)
          domains.push('mail.google.com')
          for (var i = domains.length; i--; )
            if (document.URL.indexOf(domains[i]) > -1) {
              observer && observer.disconnect()
              removeEvent('mousewheel', wheel)
              disableKeyboard = true
              isExcluded = true
              break
            }
        }
        if (disableKeyboard) removeEvent('keydown', keydown)
        if (options.keyboardSupport && !disableKeyboard)
          addEvent('keydown', keydown)
      }
      function init() {
        if (!document.body) return
        var body = document.body
        var html = document.documentElement
        var windowHeight = window.innerHeight
        var scrollHeight = body.scrollHeight
        root = document.compatMode.indexOf('CSS') >= 0 ? html : body
        activeElement = body
        initTest()
        initDone = true
        if (top != self) isFrame = true
        else if (
          scrollHeight > windowHeight &&
          (body.offsetHeight <= windowHeight ||
            html.offsetHeight <= windowHeight)
        ) {
          var pending = false
          var refresh = function () {
            if (!pending && html.scrollHeight != document.height) {
              pending = true
              setTimeout(function () {
                html.style.height = document.height + 'px'
                pending = false
              }, 500)
            }
          }
          html.style.height = 'auto'
          setTimeout(refresh, 10)
          var config = {
            attributes: true,
            childList: true,
            characterData: false
          }
          observer = new MutationObserver(refresh)
          observer.observe(body, config)
          if (root.offsetHeight <= windowHeight) {
            var underlay = document.createElement('div')
            underlay.style.clear = 'both'
            body.appendChild(underlay)
          }
        }
        if (document.URL.indexOf('mail.google.com') > -1) {
          var s = document.createElement('style')
          s.innerHTML = '.iu { visibility: hidden }'
          ;(document.getElementsByTagName('head')[0] || html).appendChild(s)
        } else if (document.URL.indexOf('www.facebook.com') > -1) {
          var home_stream = document.getElementById('home_stream')
          home_stream && (home_stream.style.webkitTransform = 'translateZ(0)')
        }
        if (!options.fixedBackground && !isExcluded) {
          body.style.backgroundAttachment = 'scroll'
          html.style.backgroundAttachment = 'scroll'
        }
      }
      var que = []
      var pending = false
      var lastScroll = +new Date()
      function scrollArray(elem, left, top, delay) {
        delay || (delay = 1e3)
        directionCheck(left, top)
        if (options.accelerationMax != 1) {
          var now = +new Date()
          var elapsed = now - lastScroll
          if (elapsed < options.accelerationDelta) {
            var factor = (1 + 30 / elapsed) / 2
            if (factor > 1) {
              factor = Math.min(factor, options.accelerationMax)
              left *= factor
              top *= factor
            }
          }
          lastScroll = +new Date()
        }
        que.push({
          x: left,
          y: top,
          lastX: left < 0 ? 0.99 : -0.99,
          lastY: top < 0 ? 0.99 : -0.99,
          start: +new Date()
        })
        if (pending) return
        var scrollWindow = elem === document.body
        var step = function (time) {
          var now = +new Date()
          var scrollX = 0
          var scrollY = 0
          for (var i = 0; i < que.length; i++) {
            var item = que[i]
            var elapsed = now - item.start
            var finished = elapsed >= options.animationTime
            var position = finished ? 1 : elapsed / options.animationTime
            if (options.pulseAlgorithm) position = pulse(position)
            var x = (item.x * position - item.lastX) >> 0
            var y = (item.y * position - item.lastY) >> 0
            scrollX += x
            scrollY += y
            item.lastX += x
            item.lastY += y
            if (finished) {
              que.splice(i, 1)
              i--
            }
          }
          if (scrollWindow) window.scrollBy(scrollX, scrollY)
          else {
            if (scrollX) elem.scrollLeft += scrollX
            if (scrollY) elem.scrollTop += scrollY
          }
          if (!left && !top) que = []
          if (que.length)
            requestFrame(step, elem, delay / options.frameRate + 1)
          else pending = false
        }
        requestFrame(step, elem, 0)
        pending = true
      }
      function wheel(event) {
        if (!initDone) init()
        var target = event.target
        var overflowing = overflowingAncestor(target)
        if (
          !overflowing ||
          event.defaultPrevented ||
          isNodeName(activeElement, 'embed') ||
          (isNodeName(target, 'embed') && /\.pdf/i.test(target.src))
        )
          return true
        var deltaX = event.wheelDeltaX || 0
        var deltaY = event.wheelDeltaY || 0
        if (!deltaX && !deltaY) deltaY = event.wheelDelta || 0
        if (!options.touchpadSupport && isTouchpad(deltaY)) return true
        if (Math.abs(deltaX) > 1.2) deltaX *= options.stepSize / 120
        if (Math.abs(deltaY) > 1.2) deltaY *= options.stepSize / 120
        scrollArray(overflowing, -deltaX, -deltaY)
        event.preventDefault()
      }
      function keydown(event) {
        var target = event.target
        var modifier =
          event.ctrlKey ||
          event.altKey ||
          event.metaKey ||
          (event.shiftKey && event.keyCode !== key.spacebar)
        if (
          /input|textarea|select|embed/i.test(target.nodeName) ||
          target.isContentEditable ||
          event.defaultPrevented ||
          modifier
        )
          return true
        if (isNodeName(target, 'button') && event.keyCode === key.spacebar)
          return true
        var shift,
          x = 0,
          y = 0
        var elem = overflowingAncestor(activeElement)
        var clientHeight = elem.clientHeight
        if (elem == document.body) clientHeight = window.innerHeight
        switch (event.keyCode) {
          case key.up:
            y = -options.arrowScroll
            break
          case key.down:
            y = options.arrowScroll
            break
          case key.spacebar:
            shift = event.shiftKey ? 1 : -1
            y = -shift * clientHeight * 0.9
            break
          case key.pageup:
            y = -clientHeight * 0.9
            break
          case key.pagedown:
            y = clientHeight * 0.9
            break
          case key.home:
            y = -elem.scrollTop
            break
          case key.end:
            var damt = elem.scrollHeight - elem.scrollTop - clientHeight
            y = damt > 0 ? damt + 10 : 0
            break
          case key.left:
            x = -options.arrowScroll
            break
          case key.right:
            x = options.arrowScroll
            break
          default:
            return true
        }
        scrollArray(elem, x, y)
        event.preventDefault()
      }
      function mousedown(event) {
        activeElement = event.target
      }
      var cache = {}
      setInterval(function () {
        cache = {}
      }, 10 * 1e3)
      var uniqueID = (function () {
        var i = 0
        return function (el) {
          return el.uniqueID || (el.uniqueID = i++)
        }
      })()
      function setCache(elems, overflowing) {
        for (var i = elems.length; i--; )
          cache[uniqueID(elems[i])] = overflowing
        return overflowing
      }
      function overflowingAncestor(el) {
        var elems = []
        var rootScrollHeight = root.scrollHeight
        do {
          var cached = cache[uniqueID(el)]
          if (cached) return setCache(elems, cached)
          elems.push(el)
          if (rootScrollHeight === el.scrollHeight) {
            if (!isFrame || root.clientHeight + 10 < rootScrollHeight)
              return setCache(elems, document.body)
          } else if (el.clientHeight + 10 < el.scrollHeight) {
            overflow = getComputedStyle(el, '').getPropertyValue('overflow-y')
            if (overflow === 'scroll' || overflow === 'auto')
              return setCache(elems, el)
          }
        } while ((el = el.parentNode))
      }
      function addEvent(type, fn, bubble) {
        window.addEventListener(type, fn, bubble || false)
      }
      function removeEvent(type, fn, bubble) {
        window.removeEventListener(type, fn, bubble || false)
      }
      function isNodeName(el, tag) {
        return (el.nodeName || '').toLowerCase() === tag.toLowerCase()
      }
      function directionCheck(x, y) {
        x = x > 0 ? 1 : -1
        y = y > 0 ? 1 : -1
        if (direction.x !== x || direction.y !== y) {
          direction.x = x
          direction.y = y
          que = []
          lastScroll = 0
        }
      }
      var deltaBufferTimer
      function isTouchpad(deltaY) {
        if (!deltaY) return
        deltaY = Math.abs(deltaY)
        deltaBuffer.push(deltaY)
        deltaBuffer.shift()
        clearTimeout(deltaBufferTimer)
        var allEquals =
          deltaBuffer[0] == deltaBuffer[1] && deltaBuffer[1] == deltaBuffer[2]
        var allDivisable =
          isDivisible(deltaBuffer[0], 120) &&
          isDivisible(deltaBuffer[1], 120) &&
          isDivisible(deltaBuffer[2], 120)
        return !(allEquals || allDivisable)
      }
      function isDivisible(n, divisor) {
        return Math.floor(n / divisor) == n / divisor
      }
      var requestFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          function (callback, element, delay) {
            window.setTimeout(callback, delay || 1e3 / 60)
          }
        )
      })()
      var MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver
      function pulse_(x) {
        var val, start, expx
        x = x * options.pulseScale
        if (x < 1) val = x - (1 - Math.exp(-x))
        else {
          start = Math.exp(-1)
          x -= 1
          expx = 1 - Math.exp(-x)
          val = start + expx * (1 - start)
        }
        return val * options.pulseNormalize
      }
      function pulse(x) {
        if (x >= 1) return 1
        if (x <= 0) return 0
        if (options.pulseNormalize == 1) options.pulseNormalize /= pulse_(1)
        return pulse_(x)
      }
      addEvent('mousedown', mousedown)
      addEvent('mousewheel', wheel)
      addEvent('load', init)
    }
  })
})(jQuery)
;(function ($) {
  $.extend({
    scrollToTop: function () {
      var _isScrolling = false
      $('body').append(
        $('<a />')
          .addClass('scroll-to-top')
          .attr({ href: '#', id: 'scrollToTop' })
          .append($('<i />').addClass('icon icon-chevron-up icon-white'))
      )
      $('#scrollToTop').click(function (e) {
        e.preventDefault()
        $('body, html').animate({ scrollTop: 0 }, 500)
        return false
      })
      $(window).scroll(function () {
        if (!_isScrolling) {
          _isScrolling = true
          if ($(window).scrollTop() > 150) {
            $('#scrollToTop').stop(true, true).addClass('visible')
            _isScrolling = false
          } else {
            $('#scrollToTop').stop(true, true).removeClass('visible')
            _isScrolling = false
          }
        }
      })
    }
  })
})(jQuery)
;(function ($) {
  $.extend({
    browserSelector: function () {
      var u = navigator.userAgent,
        ua = u.toLowerCase(),
        is = function (t) {
          return ua.indexOf(t) > -1
        },
        g = 'gecko',
        w = 'webkit',
        s = 'safari',
        o = 'opera',
        h = document.documentElement,
        b = [
          !/opera|webtv/i.test(ua) && /msie\s(\d)/.test(ua)
            ? 'ie ie' + parseFloat(navigator.appVersion.split('MSIE')[1])
            : is('firefox/2')
            ? g + ' ff2'
            : is('firefox/3.5')
            ? g + ' ff3 ff3_5'
            : is('firefox/3')
            ? g + ' ff3'
            : is('gecko/')
            ? g
            : is('opera')
            ? o +
              (/version\/(\d+)/.test(ua)
                ? ' ' + o + RegExp.jQuery1
                : /opera(\s|\/)(\d+)/.test(ua)
                ? ' ' + o + RegExp.jQuery2
                : '')
            : is('konqueror')
            ? 'konqueror'
            : is('chrome')
            ? w + ' chrome'
            : is('iron')
            ? w + ' iron'
            : is('applewebkit/')
            ? w +
              ' ' +
              s +
              (/version\/(\d+)/.test(ua) ? ' ' + s + RegExp.jQuery1 : '')
            : is('mozilla/')
            ? g
            : '',
          is('j2me')
            ? 'mobile'
            : is('iphone')
            ? 'iphone'
            : is('ipod')
            ? 'ipod'
            : is('mac')
            ? 'mac'
            : is('darwin')
            ? 'mac'
            : is('webtv')
            ? 'webtv'
            : is('win')
            ? 'win'
            : is('freebsd')
            ? 'freebsd'
            : is('x11') || is('linux')
            ? 'linux'
            : '',
          'js'
        ]
      c = b.join(' ')
      h.className += ' ' + c
      var isIE11 = !window.ActiveXObject && 'ActiveXObject' in window
      if (isIE11) {
        $('html').removeClass('gecko').addClass('ie ie11')
        return
      }
    }
  })
})(jQuery)
;(function ($) {
  var eventNamespace = 'waitForImages'
  $.waitForImages = {
    hasImageProperties: [
      'backgroundImage',
      'listStyleImage',
      'borderImage',
      'borderCornerImage',
      'cursor'
    ]
  }
  $.expr[':'].uncached = function (obj) {
    if (!$(obj).is('img[src!=""]')) return false
    var img = new Image()
    img.src = obj.src
    return !img.complete
  }
  $.fn.waitForImages = function (finishedCallback, eachCallback, waitForAll) {
    var allImgsLength = 0
    var allImgsLoaded = 0
    if ($.isPlainObject(arguments[0])) {
      waitForAll = arguments[0].waitForAll
      eachCallback = arguments[0].each
      finishedCallback = arguments[0].finished
    }
    finishedCallback = finishedCallback || $.noop
    eachCallback = eachCallback || $.noop
    waitForAll = !!waitForAll
    if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback))
      throw new TypeError('An invalid callback was supplied.')
    return this.each(function () {
      var obj = $(this)
      var allImgs = []
      var hasImgProperties = $.waitForImages.hasImageProperties || []
      var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g
      if (waitForAll)
        obj
          .find('*')
          .addBack()
          .each(function () {
            var element = $(this)
            if (element.is('img:uncached'))
              allImgs.push({ src: element.attr('src'), element: element[0] })
            $.each(hasImgProperties, function (i, property) {
              var propertyValue = element.css(property)
              var match
              if (!propertyValue) return true
              while ((match = matchUrl.exec(propertyValue)))
                allImgs.push({ src: match[2], element: element[0] })
            })
          })
      else
        obj.find('img:uncached').each(function () {
          allImgs.push({ src: this.src, element: this })
        })
      allImgsLength = allImgs.length
      allImgsLoaded = 0
      if (allImgsLength === 0) finishedCallback.call(obj[0])
      $.each(allImgs, function (i, img) {
        var image = new Image()
        $(image).on(
          'load.' + eventNamespace + ' error.' + eventNamespace,
          function (event) {
            allImgsLoaded++
            eachCallback.call(
              img.element,
              allImgsLoaded,
              allImgsLength,
              event.type == 'load'
            )
            if (allImgsLoaded == allImgsLength) {
              finishedCallback.call(obj[0])
              return false
            }
          }
        )
        image.src = img.src
      })
    })
  }
})(jQuery)
;(function ($) {
  $.fn.countTo = function (options) {
    options = options || {}
    return $(this).each(function () {
      var settings = $.extend(
        {},
        $.fn.countTo.defaults,
        {
          from: $(this).data('from'),
          to: $(this).data('to'),
          speed: $(this).data('speed'),
          refreshInterval: $(this).data('refresh-interval'),
          decimals: $(this).data('decimals')
        },
        options
      )
      var loops = Math.ceil(settings.speed / settings.refreshInterval),
        increment = (settings.to - settings.from) / loops
      var self = this,
        $self = $(this),
        loopCount = 0,
        value = settings.from,
        data = $self.data('countTo') || {}
      $self.data('countTo', data)
      if (data.interval) clearInterval(data.interval)
      data.interval = setInterval(updateTimer, settings.refreshInterval)
      render(value)
      function updateTimer() {
        value += increment
        loopCount++
        render(value)
        if (typeof settings.onUpdate == 'function')
          settings.onUpdate.call(self, value)
        if (loopCount >= loops) {
          $self.removeData('countTo')
          clearInterval(data.interval)
          value = settings.to
          if (typeof settings.onComplete == 'function')
            settings.onComplete.call(self, value)
        }
      }
      function render(value) {
        var formattedValue = settings.formatter.call(self, value, settings)
        $self.html(formattedValue)
      }
    })
  }
  $.fn.countTo.defaults = {
    from: 0,
    to: 0,
    speed: 1e3,
    refreshInterval: 100,
    decimals: 0,
    formatter: formatter,
    onUpdate: null,
    onComplete: null
  }
  function formatter(value, settings) {
    return value.toFixed(settings.decimals)
  }
})(jQuery)
;(function ($) {
  var defaults = { action: function () {}, runOnLoad: false, duration: 500 }
  var settings = defaults,
    running = false,
    start
  var methods = {}
  methods.init = function () {
    for (var i = 0; i <= arguments.length; i++) {
      var arg = arguments[i]
      switch (typeof arg) {
        case 'function':
          settings.action = arg
          break
        case 'boolean':
          settings.runOnLoad = arg
          break
        case 'number':
          settings.duration = arg
          break
      }
    }
    return this.each(function () {
      if (settings.runOnLoad) settings.action()
      $(this).resize(function () {
        methods.timedAction.call(this)
      })
    })
  }
  methods.timedAction = function (code, millisec) {
    var doAction = function () {
      var remaining = settings.duration
      if (running) {
        var elapse = new Date() - start
        remaining = settings.duration - elapse
        if (remaining <= 0) {
          clearTimeout(running)
          running = false
          settings.action()
          return
        }
      }
      wait(remaining)
    }
    var wait = function (time) {
      running = setTimeout(doAction, time)
    }
    start = new Date()
    if (typeof millisec === 'number') settings.duration = millisec
    if (typeof code === 'function') settings.action = code
    if (!running) doAction()
  }
  $.fn.afterResize = function (method) {
    if (methods[method])
      return methods[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      )
    else return methods.init.apply(this, arguments)
  }
})(jQuery)
