# Score Counter

## Demo

- https://snapszer-score-counter.web.app/

## Development

- Create a [Firebase](https://firebase.google.com/) project, enable _Email/Password_ sign-in provider, create a _Cloud Firestore_ database.

- Create a **.env** file in the root directory based on _.env.example_ file.

- Run the following commands in the root directory to start in development mode:
  - `npm install`
  - `npm start`

## Secure data

The following rule can be used to secure data in the database:

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
    	match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```
