import { Action } from './Action';
import TestButton from './Button';
import * as wp from './WPJSBridge/WPJSBridge'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    infoLabel: cc.Label = null

    @property(cc.Node)
    scrollContent: cc.Node = null

    @property(cc.Prefab)
    buttonPrefab: cc.Prefab = null

    onWebViewStateChangedCallback: (res: Object) => void = (res) => {
        this.showObserve("onWebViewStateChanged", JSON.stringify(res))
    }

    onLoad(): void {
        cc.debug.setDisplayStats(false)
        const width = this.node.getContentSize().width
        const height = this.node.getContentSize().height
        const buttonGap = 20
        const buttonWidth = (width - buttonGap * 3) / 2
        const buttonHeight = 60
        const topGap = 88
        let actions = this.setupActions()
        const rowCount = Math.floor(actions.length / 2) + 1
        const contentHeight = topGap + rowCount * (buttonHeight + buttonGap)
        const contentMaxHeight = height - 184
        if (contentHeight > contentMaxHeight) {
            this.scrollContent.setContentSize(width, contentHeight)
        } else {
            this.scrollContent.setContentSize(width, contentMaxHeight)
        }
        let index = 0
        for (const action of actions) {
            const btnNode = cc.instantiate(this.buttonPrefab)
            this.scrollContent.addChild(btnNode)
            const column = index % 2
            const row = Math.floor(index / 2)
            const x = buttonGap + buttonWidth / 2 + column * (buttonGap + buttonWidth) - width / 2
            const y = topGap + row * (buttonGap + buttonHeight) + buttonHeight / 2
            btnNode.setPosition(x, -y)
            btnNode.setContentSize(buttonWidth, buttonHeight)
            const btn = btnNode.getComponent(TestButton)
            btn.setText(action.title)
            btn.onClickCallback = action.action
            index++
        }
        this.registerObservers()
    }

    protected onDestroy(): void {
        this.unRegisterObservers()
    }

    registerObservers() {
        wp.onWebViewStateChanged(this.onWebViewStateChangedCallback)
    }

    unRegisterObservers() {
        wp.offWebViewStateChanged(this.onWebViewStateChangedCallback)
    }

    setupActions(): Action[] {
        const actions: Action[] = []
        actions.push({
            title: "login",
            action: () => {
                wp.login({
                    success: (rsp) => {
                        this.showSuccess(JSON.stringify(rsp))
                    },
                    fail: (code, msg) => {
                        this.showFail(`code: ${code} msg: ${msg}`)
                    }
                })
            }
        })
        actions.push({
            title: "getAppBaseInfo",
            action: () => {
                wp.getAppBaseInfo({
                    success: (rsp) => {
                        this.showSuccess(JSON.stringify(rsp))
                    },
                    fail: (code, msg) => {
                        this.showFail(`code: ${code} msg: ${msg}`)
                    }
                })
            }
        })
        actions.push({
            title: "getDeviceInfo",
            action: () => {
                wp.getDeviceInfo({
                    success: (rsp) => {
                        this.showSuccess(JSON.stringify(rsp))
                    },
                    fail: (code, msg) => {
                        this.showFail(`code: ${code} msg: ${msg}`)
                    }
                })
            }
        })
        actions.push({
            title: "getWindowInfo",
            action: () => {
                wp.getWindowInfo({
                    success: (rsp) => {
                        this.showSuccess(JSON.stringify(rsp))
                    },
                    fail: (code, msg) => {
                        this.showFail(`code: ${code} msg: ${msg}`)
                    }
                })
            }
        })
        actions.push({
            title: "recharge",
            action: () => {
                wp.recharge({
                    gold_num: 1000,
                    goods_name: "测试商品",
                    order_id: "test_order_id",
                    callback_url: "https://www.baidu.com",
                    extra: "test_extra",
                    success: (rsp) => {
                        this.showSuccess(JSON.stringify(rsp))
                    },
                    fail: (code, msg) => {
                        this.showFail(`code: ${code} msg: ${msg}`)
                    }
                })
            }
        })
        actions.push({
            title: "openWebPage",
            action: () => {
                wp.openWebPage({
                    url: "https://huiwan.wepie.com/docs/LJVxMTI0",
                    success: (rsp) => {
                        this.showSuccess(JSON.stringify(rsp))
                    },
                    fail: (code, msg) => {
                        this.showFail(`code: ${code} msg: ${msg}`)
                    }
                })
            }
        })
        actions.push({
            title: "share",
            action: () => {
                wp.share({
                    share_text: "测试分享文案",
                    share_title: "测试分享标题",
                    share_image_url: "http://wespynextpic.afunapp.com/wespy_game_1525836868.png",
                    success: (rsp) => {
                        this.showSuccess(JSON.stringify(rsp))
                    },
                    fail: (code, msg) => {
                        this.showFail(`code: ${code} msg: ${msg}`)
                    }
                })
            }
        })
        actions.push({
            title: "jumpDeeplink",
            action: () => {
                wp.jumpDeeplink({
                    deeplink: "wespydeeplink://discover_topic?topic_id=11067",
                    success: (rsp) => {
                        this.showSuccess(JSON.stringify(rsp))
                    },
                    fail: (code, msg) => {
                        this.showFail(`code: ${code} msg: ${msg}`)
                    }
                })
            }
        })
        return actions
    }

    showSuccess(text: string) {
        this.infoLabel.node.color = cc.Color.WHITE
        this.infoLabel.string = "调用成功: " + text
    }

    showFail(text: string) {
        this.infoLabel.node.color = cc.Color.RED
        this.infoLabel.string = "调用失败: " + text
    }

    showObserve(name: string, text: string) {
        this.infoLabel.node.color = cc.Color.YELLOW
        this.infoLabel.string = "监听到通知: " + name + " " + text
    }
}
