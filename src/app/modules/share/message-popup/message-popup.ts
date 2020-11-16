export enum MessagePopupType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning"
}

export class MessagePopup {
  static showTime: number;
  static show(type: MessagePopupType, title: string, content: string, confirmBtnTitle: string, cancelBtnTitle?: string, callBack?: any) {
    let icon = MessagePopup.getIconHtml(type);
    let element = document.createElement("div");
    element.id = "messagePopupContainer";
    let css = `<style>
                 #messagePopupShadow {
                  width: 100%;
                  height: 100%;
                  position: fixed;
                  top: 0;
                  left: 0;
                  background: black;
                  opacity: 0;
                  z-index: 1999;
                  transition:0.2s;
                 }

                 #messageBox {
                  border-radius: 5px;
                  padding: 32px 32px 24px;
                  width: 416px;
                  z-index: 2000;
                  background: #fff;
                  display: flex;
                  position: fixed;
                  top: 300px;
                  left: calc((100% - 416px)/2);
                  transition:0.2s;
                  opacity: 0;
                  transform:scale(0,0);
                 }

                 #messagePopupConfirmBtn {
                  background:#00ACDC;
                  color:#fff;
                  padding:5px 20px 5px 20px;
                  border:none;
                  border-radius:4px;
                 }
                 #messagePopupCancelBtn {
                  background: #fff;
                  color: #f5222d;
                  border: solid 1px #f5222d;
                  padding: 5px 20px 5px 20px;
                  border-radius: 4px;
                  margin-right:20px;
                 }
               </style>`
    let cancelBtnHtml = cancelBtnTitle ? `<button id="messagePopupCancelBtn"> ${cancelBtnTitle} </button>` : '';
    let template = `<div id="messagePopupShadow"></div>
                    <div id="messageBox">
                      <div style="display:flex;flex-flow: wrap;width: 100%;">
                        ${icon}
                        <h3 style="flex:0 0 90%;padding-left:16px;">${title}</h3>
                        <span style="padding-left:38px;flex: 0 0 100%;">${content}</span>
                        <div style="display: flex;flex: 0 0 100%;justify-content: flex-end;margin-top: 24px;">
                          ${cancelBtnHtml}
                          <button id="messagePopupConfirmBtn" > ${confirmBtnTitle} </button>
                        </div>
                      </div>
                    </div>`;
    element.innerHTML = css + template;
    document.body.appendChild(element);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.getElementById('messagePopupShadow').style.opacity = "0.5";
      document.getElementById('messageBox').style.opacity = "1";
      document.getElementById('messageBox').style.transform = "scale(1.2,1.2)";
      setTimeout(() => {
        document.getElementById('messageBox').style.transform = "scale(1,1)";
      }, 200);
    }, 20);
    document.getElementById("messagePopupConfirmBtn").onclick = () => {
      MessagePopup.hide();
      if (callBack) callBack();
    };
    if (cancelBtnTitle) document.getElementById("messagePopupCancelBtn").onclick = () => MessagePopup.hide();
    MessagePopup.showTime = Date.now();
    return MessagePopup.showTime
  }

  static hide(callBack?: any, showTime?: number) {
    if (showTime && showTime != MessagePopup.showTime) return;
    let element = document.getElementById('messagePopupContainer');
    if (element) {
      document.getElementById('messagePopupShadow').style.opacity = "0";
      document.getElementById('messageBox').style.opacity = "0";
      document.getElementById('messageBox').style.transform = "scale(0,0)";
      setTimeout(() => {
        element.parentNode.removeChild(element);
        document.body.style.overflow = "auto";
      }, 200);
    }
    if (callBack) setTimeout(() => callBack(), 250);
  }

  private static getIconHtml(type: string) {
    switch (type) {
      case MessagePopupType.ERROR: return '<i style="color: #f5222d;font-size: 22px;"><svg viewBox="64 64 896 896" fill="currentColor" width="1em" height="1em" data-icon="close-circle" aria-hidden="true"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg></i>';
      case MessagePopupType.SUCCESS: return '<i style="color:#52c41a;font-size: 22px;"><svg viewBox="64 64 896 896" fill="currentColor" width="1em" height="1em" data-icon="check-circle" aria-hidden="true"><path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg></i>';
      case MessagePopupType.WARNING: return '<i style="color:#faad14;font-size: 22px;"><svg viewBox="64 64 896 896" fill="currentColor" width="1em" height="1em" data-icon="exclamation-circle" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM488 576h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path></svg></i>';
      default: return "undefined";
    }
  }
}

