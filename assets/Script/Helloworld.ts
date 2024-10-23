import * as wp from './WPJSBridge/WPJSBridge'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    start () {
        wp.getWindowInfo({
            success: (rsp) => {
                console.log("getWindowInfo success", rsp)
            },
            fail: (code, msg) => {
                console.log("getWindowInfo fail", code, msg)
            }
        })
    }

    onCLickLogin() {
        wp.login({
            success: (auth_code) => {
                console.log("login success", auth_code)
            },
            fail: (code, msg) => {
                console.log("login fail", code, msg)
            }
        })
    }

    onCLickCostCoin() {
        wp.recharge({
            gold_num: 100,
            goods_name: "test",
            order_id: "test1",
            callback_url: "https://www.baidu.com",
            extra: "extra",
            success: () => {
                console.log("recharge success")
            },
            fail: (code, msg) => {
                console.log("recharge fail", code, msg)
            }
        })
    }

    onCLickGetAppBaseInfo() {
        wp.getAppBaseInfo({
            success: (rsp) => {
                console.log("getAppBaseInfo success", rsp.app_version, rsp.pkg_name)
            },
            fail: (code, msg) => {
                console.log("getAppBaseInfo fail", code, msg)
            }
        })
    }

    onCLickShare() {
        console.log("onCLickShare")
        wp.share({
            share_text: "xxxxx",
            share_title: "xxxxx",
            share_image_url: "xxxxx",
            success: (rsp) => {
                console.log("share success")
            },
            fail: (code, msg) => {
                console.log("share fail", code, msg)
            }
        })
    }

    onCLickOpenWebPage() {
        console.log("onCLickOpenWebPage")
        wp.openWebPage({
            url: "https://www.baidu.com",
            success: (rsp) => {
                console.log("openWebPage success")
            },
            fail: (code, msg) => {
                console.log("openWebPage fail", code, msg)
            }
        })
    }
}
