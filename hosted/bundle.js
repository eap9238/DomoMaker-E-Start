Skip to content
 
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 @eap9238 Sign out
1
0 0 NickFederico15/Domomaker-E
 Code  Issues 0  Pull requests 0  Projects 0  Wiki  Insights
Domomaker-E/hosted/bundle.js
f5e99b0  a day ago
@NickFederico15 NickFederico15 Completed Domomaker E
     
168 lines (148 sloc)  4.57 KB
"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer($("token").val());
  });

  return false;
};

var handleDelete = function handleDelete(e) {
  e.preventDefault();
  $("#domoMessage").animate({ width: 'hide' }, 350);
  sendAjax('DELETE', $("#deleteDomo").attr("action"), $("#deleteDomo").serialize(), function () {
    loadDomosFromServer($("token").val());
  });
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    "form",
    { id: "domoForm",
      onSubmit: handleDomo,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
    React.createElement(
      "label",
      { htmlFor: "level" },
      "Level:"
    ),
    React.createElement("input", { id: "domoLevel", type: "text", name: "level", placeholder: "Domo Level" }),
    React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No Domos yet"
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      "div",
      { key: domo._id, className: "domo" },
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
      React.createElement(
        "h3",
        { className: "domoName" },
        "Name: ",
        domo.name
      ),
      React.createElement(
        "h3",
        { className: "domoAge" },
        "Age: ",
        domo.age
      ),
      React.createElement(
        "h3",
        { className: "domoLevel" },
        "Level: ",
        domo.level
      ),
      React.createElement(
        "form",
        { id: "deleteDomo",
            onSubmit: handleDelete,
            name: "deleteDomo",
            action: "/deleteDomo",
            method: "DELETE"
        },
        React.createElement("input", { type: "hidden", name: "_id", value: domo._id }),
        React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoDelete", type: "submit", value: "Delete" })
      )
    );
  });

  return React.createElement(
    "div",
    { className: "domoList" },
    domoNodes
  );
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: csrf }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector("#domos"));

  loadDomosFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
© 2018 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
Press h to open a hovercard with more details.