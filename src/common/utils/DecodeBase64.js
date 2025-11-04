const decodeBase64ToString = (base64Str) => {
    return decodeURIComponent(escape(atob(base64Str)));
};

export default decodeBase64ToString;
