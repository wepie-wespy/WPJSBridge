const CODE_SUCCESS = 200

var WPJSBridgeManager = function () {
  this.jsBridge = undefined
  this.callbacksMap = new Map()
}

WPJSBridgeManager.instance = null

WPJSBridgeManager.getInstance = function () {
  if (WPJSBridgeManager.instance == null) {
    WPJSBridgeManager.instance = new WPJSBridgeManager()
  }
  return WPJSBridgeManager.instance
}

WPJSBridgeManager.prototype.setupBridge = function (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge)
  }
	if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
	window.WVJBCallbacks = [callback]
	var WVJBIframe = document.createElement('iframe')
	WVJBIframe.style.display = 'none'
	WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
	document.documentElement.appendChild(WVJBIframe)
	setTimeout(function() { 
    document.documentElement.removeChild(WVJBIframe) 
  }, 0)
  if (window.Wespy) {
    window.Wespy.onJsBridge("wvjbscheme://__BRIDGE_LOADED__")
  }
}

// private
WPJSBridgeManager.prototype.ensureJSBridge = function(callback) {
  if (!this.jsBridge) {
    const self = this
    this.setupBridge(function (bridge) {
      console.log("setupBridge finished")
      self.jsBridge = bridge
      callback()
    })
    return
  }
  callback()
}

WPJSBridgeManager.prototype.login = function (options) {
  console.log("login call")
  this.jsBridge.callHandler("login", "", function (response) {
    console.log("login response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        options.success(json.result.auth_code)
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.recharge = function (options) {
  // 检查是否有必要的参数
  if (!options || !options.gold_num) {
    console.error('Please provide a gold_num.')
    return
  }
  if (!options || !options.goods_name) {
    console.error('Please provide a goods_name.')
    return
  }
  if (!options || !options.order_id) {
    console.error('Please provide a order_id.')
    return
  }
  if (!options || !options.callback_url) {
    console.error('Please provide a callback_url.')
    return
  }
  const paramsObj = {
    gold_num: options.gold_num,
    goods_name: options.goods_name,
    order_id: options.order_id,
    callback_url: options.callback_url
  }
  if (options.extra) {
    paramsObj.extra = options.extra
  }
  const params = JSON.stringify(paramsObj)
  console.log("recharge call", params)
  this.jsBridge.callHandler("recharge", params, function (response) {
    console.log("recharge response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        options.success()
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.getAppBaseInfo = function (options) {
  console.log("getAppBaseInfo call")
  this.jsBridge.callHandler("getAppBaseInfo", "", function (response) {
    console.log("getAppBaseInfo response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        options.success({
          app_version: json.result.app_version,
          pkg_name: json.result.pkg_name,
        })
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.getDeviceInfo = function (options) {
  console.log("getDeviceInfo call")
  this.jsBridge.callHandler("getDeviceInfo", "", function (response) {
    console.log("getDeviceInfo response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        const ret = {
          brand: json.result.brand,
          model: json.result.model,
          system_version: json.result.system_version,
          platform: json.result.platform,
          memory_size: json.result.memory_size,
        }
        if (json.result.cpu_type) {
          ret.cpu_type = json.result.cpu_type
        }
        options.success(ret)
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.getWindowInfo = function (options) {
  console.log("getWindowInfo call")
  this.jsBridge.callHandler("getWindowInfo", "", function (response) {
    console.log("getWindowInfo response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        const ret = {
          pixelRatio: json.result.pixelRatio,
          screenWidth: json.result.screenWidth,
          screenHeight: json.result.screenHeight,
          windowWidth: json.result.windowWidth,
          windowHeight: json.result.windowHeight,
          statusBarHeight: json.result.statusBarHeight,
          screenTop: json.result.screenTop
        }
        if (json.result.safeArea) {
          ret.safeArea = json.result.safeArea
        }
        options.success(ret)
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.openWebPage = function (options) {
  const paramsObj = {
    url: options.url
  }
  const params = JSON.stringify(paramsObj)
  console.log("openWebPage call")
  this.jsBridge.callHandler("openWebPage", params, function (response) {
    console.log("openWebPage response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        options.success()
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.share = function (options) {
  const paramsObj = {
    share_text: options.share_text,
    share_title: options.share_title,
    share_image_url: options.share_image_url
  }
  const params = JSON.stringify(paramsObj)
  console.log("share call")
  this.jsBridge.callHandler("share", params, function (response) {
    console.log("share response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        options.success()
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.share = function (options) {
  const paramsObj = {
    share_text: options.share_text,
    share_title: options.share_title,
    share_image_url: options.share_image_url
  }
  const params = JSON.stringify(paramsObj)
  console.log("share call")
  this.jsBridge.callHandler("share", params, function (response) {
    console.log("share response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        options.success()
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.jumpDeeplink = function (options) {
  const paramsObj = {
    deeplink: options.deeplink
  }
  const params = JSON.stringify(paramsObj)
  console.log("share jumpDeeplink")
  this.jsBridge.callHandler("jumpDeeplink", params, function (response) {
    console.log("jumpDeeplink response", response)
    const json = JSON.parse(response)
    if (json.code == CODE_SUCCESS) {
      if (typeof options.success === 'function') {
        options.success()
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(json.code, json.msg)
      }
    }
  })
}

WPJSBridgeManager.prototype.register = function (name, callback) {
  if (this.callbacksMap.has(name)) {
    const callbacks = this.callbacksMap.get(name)
    callbacks.add(callback)
  } else {
    const callbacks = new Set()
    callbacks.add(callback)
    this.callbacksMap.set(name, callbacks)
    this.ensureJSBridge(() => {
      this.jsBridge.registerHandler(name, (data, responseCallback) => {
        const callbackList = this.callbacksMap.get(name)
        if (callbackList) {
          const json = JSON.stringify(data)
          console.log("native call web", json)
          for (const callback of callbackList) {
            callback(json)
          }
        }
      })
    })
  }
}

WPJSBridgeManager.prototype.unRegister = function (name, callback) {
  if (this.callbacksMap.has(name)) {
    const callbacks = this.callbacksMap.get(name)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }
}

const wp = {}

wp.login = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().login(options)
  })
}

wp.recharge = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().recharge(options)
  })
}

wp.getAppBaseInfo = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().getAppBaseInfo(options)
  })
}

wp.getDeviceInfo = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().getDeviceInfo(options)
  })
}

wp.getWindowInfo = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().getWindowInfo(options)
  })
}

wp.openWebPage = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().openWebPage(options)
  })
}

wp.share = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().share(options)
  })
}

wp.jumpDeeplink = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().jumpDeeplink(options)
  })
}

wp.onWebViewStateChanged = function(callback) {
  WPJSBridgeManager.getInstance().register("onWebViewStateChanged", callback)
}

wp.offWebViewStateChanged = function(callback) {
  WPJSBridgeManager.getInstance().unRegister("onWebViewStateChanged", callback)
}

module.exports = wp