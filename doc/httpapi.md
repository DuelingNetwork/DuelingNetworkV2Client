# Dueling Network HTTP APIs

This document describes the HTTP actions for Dueling Network.

All requests share this base: http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/

#### login

##### Description
- logs the user in

##### Method: POST

##### Request Body
- `username`: The username to log in as. Case-insensitive.
- `password`: The password of the user to log in as.
- `rememberMe`: Whether, upon successful login, the user’s login should be maintained as part of the browser session.

##### Response
- `success`: Whether the login process was successful
- `error`: If the login was not successful, a string indicating the error which occurred
- `username`: If the login was successful, the “true” username of the account logged into. May be different than the username provided by the user (since username matching is case-insensitive).
- `confirmed`: If the login was successful, whether the account logged into has been activated via e-mail confirmation
- `reconfirmUrl`: If the login was successful but the account was found not to be confirmed, the URL to call to resend the confirmation e-mail. The reconfirm URL must be called via POST.
- `firstLogin`: If the login was successful, whether this is the first time the user has logged in. Used to display a welcome message for first-time users.
- `admin`: If the login was successful, the admin status of the user. 0 = not an admin, 1 = green admin, 2 = silver admin, 3 = gold admin, 4 = owner
- `banned`: If the login was successful, whether the user is currently banned. A banned user cannot log into the server.
- `banDaysLeft`: If the login was successful but the account was found to be banned, the number of days left in the ban. 0 indicates “very soon” or “less than a day.” Not set if the user is permanently banned.
- `loginToken`: If the login was successful and the user is confirmed and the user is not banned, a token used to log into the duel server.

#### logged_in

##### Description
- Checks whether the user is logged in. 

##### Method: GET

##### Request Body
- empty

##### Response
- Identical to that of the *`login`* action.

#### register

##### Description
- Registers a new account and sends a confirmation e-mail to activate the account.

##### Method: POST

##### Request Body
- `username`: The username to register the account with.
- `password`: The password to register the account with.
- `email`: The e-mail address to tie to the account. Must be unique across all users.

##### Response
- `success`: Whether the registration was successful.
- `error`: If the registration was not successful, a string indicating the error which occurred.
- `message`: If the registration was successful, a string describing next steps (i.e. “A link to activate your account has been sent to a@b.c”).

#### forgot_password

##### Description
- Enables password reset functionality on an account and sends the user an e-mail with a link to reset the account password. Automatically invalidates all old password reset links.

##### Method: POST

##### Request Body
- `email`: The e-mail address of the account with the forgotten password.

##### Response
- `success`: Whether the registration was successful.
- `error`: If the registration was not successful, a string indicating the error which occurred.
- `message`: If the registration was successful, a string describing next steps (i.e. “A link to reset your password has been sent to a@b.c”).

#### logout

##### Description
- Clears the user login from the browser session.

##### Method: POST

##### Request Body
- empty

##### Response
- `success`: Whether the user is now logged out.
- `error`: If the logout was not successful, a string indicating the error which occurred.
