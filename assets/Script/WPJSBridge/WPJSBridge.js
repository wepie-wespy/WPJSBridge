const CODE_SUCCESS = 200

var WPJSBridgeManager = function () {
  this.jsBridge = undefined
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
  // 检查是否有必要的参数
  if (!options || !options.client_id) {
    console.error('Please provide a client_id.')
    return
  }
  const params = JSON.stringify({
    client_id: options.client_id,
  })
  console.log("login call", params)
  this.jsBridge.callHandler("login", params, function (response) {
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
  if (!options || !options.client_id) {
    console.error('Please provide a client_id.')
    return
  }
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
    client_id: options.client_id,
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

WPJSBridgeManager.prototype.hideLoadingView = function (options) {
  console.log("hideLoadingView call")
  this.jsBridge.callHandler("hideLoadingView", "", function (response) {
    console.log("hideLoadingView response", response)
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

wp.hideLoadingView = function(options) {
  WPJSBridgeManager.getInstance().ensureJSBridge(() => {
    WPJSBridgeManager.getInstance().hideLoadingView(options)
  })
}

module.exports = wp