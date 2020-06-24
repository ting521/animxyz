const VueMQ = {
	install(Vue, options) {
    const breakpoints = options.breakpoints || {}

    const getBreakpoint = (val) => {
      if (breakpoints[val]) {
        return breakpoints[val]
      }
      return val
    }

    let data = {}

    const updateMqObj = () => {
      data.cached = {}

      const media = (options) => {
        const {
          min,
          max,
          direction = 'width',
        } = options

        const components = []
        if (min) {
          components.push(`(min-${direction}: ${getBreakpoint(min)})`)
        }
        if (max) {
          components.push(`(max-${direction}: ${getBreakpoint(max)})`)
        }

        if (!components.length) return false

        const mediaQuery = components.join(' and ')
        if (!data.cached[mediaQuery]) {
          data.cached[mediaQuery] = matchMedia(mediaQuery).matches
        }
        return data.cached[mediaQuery]
      }

      const below = (max, direction) => media({ max, direction })
      const above = (min, direction) => media({ min, direction })
      const between = (min, max, direction) => media({ min, max, direction })

      data.mq = {
        media,
        below,
        above,
        between,
      }
    }

    updateMqObj()
    window.addEventListener('resize', updateMqObj)

    Vue.observable(data);

    Object.defineProperty(Vue.prototype, '$mq', {
      get () { return data.mq }
    })
	},
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue
}
if (GlobalVue) {
	GlobalVue.use(VueMQ)
}

export default VueMQ