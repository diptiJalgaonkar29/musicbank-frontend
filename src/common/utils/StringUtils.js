import * as qs from 'qs';

class StringUtils {

  objectToString(object) {
    return qs.stringify(object);
  }

}

export default new StringUtils();