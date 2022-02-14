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

var user = document.getElementById('guest').textContent;
var api = '/antecare/api/reply';
var chatbot = {
	getReply: function(text) {
	    axios.post('/antecare/api/reply', {
	    	"username": user,
	    	"message": text,
	    })
	    .then(
	      response => {
	        let reply = response.data.reply.replace(/\n/g, "<br>");
	        // console.log(response)
	        if(reply !== ''){
		        this.postReply(reply);
	        }
	        else if(reply === ''){
	        	this.postReply();
	        }
	      },
	      reason => {
	        console.log(reason);
	      }
	    )
	    .catch(on_load_error);
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
		  // if (typeof onChatbotReply === "function") onChatbotReply();
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
  chatbot.getReply('start')
  // chatbot.start();
}

function on_load_error(err) {
  chatbot.postReply(
    "Ooh, there was an error loading this bot. Refresh the page please."
  );
  console.log("Loading error: " + err);
}
