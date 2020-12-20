# Node API Documentation
The Node API provides record of users' input and to be able to interact with users themselves with greeting or feedback received message


## Get a welcome message
**Request Format:** /portfolio/welcome/:first?year={number}

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** display a greeting message of provided name and year

**Example Request:** /portfolio/welcome/laulau?year=2018

**Example Response:**
```
Welcome to My Page, laulau from 2018!
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If missing a query parameter year, returns an error with the message: `Error: Missing required year query parameters.`

## Suggestion of the page
**Request Format:** /portfolio/feedback endpoint with POST parameters of `background`, `content`, `layout`, `suggestion`, `idea` and `name` 

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a `suggestion` about the page and optional comment on `background`, `content`, `layout`, `idea` to send, the Node will reply with response in json format.

**Example Request:** /portfolio/feedback with POST parameters of `suggestion=Smaller font size` and `name=Ran`

**Example Response:**
```json
{
    "Background": "",
    "Content": "",
    "Layout/Color": "",
    "Suggestion": "Smaller font size",
    "More Ideas": ""
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (JSON):
  - If any of the reuiqred parameters is not set, returns an error with the message:
  ```json
  {
    "error": "Missing required parameters"
  }
  ```

- Possible 500 (Internal Server) errors (JSON):
  - If something went wrong with interaction of database, returns an error with the message:
  ```json
  {
    "error": "An error occurred on the server. Try again later."
  }
  ```
