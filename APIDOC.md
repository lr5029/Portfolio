# Node API Documentation
The Node API provides record of users' input and to be able to interact with users themselves with
greeting or feedback received message

**Endpoint:** http://localhost:8000

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
  - If missing in query parameter year, returns an error with the message: `Error: Missing required year query parameters.`

## Suggestion of the page
**Request Format:** /portfolio/feedback endpoint with POST parameters of `background`, `content`, `layout`, `suggestion` and `idea`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a `suggestion` about the page and optional comment on `background`, `content`, `layout`, `idea` to send, the Node will reply with response in json format.

**Example Request:** /portfolio/feedback with POST parameters of `suggestion=Smaller font size`

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
- N/A
