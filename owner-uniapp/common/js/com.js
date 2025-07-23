import baseUrl from '@/utils/baseUrl.js'
export default {

	// 跳转页面 
	// pageUrl:页面地址  type(默认navigateTo):跳转方式  needLogin(默认false):是否需要登录
	goPageByUrl: function(pageUrl, type, needLogin, isGoLoginPage) {
		if (needLogin == true && !uni.getStorageSync("token")) {
			uni.$u.toast('请先登录!');
			if (isGoLoginPage == true) {
				setTimeout(() => {
					this.goLoginPage();
				}, 800)
			}
			return;
		}
		if (type == 'switchTab') {
			uni.switchTab({
				url: pageUrl
			})
		} else if (type == 'redirectTo') {
			uni.redirectTo({
				url: pageUrl
			})

		} else if (type == 'reLaunch') {
			uni.reLaunch({
				url: pageUrl
			})
		} else {
			uni.navigateTo({
				url: pageUrl
			})
		}
	},

	//返回页面 
	//isRefresh(默认false):是否刷新 - method返回页面调用的方法名
	goBack: function(isRefresh, method, config) {
		var pages = getCurrentPages();
		var prePage = pages[pages.length - 2]; //获取 上一个页面
		if (pages.length > 1) {
			uni.navigateBack({
				delta: 1, //返回层数，2则上上页
				success() {
					if (isRefresh) {
						prePage.$vm.needRefresh = true; //刷新
					}
					if (method) {
						prePage.$vm[method](config);
					}
				}
			})
		} else {
			this.goPageByUrl('/pages/home/index/index', 'reLaunch')
		}
	},

	//隐藏手机号(4位,6位)
	//phoneNumber:手机号  hideDigit:隐藏位数(4/6)  hideSymbol(默认*):隐藏替代符
	hidePhoneNumber(phoneNumber, hideDigit, hideSymbol) {
		if (typeof phoneNumber !== 'string' || phoneNumber.length !== 11) {
			return phoneNumber;
		}
		let symbol = hideSymbol || '*';
		if (hideDigit == 4) {
			return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, `$1${symbol}${symbol}${symbol}${symbol}$2`);
		} else if (hideDigit == 6) {
			return phoneNumber.replace(/(\d{3})\d{6}(\d{2})/,
				`$1${symbol}${symbol}${symbol}${symbol}${symbol}${symbol}$2`);
		}
	},

	//预览图片 pic可传单个图片地址字符串 或 图片数组(带index)
	previewPic: function(pic, index) {
		if (!pic) return;
		if (index == undefined) {
			let array = [];
			array.push(pic);
			uni.previewImage({
				urls: array,
				current: array[0]
			});
		} else {
			uni.previewImage({
				urls: pic,
				current: index
			});
		}
	},

	//提示框
	//msg: 提示內容, timeMs: 展示时间(毫秒单位), icon:图标名
	showMessage: function(msg, timeMs, icon) {
		uni.showToast({
			title: msg,
			duration: timeMs || 800,
			icon: icon || 'none',
		});
	},

	//登录成功
	onLoginSuccess: function(res) {
		uni.$u.toast('登录成功!');
		this.clearUserCache();
		uni.setStorageSync("token", res.data.token);
		uni.setStorageSync("userInfo", res.data.profile);
		uni.setStorageSync("loginType", true);
		setTimeout(() => {
			this.goPageByUrl('/pages/home/index/index', 'switchTab')
		}, 800)
	},

	//退出登录
	logOut: function(msg) {
		uni.$u.toast(msg || '退出登录成功!');
		this.clearUserCache();
		setTimeout(() => {
			this.goPageByUrl('/pages/home/index/index', 'switchTab');
		}, 800);
	},

	//清除除协议以外的用户缓存
	clearUserCache: function() {
		uni.removeStorageSync('userInfo');
		uni.removeStorageSync('token');
		uni.removeStorageSync('loginType');
	},

	// 检查未登录后跳转登录页面
	checkLoginAndRedirect: function(loginType) {
		if (loginType) {
			uni.$u.toast('请先登录!');
			setTimeout(() => {
				this.toLogin();
			}, 800)
		}
	},

	//跳转登录
	toLogin: function() {
		this.goPageByUrl('/pages/login/index/index', 'reLaunch');
	},

	//拨打电话
	makePhoneCall: function(phone) {
		uni.makePhoneCall({
			phoneNumber: phone
		});
	},

	//分转化为元 fenToYuan(256) = 2.56
	fenToYuan: function(amount) {
		if (!amount) {
			return 0;
		} else {
			let num = (Number(amount) / 100).toFixed(2);
			let handleNum = parseFloat(num)
			let isToFixed = handleNum.toString().includes('.') && handleNum.toString().split('.')[1].length > 2
			if (isToFixed) {
				return handleNum.toFixed(2);
			} else {
				return handleNum
			}
		}
	},

	//元转分 yuanToFen(2.56) = 256
	yuanToFen: function(amount) {
		return Math.round(Number(amount) * 100).toString()
	},

	//数字转换为字符串
	numberToString: function(n) {
		n = n.toString()
		return n[1] ? n : `0${n}`
	},

	//字符串转为数字
	stringToNumber: function(n) {
		n = Number(n);
		return n ? n : `0${n}` //是否正确待检验
	},

	// 运算
	// num1: 第一个数, num2: 第二个数, symbol: 符号(+-*/)
	amend: function(num1, num2, symbol) {
		if (!num1) num1 = 0;
		if (!num2) num2 = 0;
		var str1 = num1.toString(),
			str2 = num2.toString(),
			result, str1Length, str2Length
		//解决整数没有小数点方法
		try {
			str1Length = str1.split('.')[1].length
		} catch (error) {
			str1Length = 0
		}
		try {
			str2Length = str2.split('.')[1].length
		} catch (error) {
			str2Length = 0
		}
		var step = Math.pow(10, Math.max(str1Length, str2Length))
		switch (symbol) {
			case "+":
				result = (num1 * step + num2 * step) / step
				break;
			case "-":
				result = (num1 * step - num2 * step) / step
				break;
			case "*":
				result = ((num1 * step) * (num2 * step)) / step / step
				break;
			case "/":
				result = (num1 * step) / (num2 * step)
				break;
			default:
				break;
		}
		return result
	},
}