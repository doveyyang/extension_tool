// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
const API_TOKEN = 'a935f146542257018700e139720407520cee23e1';
const BASEURL = 'http://lost.jade2707.top';
const LOGIN_TOKEN = "$2y$10$OCweuQxBYPyzESOre3y39u.hLXLipxcdSvGQTK2CEaemFWBPIqyFe";
const getUsers = function () {
    let ret = '';
    ret = uni.getStorageSync(USERS_KEY);
    if (!ret) {
        ret = '[]';
    }
    return JSON.parse(ret);
}

const addUser = function (userInfo) {
    let users = getUsers();
    users.push({
        account: userInfo.account,
        password: userInfo.password
    });
    uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}

export default {
    getUsers,
    addUser,
	LOGIN_TOKEN,
	API_TOKEN,
	BASEURL
}
