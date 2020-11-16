import { ErrorType } from 'src/app/models/error';

export enum ACCOUNT {
    LOGIN_FAILED = 1,
    GOOGLE_VALIDATE_FAILED = 2
}

export class AccountMessages {
    constructor(private language: string) { }
    getMessage(code: number) {
        if (this.language === "zh_CN") {
            switch (code) {
                case ErrorType.REACH_API_LIMIT: return { title: "提示：", text: "操作频繁，请稍后重试", confirm: "确认" };
                case ErrorType.VERIFY_CODE_UNMATCHED: return { title: "提示：", text: "验证码错误", confirm: "确认" };
                case ErrorType.SEND_MAIL_VERIFY_CODE_FAILURE: return { title: "提示：", text: "邮件验证码发送失败", confirm: "确认" };
                case ErrorType.SEND_SMS_VERIFY_CODE_FAILURE: return { title: "提示：", text: "手机验证码发送失败", confirm: "确认" };
                case ErrorType.DUPLICATE_VERIFICATION: return { title: "提示：", text: "该手机号已被注册或已被绑定，请勿重复使用", confirm: "确认" };
                case ErrorType.PHONE_NUM_INVALID: return { title: "提示：", text: "手机号码无效", confirm: "确认" };
                case ErrorType.DUPLICATE_REGISTRATION: return { title: "提示：", text: "该账号已注册，请直接登录", confirm: "确认" };
                case ErrorType.INVALID_USER_INFO: return { title: "提示：", text: "账号信息无效", confirm: "确认" };
                case ErrorType.INACTIVATED_USER: return { title: "提示：", text: "此账号尚未激活", confirm: "确认" };
                case ErrorType.GEETEST_FAILURE: return { title: "提示：", text: "滑块验证失败", confirm: "确认" };
                case ErrorType.ACTIVATION_FAILURE: return { title: "提示：", text: "账号激活失败", confirm: "确认" };
                case ErrorType.TWO_STEP_FAILURE: return { title: "提示：", text: "谷歌二次认证失败", confirm: "确认" };
                case ACCOUNT.LOGIN_FAILED: return { title: "提示：", text: "登录失败！请确认您的账号密码正确无误，且账号已经成功激活。(如果原激活邮件丢失，请使用相同邮箱重新注册)", confirm: "确认" };
                case ACCOUNT.GOOGLE_VALIDATE_FAILED: return { title: "提示：", text: "登录失败, 谷歌二次认证验证码错误", confirm: "确认" };
                default: return { title: "提示：", text: "未知错误", confirm: "确认" };
            }
        }
        switch (code) {
            case ErrorType.REACH_API_LIMIT: return { title: "Oops:", text: "Frequent operation, please try again later", confirm: "Confirm" };
            case ErrorType.VERIFY_CODE_UNMATCHED: return { title: "Oops:", text: "Validation code is invalid", confirm: "Confirm" };
            case ErrorType.SEND_MAIL_VERIFY_CODE_FAILURE: return { title: "Oops:", text: "Failed to send verification code via Email", confirm: "Confirm" };
            case ErrorType.SEND_SMS_VERIFY_CODE_FAILURE: return { title: "Oops:", text: "Failed to send verification code via SMS", confirm: "Confirm" };
            case ErrorType.DUPLICATE_VERIFICATION: return { title: "Oops:", text: "This phone number is already in-use, please use another one", confirm: "Confirm" };
            case ErrorType.PHONE_NUM_INVALID: return { title: "Oops:", text: "Invalid phone number", confirm: "Confirm" };
            case ErrorType.DUPLICATE_REGISTRATION: return { title: "Oops:", text: "Account already exists, please login", confirm: "Confirm" };
            case ErrorType.INVALID_USER_INFO: return { title: "Oops:", text: "Invalid account information", confirm: "Confirm" };
            case ErrorType.INACTIVATED_USER: return { title: "Oops:", text: "This account hasn't been activated yet", confirm: "Confirm" };
            case ErrorType.GEETEST_FAILURE: return { title: "Oops:", text: "Slider validation failed", confirm: "Confirm" };
            case ErrorType.ACTIVATION_FAILURE: return { title: "Oops:", text: "Account activation failed", confirm: "Confirm" };
            case ErrorType.TWO_STEP_FAILURE: return { title: "Oops:", text: "Two-step authentication failed", confirm: "Confirm" };
            case ACCOUNT.LOGIN_FAILED: return { title: "Oops:", text: "Login failed! Please make sure that your account password is correct and the account has been activated successfully. (If the original activation mail is lost, please re-register with the same email address)", confirm: "Confirm" };
            case ACCOUNT.GOOGLE_VALIDATE_FAILED: return { title: "Oops:", text: "Login failed! Google Two step authentication code is invalid", confirm: "Confirm" };
            default: return { title: "Oops:", text: "Unknown Error", confirm: "Confirm" };
        }
    }
}

