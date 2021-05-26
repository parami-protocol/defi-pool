export const getLanguage = () => {
    let language = localStorage.getItem('language');
    const lang = navigator.language || navigator.userLanguage; // 常规浏览器语言和IE浏览器
    language = language || lang;
    language = language.replace(/-/, '_').toLowerCase();
    if (language === 'zh_cn' || language === 'zh') {
    language = 'zh_CN';
    } else if (language === 'zh_tw' || language === 'zh_hk') {
    language = 'zh_TW';
    } else {
    language = 'en_US';
    }
    return language;
    }