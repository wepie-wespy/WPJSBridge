import * as wp from './WPJSBridge/WPJSBridge'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
        this.label.string = this.text;
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
            client_id: 100001,
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
            client_id: 100001,
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

    onCLickGetDeviceInfo() {
        console.log("onCLickGetDeviceInfo")
        wp.getDeviceInfo({
            success: (rsp) => {
                console.log("getDeviceInfo success", rsp.model, rsp.system_version)
            },
            fail: (code, msg) => {
                console.log("getDeviceInfo fail", code, msg)
            }
        })
    }
}
