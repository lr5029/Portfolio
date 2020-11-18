/**
 * Ran Liao
 * 11/17/2020
 * AF Wilson Tang
 *
 * This is the index.js file to implement the UI for my index.html file only,
 * and generate different types of ciphers from user input including opening a mystery box,
 * adding list items to a list, crossing out list items if desired, diaplaying specified
 * numbers of jokes from ICNb website, display greeting and feedback message with client's
 * specified values.
 */
"use strict";

(function() {

  // MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED HERE
  const BASE_URL = "https://api.icndb.com/jokes/random";
  const APP_URL = "http://localhost:8000/portfolio/";

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * Add a function that will be called when the add button is clicked to updating a list,
   * a function that will be called when the list item is clicked to make it a strickthrough text,
   * a function that will be called when the specific picture is clicked to change it to
   * corresponding image with its image source and description, a function will be called
   * when the get button is clicked to get jokes from Chuck Norris API, a function will be
   * called when get button is clicked to greet user to the website, and a function that will
   * be called when enter button is clicked to display the message that feedback is received.
   */
  function init() {
    // THIS IS THE CODE THAT WILL BE EXECUTED ONCE THE WEBPAGE LOADS
    qs("#intro button").addEventListener("click", welcome);

    id("input-form").addEventListener("submit", function(event) {
      event.preventDefault();
      submitRequest();
    });

    qs("#joke button").addEventListener("click", makeRequest);

    qs("#todo button").addEventListener("click", planAdd);

    let list = qsa("#plan li");
    for (let i = 0; i < list.length; i++) {
      if (!list[i].classList.contains("finished")) {
        list[i].addEventListener("click", finishList);
      }
    }

    mysterBox();
  }

  /**
   * Used to change corresponding image with its image source and description
   * when the specific picture is clicked.
   */
  function mysterBox() {
    id("box1").addEventListener("click", function() {
      // I got the image of mysterbox from https://phys.org/news/2020-04-video-wolves-night.html
      unveil.call(this, "img/wolf.jpg", "A Wolf!");
    });
    id("box2").addEventListener("click", function() {
      // I got the image of mysterbox from https://www.theguardian.com/lifeandstyle/2020/jun/08/in-18-months-weve-had-30-cats-and-its-been-wonderful
      unveil.call(this, "img/cat.jpg", "A Cat");
    });
    id("box3").addEventListener("click", function() {
      // I got the image of mysterbox from https://www.travelandleisure.com/animals/most-popular-dog-names-2019
      unveil.call(this, "img/dog.jpg", "A Dog");
    });
    id("box4").addEventListener("click", function() {
      unveil.call(this, "img/hotpot.jpg", "Chinese Hotpot");
    });
    id("box5").addEventListener("click", function() {
      unveil.call(this, "img/seafood.jpg", "Oysters");
    });
    id("box6").addEventListener("click", function() {
      unveil.call(this, "img/sushi.jpg", "Some Sushi");
    });
  }

  /**
   * Send form data to the Node server. Note that this function is called only
   * after all HTML5 validation constraints (e.g. required attributes) have passed.
   */
  function submitRequest() {
    qs("#feedback button").disabled = true;
    let result = gen("p");
    result.id = "results";
    id("feedback").appendChild(result);

    let url = APP_URL + "feedback";
    let params = new FormData(id("input-form"));

    fetch(url, {method: "POST", body: params})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(showResponse)
      .catch(handleResError);
  }

  /**
   * reassure that the feedback is received from the feedback section and display
   * user's overall suggestion here.
   * @param {Object} resp - the response requested from the API in the form of
   * JavaScript object.
   */
  function showResponse(resp) {
    id("results").textContent =
      "Received feedback from " + id("fname").value + " : " + resp.Suggestion;
    qs("#feedback button").disabled = false;
  }

  /**
   * Used to start the ajax fetch call to Node server once the "get" button is clicked.
   * Upon success, say hello to user with the name and favourite year they provide.
   */
  function welcome() {
    qs("#intro button").disabled = true;
    let name = id("fname").value;
    let year = id("year").value;
    let sentence = gen("h3");
    id("welcome").innerHTML = "";
    id("welcome").appendChild(sentence);
    let url = APP_URL + "welcome/" + name + "?year=" + year;
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.text())
      .then(updateIntro)
      .catch(handleError);
  }

  /**
   * Used to process the data to dispaly the welcome sentence on the page with user's name and
   * favourite year.
   * @param {string} resp - the response requested from the API in the form of plain text.
   */
  function updateIntro(resp) {
    qs("#welcome h3").textContent = resp;
    qs("#intro button").disabled = false;
  }

  /**
   * Used to start the ajax fetch call to ICNDb API once the "get" button is clicked.
   * Upon success, shows the user's specified number of jokes on the page.
   */
  function makeRequest() {
    qs("#joke h4").textContent = "Response Loading ...";
    id("response").innerHTML = "";
    qs("#joke button").disabled = true;
    let number = qs("#joke input").value;

    let url = BASE_URL + "/" + number;
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleRequestError);
  }

  /**
   * Used to process the data to dispaly the jokes on the page.
   * @param {Object} responseData - the response requested from the API in the form of
   * JavaScript object.
   */
  function processData(responseData) {
    qs("#joke h4").textContent = "Joke(s):";

    for (let i = 0; i < responseData.value.length; i++) {
      let block = gen("section");
      let title = gen("h4");
      let content = gen("p");

      title.textContent = "Joke" + responseData.value[i].id;
      content.textContent = responseData.value[i].joke;

      block.appendChild(title);
      block.appendChild(content);
      id("response").appendChild(block);
    }

    // re-enable button
    qs("#joke button").disabled = false;
  }

  /**
   * Keeping track of the client's input, add it to the To Do List,
   * clear the input tracked to make the input box available and focused for typing.
   */
  function planAdd() {
    let input = qs("#todo input");
    let li = gen("li");
    li.textContent = input.value;
    qs("#todo ul").appendChild(li);
    input.value = "";
    li.addEventListener("click", finishList);
    input.focus();
  }

  /**
   * Make the current target to be crossed out with a line (strikethrough) with a color of gray.
   */
  function finishList() {
    this.classList.add("finished");
  }

  /**
   * Turn the client's target picture to the corresponding image with specified image
   * source and description.
   * @param {string} path - image source/path
   * @param {string} description - image description
   */
  function unveil(path, description) {
    this.src = path;
    this.alt = description;
  }

  /**
   * This function is called when an error occurs in the fetch call chain (e.g. the request
   * returns a non-200 error code, such as when the ICNDb service is down). Displays a user-friendly
   * error message on the page and re-enables teh ICNDb button.
   * @param {Error} err - the err details of the request.
   */
  function handleRequestError(err) {
    let response = gen("p");
    let msg = "There was an error requesting data from the ICNDb service: " +
              err.message;
    response.textContent = msg;
    id("response").appendChild(response);
    qs("#joke h4").textContent = "Error";
    qs("#joke button").disabled = false;
  }

  /**
   * This function is called when an error occurs in the fetch call chain to Node API in intro
   * section. Displays a user-friendly error message on the page and re-enables the button.
   * @param {Error} err - the err details of the request.
   */
  function handleError(err) {
    qs("#welcome h3").textContent = err.message;
    qs("#intro button").disabled = false;
  }

  /**
   * This function is called when an error occurs in the fetch call chain to Node API in feedback.
   * section. Displays a user-friendly error message on the page and re-enables the button.
   * @param {Error} err - the err details of the request.
   */
  function handleResError(err) {
    id("results").textContent = "There was an error requesting data from the Node service: " +
      err.message;
    qs("#feedback button").disabled = false;
  }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns the response from the URL specified if no error, or error message
   * otherwise
   * @param {Response} res - the response returned from the API
   * @returns {Error} the error detail of the response if something went wrong
   * @returns {Response} the response from the API if the status is ok
   */
  async function checkStatus(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

})();