export enum WITHDRAW {
    ADDRESS_INVALID = 1,
    AMOUNT_NOT_ENOUGH = 2,
    TOKEN_INVALID = 3,
    BALANCE_NOT_ENOUGH = 4,
    SUCCESS = 200
}

export class WalletMessages {
    constructor(private language: string) { }
    getMessage(code: number) {
        if (this.language === 'zh_CN') {
            switch (code) {
                case WITHDRAW.SUCCESS: return { title: "提示：", text: "已成功提交提现申请" };
                case WITHDRAW.ADDRESS_INVALID: return { title: "提示：", text: "提現地址不能为空" };
                case WITHDRAW.TOKEN_INVALID: return { title: "提示：", text: "验证码出错啦" };
                case WITHDRAW.AMOUNT_NOT_ENOUGH: return { title: "提示：", text: "提现数额不能小于最小提现额度" };
                case WITHDRAW.BALANCE_NOT_ENOUGH: return { title: "提示：", text: "提现数额超出了可用余额" };
                case ErrorType.TWO_STEP_FAILURE: return { title: "提示：", text: "谷歌二次认证失败" };
                case ErrorType.INVALID_ADDRESS: return { title: "提示：", text: "提现地址出错啦" };
                case ErrorType.WITHDRAW_FALIURE: return { title: "提示：", text: "提现失败" };
                case ErrorType.INVALID_WITHDRAW_AMOUNT: return { title: "提示：", text: "请确认提现数额" };
                default: return { title: "提示：", text: "未知错误" };
            }
        }
        switch (code) {
            case WITHDRAW.SUCCESS: return { title: "Tips:", text: "The withdrawal application has been successfully submitted." };
            case WITHDRAW.ADDRESS_INVALID: return { title: "Oops:", text: "The withdraw address cannot be empty" };
            case WITHDRAW.TOKEN_INVALID: return { title: "Oops:", text: "Invalid Verify Code" };
            case WITHDRAW.AMOUNT_NOT_ENOUGH: return { title: "Oops:", text: "The amount of withdrawal shall not be less than the minimum amount of withdrawal." };
            case WITHDRAW.BALANCE_NOT_ENOUGH: return { title: "Oops:", text: "The amount of withdrawal exceeds the available balance" };
            case ErrorType.TWO_STEP_FAILURE: return { title: "Oops:", text: "Two-step authentication failed" };
            case ErrorType.INVALID_ADDRESS: return { title: "Oops:", text: "Invalid withdraw address" };
            case ErrorType.WITHDRAW_FALIURE: return { title: "Oops:", text: "Withdraw Faliure" };
            case ErrorType.INVALID_WITHDRAW_AMOUNT: return { title: "Oops:", text: "Please confirm the withdrawal amount." };
            default: return { title: "Oops:", text: "Unknown Error" };
        }
    }
}

export enum TRADE {
    BUY_WARNING = 1,
    SELL_WARNING = 2,
    INSUFFICIENT_AVAILABLE = 3,
}

export class TradeMessages {
    constructor(private language: string) { }
    getMessage(code: number) {
        if (this.language === 'zh_CN') {
            switch (code) {
                case TRADE.BUY_WARNING: return { title: "警告：", text: "买入价格高于现价的110%，仍然要交易吗？", confirm: "确定", cancel: "取消" };
                case TRADE.SELL_WARNING: return { title: "警告：", text: "卖出价格低于现价的90%，仍然要交易吗？", confirm: "确定", cancel: "取消" };
                case TRADE.INSUFFICIENT_AVAILABLE: return { title: "提示：", text: "可用余额不足", confirm: "确定" };
                default: return { title: "提示：", text: "未知错误" };
            }
        }
        switch (code) {
            case TRADE.BUY_WARNING: return { title: "Warning:", text: "Buy price is more than 110% of current price, continue?", confirm: "OK", cancel: "Cancel" };
            case TRADE.SELL_WARNING: return { title: "Warning:", text: "Sell price is less than 90% of current price, continue?", confirm: "OK", cancel: "Cancel" };
            case TRADE.INSUFFICIENT_AVAILABLE: return { title: "Oops:", text: "Insufficient available balance", confirm: "OK" };
            default: return { title: "Oops:", text: "Unknown Error" };
        }
    }
}

