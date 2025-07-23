import Vue from "vue";

//图片-图标地址过滤
Vue.filter("imgurl", function(url) {
	let fullUrl = url;
	if (!fullUrl) return "";
	fullUrl = "/static/images/main/" + fullUrl;
	return fullUrl;
});