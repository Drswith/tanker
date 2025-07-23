export default {
	//日期字符串转成时间戳 例如 2024-11-11 13:00:00 -> 1731301200000
	dateStrChangeTimeTamp: function(dateStr) {
		dateStr = dateStr.substring(0, 19);
		dateStr = dateStr.replace(/-/g, '/');
		var timeTamp = new Date(dateStr).getTime();
		return timeTamp
	},

	//时间戳转时间 例如 timestamp: 156894231, -> type为"date": 2024-11-11; "time": 12:00:00; default: 2024-11-11 12:00:00;
	timestampToTime: function(timestamp, type) {
		// console.log("timestamp", timestamp)
		if (!timestamp) {
			return ""
		}
		if (timestamp.length == 10) {
			timestamp = timestamp * 1000
		}
		var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
		if (type == "date") {
			return Y + M + D;
		}
		var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
		if (type == "time") {
			return h + m + s;
		}
		return Y + M + D + ' ' + h + m + s;
	},

	//日期时间过滤  例如 2024-12-10 12:00:02 -> date: 2024-12-10; time: 12:00; year-month: 2024-12; month-date: 12-10; default: 2024-12-10 12:00
	timeStringFilter: function(timeStr, type) {
		if (!timeStr) {
			return ''
		}
		if (type == 'date') {
			return timeStr.substring(0, 10)
		} else if (type == 'time') {
			return timeStr.substring(11, timeStr.length - 3)
		} else if (type == 'year-month') {
			return timeStr.substring(0, 7)
		} else if (type == 'month-date') {
			return timeStr.substring(5, 10)
		} else {
			return timeStr.slice(0, timeStr.length - 3)
		}
	},

	// 秒转分钟 例如 61 -> 1分钟1秒
	secondsToMinutes(seconds) {
		if (!seconds) {
			return ''
		}
		let minutes = Math.floor(seconds / 60);
		let remainingSeconds = seconds % 60;
		if (minutes == 0) {
			return remainingSeconds + "秒";
		} else if (remainingSeconds == 0) {
			return minutes + "分钟 "
		} else {
			return minutes + "分钟" + remainingSeconds + "秒";
		}
	},

	// 小时数转分钟 changeStrToMinutes(5) = 300
	changeStrToMinutes: function(time) {
		if (!time) {
			return 0;
		} else {
			return Number(time) * 60;
		}
	},

	// 分钟转小时 changeStrToHour(30) = 0.5
	changeStrToHour: function(time) {
		if (!time) {
			return 0;
		} else {
			let num = (Number(time) / 60).toFixed(2);
			let handleNum = parseFloat(num)
			let isToFixed = handleNum.toString().includes('.') && handleNum.toString().split('.')[1].length > 2
			if (isToFixed) {
				return handleNum.toFixed(2);
			} else {
				return handleNum
			}
		}
	},

	// 分钟数转换为 120 => 02:00
	changeHourMinutestr: function(str) {
		if (str !== "0" && str !== "" && str !== null) {
			return ((Math.floor(str / 60)).toString().length < 2 ? "0" + (Math.floor(str / 60)).toString() :
				(Math.floor(str / 60)).toString()) + ":" + ((str % 60).toString().length < 2 ? "0" + (str % 60)
				.toString() : (str % 60).toString());
		} else if (str == 0) {
			return "00:00"
		} else {
			return "";
		}
	},

	// 小时分钟格式转换为分钟数 02:00 => 120
	changeStrToMinutestr: function(str) {
		var arrminutes = str.split(":");
		if (arrminutes.length == 2) {
			var minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
			return minutes;
		} else {
			return 0;
		}
	},

	//日期增加
	addDate: function(date) {
		var curDate = new Date(date);
		console.log(curDate);
		var dateTime = new Date((curDate / 1000 + 86400) * 1000); //86400一天   
		console.log(dateTime);
		var mon = (dateTime.getMonth() + 1);
		console.log(mon);
		var day = (dateTime.getDate());
		// if(mon<10){
		// 	mon="0"+mon;
		// }if(day<2){
		// 	day ="0"+day;
		// }
		//return dateTime.getFullYear() + '-' + mon + '-' + day;
		return dateTime.getFullYear() + '-' + (mon < 10 ? "0" + mon : mon) + '-' + (day < 10 ? "0" + day : day);
	},

	//计算时间差 -- startTime: xxxx-xx-xx hh:mm:ss
	intervalTime: function(startTime, endTime) {
		if (!startTime || !endTime) {
			return "未知"
		}
		if (startTime >= endTime) {
			return '0分0秒'
		}
		var date1 = new Date(startTime).getTime() / 1000;
		var date2 = endTime ? new Date(endTime).getTime() / 1000 : (Date.parse(new Date())) / 1000;
		// var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
		var date3 = (date2 - date1) * 1000; //时间差的毫秒数
		//计算出相差天数
		var days = Math.floor(date3 / (24 * 3600 * 1000));
		//计算出小时数
		var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
		var hours = Math.floor(leave1 / (3600 * 1000));
		//计算相差分钟数
		var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
		var minutes = Math.floor(leave2 / (60 * 1000));
		//计算相差秒数
		var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
		var seconds = Math.round(leave3 / 1000);
		if (!days && !hours) {
			return minutes + "分" + seconds + "秒"
		}
		return (days ? days + "天" : '') + hours + "小时" + minutes + "分" + seconds + "秒"
	}
}