export enum INVITE {
    COPY_SUCCESS = "copy success"
}

export class InviteMessages {
    constructor(private language: string) { }
    getMessage(code: number | string) {
        if (this.language === 'zh_CN') {
            switch (code) {
                case INVITE.COPY_SUCCESS: return { title: "提示：", text: "复制成功" };
                default: return { title: "提示：", text: "未知错误" };
            }
        }
        switch (code) {
            case INVITE.COPY_SUCCESS: return { title: "Tips:", text: "Copy Successfully" };
            default: return { title: "Oops:", text: "Unknown Error" };
        }
    }
}

export enum FINANCING {
    TRANSFER_SUCCESS = 1,
    FORCIBLE_WITHDRAW_SUCCESS = 2,
    DEFREEZE_SUCCESS = 3,
    PURCHASE_SUCCESS = 4,
    PURCHASE_AMOUNT_INVALID = 5,
    INSUFFICIENT_AVAILABLE_TO_TRANSFER = 6,
    TRANSFER_AMOUNT_INVALID = 7
}

export class FinancingMessages {
    constructor(private language: string) { }
    getMessage(code: number | string) {
        if (this.language === 'zh_CN') {
            switch (code) {
                case ErrorType.PURCHASE_LIMIT_UNSATISFIED: return { title: "提示：", text: "认购额小于该产品最小认购额", confirm: "确定" };
                case ErrorType.UNLOCK_LIMIT_UNSATISFIED: return { title: "提示：", text: "用户输入的解冻额低于最小解冻额", confirm: "确定" };
                case ErrorType.INSUFFICIENT_INTEREST_TO_UNLOCK: return { title: "提示：", text: "可用利息余额不足", confirm: "确定" }
                case ErrorType.PRODUCT_FILLED_UP: return { title: "提示：", text: "认购额度已满", confirm: "确定" };
                case ErrorType.INSUFFICIENT_AVAILABLE_TO_PURCHASE: return { title: "提示：", text: "余额不足购买该产品", confirm: "确定" };
                case ErrorType.INSUFFICIENT_TRANSFER: return { title: "提示：", text: "可用余额少于用户输入的划转额", confirm: "确定" };
                case FINANCING.DEFREEZE_SUCCESS: return { title: "提示：", text: "解冻成功", confirm: "确定" };
                case FINANCING.TRANSFER_SUCCESS: return { title: "提示：", text: "划转成功", confirm: "确定" };
                case FINANCING.FORCIBLE_WITHDRAW_SUCCESS: return { title: "提示：", text: "赎回成功", confirm: "确定" };
                case FINANCING.PURCHASE_SUCCESS: return { title: "提示：", text: "认购成功", confirm: "确定" };
                case FINANCING.PURCHASE_AMOUNT_INVALID: return { title: "提示：", text: "认购额度错误", confirm: "确定" };
                case FINANCING.INSUFFICIENT_AVAILABLE_TO_TRANSFER: return { title: "提示：", text: "可用划转额度不足", confirm: "确定" };
                case FINANCING.TRANSFER_AMOUNT_INVALID: return { title: "提示：", text: "划转额度错误", confirm: "确定" };
                default: return { title: "提示：", text: "未知错误", confirm: "确认" };
            }
        }
        switch (code) {
            case ErrorType.PURCHASE_LIMIT_UNSATISFIED: return { title: "Oops:", text: "The subscription amount is less than the minimum subscription amount for the product.", confirm: "OK" };
            case ErrorType.UNLOCK_LIMIT_UNSATISFIED: return { title: "Oops:", text: "The user input thawing amount is less than the minimum thawing amount", confirm: "OK" };
            case ErrorType.INSUFFICIENT_INTEREST_TO_UNLOCK: return { title: "Oops:", text: "Insufficient balance of available interest", confirm: "OK" }
            case ErrorType.PRODUCT_FILLED_UP: return { title: "Oops:", text: "The subscription amount is full", confirm: "OK" };
            case ErrorType.INSUFFICIENT_AVAILABLE_TO_PURCHASE: return { title: "Oops:", text: "The balance is insufficient to purchase the product.", confirm: "OK" };
            case ErrorType.INSUFFICIENT_TRANSFER: return { title: "Oops:", text: "Available balance less than the transfer amount entered by the user", confirm: "OK" };
            case FINANCING.DEFREEZE_SUCCESS: return { title: "Tips:", text: "Defreeze Successfully", confirm: "OK" };
            case FINANCING.TRANSFER_SUCCESS: return { title: "Tips:", text: "Transfer Successfully", confirm: "OK" };
            case FINANCING.FORCIBLE_WITHDRAW_SUCCESS: return { title: "Tips:", text: "Forcible Withdraw Successfully", confirm: "OK" };
            case FINANCING.PURCHASE_SUCCESS: return { title: "Tips:", text: "Purchase Successfully", confirm: "OK" };
            case FINANCING.PURCHASE_AMOUNT_INVALID: return { title: "Oops:", text: "Purchase Amount Invalid", confirm: "OK" };
            case FINANCING.INSUFFICIENT_AVAILABLE_TO_TRANSFER: return { title: "Oops:", text: "Insufficient Transfer Amount", confirm: "OK" };
            case FINANCING.TRANSFER_AMOUNT_INVALID: return { title: "Oops:", text: "Transfer Amount Invalid", confirm: "OK" };
            default: return { title: "Oops:", text: "Unknown Error", confirm: "OK" };
        }
    }
}

