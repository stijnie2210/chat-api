# chat-api

## Methods

### [/api/auth](#)

Description: Obtain a token to use for the API

Method `POST`

Body:
```json
{
	"user": "user1",
	"password": "12345"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NGU2NzExYzAzYWQzMDAxMTZjNzJkYyIsIml"
}

```
---

### [/api/messages](#)

Description: Retrieve all messages

Method: `GET`

Response:
```json
[
    {
        "_id": "z91xZYL1IMYJ9HNh8ngn",
        "user": "user1",
        "message": "Hello World",
        "__v": 0
    },
    {
        "_id": "Ur8rirXgDLMLiTJelFSf",
        "user": "user2",
        "message": "Hi!",
        "__v": 0
    }
]

```


### [/api/messages](#)

Description: Send a message

Method: `POST`

Body: 
```json
{
	"name": "user1", 
	"message": "Test!" 
}
```

Response:
```json
{
    "__v": 0,
    "user": "user1",
    "message": "Test!",
    "_id": "QvNMcB56uVFIEzD9cImV"
}

```

---

### [/api/users/me](#)

Description: Get own user information

Method: `GET`

Response:
```json
{
    "_id": "uDfH1EFnglLHiPwupC17",
    "__v": 0,
    "local": {
        "group": "user",
        "password": "FTc4Olps81Xf2fzjo3WRLVsRsASaHvxSq6uX96EG",
        "name": "user1"
    }
}
```