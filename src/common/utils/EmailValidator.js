const EMAIL_REGEX = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;

class EmailValidator {
  validate(email) {
    // console.log('in email validator '+email);
    return EMAIL_REGEX.test(email);
  }
}

export default new EmailValidator();
