import baseUrl from './baseUrl'

let token = 'member_user eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtXzE1MTQ1NjQ1NjIyIiwicm9sZSI6Im1lbWJlcl91c2VyIiwiZXhwIjoxNzg0MDgyODkzLCJ1c2VySWQiOjEsImNyZWF0ZWQiOjE3NTI1NDY4OTM3MTd9.cDL1OuAml72fTippb8ivyrF_AsTDGIJnpgioY_iwcgPLMGBUP-PKOef1H-SIYWEBXEy5XDNMOU9eVfvG8jTN4A'
export const request = (config) => {
	return new Promise((resolve, reject) => {
		if (!config.notShowLoading) {
			uni.showLoading({
				title: '加载中...',
			})
		}
		let contentType = config.contentType || 'application/json';
		uni.request({
			url: baseUrl + config.url,
			data: config.data,
			header: {
				'Authorization': uni.getStorageSync('token') || token,
				'content-type': contentType,
			},
			method: config.method,
			success: (res) => {
				if (!config.notShowLoading) {
					uni.hideLoading();
				}
				if (res.data.code == 401) {
					uni.$u.toast((res.data.errMsg || '请先登录!'));
					setTimeout(() => {
						uni.navigateTo({
							url: "/pages/login/index/index"
						})
					}, 800)
					return;
				}
				if (res.data.code != 200) {
					let title = res.data.errMsg || res.errMsg;
					uni.$u.toast(title);
					return
				}
				resolve({
					...res.data
				})
			},
			fail: (err) => {
				uni.hideLoading();
				reject(err)
			},
		})
	}).catch(error => {
		uni.hideLoading();
	})
}