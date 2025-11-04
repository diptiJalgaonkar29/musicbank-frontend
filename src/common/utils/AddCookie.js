const addCookie = (name, value, days) => {
  // console.log("addcookie- ", name);
  if (name == "basket") {
    // console.log("addcookie-value", value);

    value = JSON.parse(value);

    const result = [
      ...value
        .reduce((r, o) => {
          const key = o.id + "-" + o.audio_type;
          //const item = r.get(key) || Object.assign({}, o, { times: 0 });
          const item = r.get(key) || Object.assign({}, o);
          //item.times += 1;
          return r.set(key, item);
        }, new Map())
        .values(),
    ];

    value = JSON.stringify(result);

    // console.log("addcookie-new value", Object.values(result));
  }

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
  } else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/;SameSite=Strict";
};

export default addCookie;
