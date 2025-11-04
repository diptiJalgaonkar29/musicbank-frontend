const { v4: uuidv4 } = require('uuid');

export function generateUniqueID () {
  return uuidv4();
}