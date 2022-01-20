var bot;
var user = document.getElementById('guest').textContent;
Audio.prototype.play = (function(play) {
  return function () {
    var audio = this,
        args = arguments,
        promise = play.apply(audio, args);
    if (promise !== undefined) {
      promise.catch(_ => {});
    }
  };
})(Audio.prototype.play);

var chatbot = {
  db: [],
  loadDB: function(link) {
    Tabletop.init({
      key: link,
      callback: data => {
        this.db = data["Sheet1"].elements;
        console.log("Your Database Rows Loaded: ", this.db.length);
      }
    });
  },
  getDB: function(link, sheetName) {
    return new Promise((resolve, reject) => {
      Tabletop.init({
        key: link,
        callback: data => {
          var sheetNames = Object.keys(data);
          var thisdb = [];
          if (sheetName)
            thisdb = data[sheetName] ? data[sheetName].elements : [];
          else
            thisdb = data[sheetNames[0]] ? data[sheetNames[0]].elements : [];
          console.log("Your Database Rows Loaded: ", thisdb.length);
          resolve(thisdb);
        }
      });
    });
  },
  dbFilter: function (db,col,val) {
    var filtered = db.filter(function(row) {
      var match = true;
      if (!Array.isArray(val)) val = [val];
      val.forEach(v=>{
        if (row[col].toLowerCase().indexOf(v.toLowerCase()) == -1)
        match = false;
      })
      return match; 
    });
    return filtered;
  },
  loadFiles: function(filenames) {
    bot = new RiveScript();
    bot.loadFile(filenames).then(on_load_success).catch(on_load_error);
  },
  getReply: function(text) {
    bot.reply(null, text).then(
      reply => {
        reply = reply.replace(/\n/g, "<br>");
        this.postReply(reply);
        console.log(reply)
      },
      reason => {
        console.log(reason);
      }
    );
  },
  postReply: function(reply, delay) {
    if (!delay) delay = 800;
    var rand = Math.round(Math.random() * 10000);
    setTimeout(function() {
      $("#dialogue").append(
        "<div style='margin-left:-10px; margin-bottom:-20px;' class='media media-chat normal' id='" +
          rand +
          "'><div class='media-body'><p>" +
          reply +
          "</p></div></div>"
      );

      if (typeof pop !== "undefined") pop.play();
      if (typeof onChatbotReply === "function") onChatbotReply();
      $("#" + rand)
        .hide()
        .fadeIn(200);
      $("#dialogue").animate(
        { scrollTop: $("#dialogue")[0].scrollHeight },
        200
      );
    }, delay);
  },
  sendMessage: function() {
    var text = $("#message").val();
    if (text.length === 0) return false;
    $("#message").val("");
    $("#dialogue").append(
      "<div style='margin-right:-10px; margin-bottom:-20px;' class='media media-chat media-chat-reverse'><div class='media-body'><p>" +
        this.escapeHtml(text) +
        "</p></div></div>"
    );
    $("#dialogue").animate({ scrollTop: $("#dialogue")[0].scrollHeight }, 200);
    this.getReply(text);
    console.log(`${user}:`, text)
    return false;
  },
  escapeHtml: function(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
};

function on_load_success() {
  $("#message").removeAttr("disabled");
  $("#message").attr("placeholder", "Message");
  $("#message").focus();
  bot.sortReplies();
  chatbot.getReply("start");
}

function on_load_error(err) {
  chatbot.postReply(
    "Ooh, there was an error loading this bot. Refresh the page please."
  );
  console.log("Loading error: " + err);
}