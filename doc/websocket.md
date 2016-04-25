# DuelingNetwork WS Protocol

Below is a compilation of all the progress made on this protocol.

Source code examples can be found in the main project scripts.

### Initialization

1. User has received their `loginToken` (refer to the [HTTP API](https://github.com/DuelingNetwork/DuelingNetworkV2Client/blob/master/doc/httpapi.md))
2. User opens up a new WebSocket connection (currently using `ws://duelingnetwork.com:1236/`)
3. Upon establishing the connection, the user sends a JSON-formatted string to the socket. The following information is required:
 - `clientVersion`: integer describing the current client version
 - `username`: String from HTTP response body
 - `loginToken`: String from HTTP response body
 - `sessionId`: Randomly generated session ID as string
 - `adminMode`: `false` if user is not logging in as admin (or not able to), else an integer describing the current admin role (currently options are 1 through 4)
4. Socket will respond to this request with following JSON:
 - `success`: boolean indicating if the login was successful
 - `error`: Error message if `success` was false
 - `admin`: true admin status of a user, 0 for users, 1 for green admins, 2 for silver admins, 3 for gold admins and 4 for owner admin
 - `currentAdminRole`: integer describing what role the user is currently logged in as (0 for user, else integer as described for `admin`)
 - `maxChatMessageLength`: integer describing the maximum length of a chat message that the user is able to send (on-duty admins get increased upper limit)
 - `subjectToChatLocking`: boolean describing if the user is currently not able to send a message. `true` indicates that the user may not send a message (on-duty admins are exempt from chat locking)
 - `friends`: An array of strings with all friends the user had upon login time. This list includes offline friends
 - `onlineUsers`: Array of objects in following format:
  * `username`: String with the username (1 to 20 characters at the moment)
  * `currentAdminRole`: Integer as described above
5. Once the first login is established, the user may send messages and receive responses in a similar format. Request format for the user is again JSON-formatted:
 - `name`: String describing the command being issued
 - `data`: Data to be sent with the request. This varies per command so they won't be described here, but in general this property is another object.
6. Response format for these commands is as follows:
 - `success`: as described in 4.
 - `error`: as described in 4.
 - Additional data may be sent. Pending format.
7. Additionally, the server may send notifications to the client. These are in following format:
 - `isNotification`: `true` to clearly indicate that the message is not a response to another request
 - `name`: String describing the sent message
 - `message`: Additional message or data sent with the message
 
This document may be incomplete. I'll review it at a later date.