export enum Events {
    REPEAT_PARTICIPATION = 1,
    PARTICIPATION_AMOUNT_INVALID = 2,
    SUCCESSFUL_PARTICIPATION = 3, 


}

export class EventsMessages {
    constructor(private language: string) { }
    getMessage(code: number | string) {
        if (this.language === 'zh_CN') {
            switch (code) {
                case ErrorType.INSUFFICIENT_BALANCE_TO_PARTICIPATE: return { title: "提示：", text: "余额不足，无法参加", confirm: "确定" };
                case ErrorType.INSUFFICIENT_REQUIRED_BALANCE_TO_PARTICIPATE: return { title: "提示：", text: "余额不足，无法参加", confirm: "确定" };
                case ErrorType.MINIMUM_HOLD_UNSATISFIED: return { title: "提示：", text: "不满足最低持有量", confirm: "确定" };
                case ErrorType.INVALID_PARTICIPATION: return { title: "提示：", text: "未找到该参与该活动的信息", confirm: "确定" };
                case Events.PARTICIPATION_AMOUNT_INVALID: return { title: "提示：", text: "参与额度错误", confirm: "确定" };
                case Events.REPEAT_PARTICIPATION: return { title: "提示：", text: "不满足抽奖条件或已经参加过此抽奖", confirm: "确定" };
                case Events.SUCCESSFUL_PARTICIPATION: return { title: '提示:', text: "参与成功！", confirm: "确定" };
                default: return { title: "提示：", text: "未知错误", confirm: "确认" };
            }
        }
        switch (code) {
            case ErrorType.INSUFFICIENT_BALANCE_TO_PARTICIPATE: return { title: "Oops:", text: "The balance is insufficient to participate", confirm: "OK" };
            case ErrorType.INSUFFICIENT_REQUIRED_BALANCE_TO_PARTICIPATE: return { title: "Oops:", text: "The balance is insufficient to participate", confirm: "OK" };
            case ErrorType.MINIMUM_HOLD_UNSATISFIED: return { title: "Oops:", text: "Minimun hold unsatisfed", confirm: "OK" };
            case ErrorType.INVALID_PARTICIPATION: return { title: "Oops:", text: "No information was found about the participation in the event.", confirm: "OK" };
            case Events.PARTICIPATION_AMOUNT_INVALID: return { title: "Oops:", text: "Participation Amount Invalid", confirm: "OK" };
            case Events.REPEAT_PARTICIPATION: return { title: "Oops:", text: "Do not meet the draw conditions or have participated in the draw", confirm: "OK" };
            case Events.SUCCESSFUL_PARTICIPATION: return { title: 'Tips:', text: "Successful Participation ！", confirm: "OK" };
            default: return { title: "Oops:", text: "Unknown Error", confirm: "OK" };
        }
    }
}