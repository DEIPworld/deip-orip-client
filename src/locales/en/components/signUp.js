import { project } from './basicWords';

export default {
  free: {
    toolbarButton: 'Explorer',
    title: 'Open Research and Innovation Platform',
    collaboration: 'Collaboration',
    tokenization: `${project(true)} tokenization`,
    licensing: 'Licensing of intellectual property',
    investing: 'Crowd investing',
    form: {
      title: 'Registration',
      emailField: 'Email',
      firstNameFiled: 'First Name',
      lastNameFiled: 'Last Name',
      usernameField: 'Username',
      passwordField: 'Master Password',
      rePasswordField: 'Re-Enter Master Password',
      savedKeyText: 'Please confirm you have saved the generated key',
      savedKeyCheckbox: 'I have saved the password',
      privacyText: 'No data is stored until you press “Finish Registration” button. For more information about our privacy terms please read <a class="a" target="_blank" href="{link}">Privacy Policy</a>. By clicking below, you agree that we may process ypur information in accordance with these terms.',
      rules: {
        unique: 'Username should be unique in system',
        nameChars: 'Incorrect value',
        email: 'Invalid E-mail',
        rePasswordField: 'Passwords didn\'t match. Try again.'
      },
      submitBtn: 'Finish registration',
      bottomText: 'Already have an account?',
      bottomTextLink: 'Sign In',
      success: 'Account \'{account}\' has been created successfully! Use the password/private key to sign in to the platform!',
      err: 'Sorry, the service is temporarily unavailable, please try again later'
    }
  }
};
