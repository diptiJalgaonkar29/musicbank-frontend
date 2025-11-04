class NumberUtils {

  getRandomInt(maxValue) {
    return Math.floor(Math.random() * Math.floor(maxValue));
  }

  /* stringToHash(string) {                  
        var hash = 0;          
        if (string.length == 0) return hash;
          
        for (i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }          
        return hash;
    } */

}

export default new NumberUtils();