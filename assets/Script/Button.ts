// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestButton extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    onClickCallback: () => void = null

    onClick() {
        if (this.onClickCallback) {
            this.onClickCallback()
        }
    }

    setText(text: string) {
        this.label.string = text
    }
}
