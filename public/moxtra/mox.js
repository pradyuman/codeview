
function randStr(){
	var s = "gobears";
	var str = "";
	for(var i = 0; i<10; i++)
		str += s.charAt(Math.floor(s.length * Math.random()));
	return str;
}

var fb = new Firebase("https://codeview1.firebaseio.com/moxtra");

var client_id = "r0QI6GjJbaI";
var client_secret = "kRKfGYmyDR0";
var timestamp = new Date().getTime();
var unique_id = randStr();

var hash = CryptoJS.HmacSHA256(client_id + unique_id + timestamp, client_secret);
var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
var signature = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');


$(document).ready(function(){
    fb.on("value", function(data) {
        if(data.val() && data.val().key){
            console.log("fb key ", data.val().key);
            joinmox(data.val().key);
        }else{
            getToken();
            console.log("starting new mox");
        }
    });
});

function getToken() {
	var init_options = {
	    uniqueid: unique_id,
	    firstname: "Anonymous",
	    lastname: "Person (" + new Date().getTime()%100+ ")",
	    timestamp: timestamp,
	    signature: signature,
	    get_accesstoken: function(result) {
	        console.log("access_token " + result.access_token);
	        console.log("access_token: " + result.access_token + " expires in: " + result.expires_in);
	        startmox(result.access_token);
	    },
	    error: function(result) {
	        console.log("error code: " + result.error_code + " message: " + result.error_message);
	    }
	};
	Moxtra.setup(init_options);
}

function startmox(access_token) {
    var options = {
        iframe: true,
        extension: { "show_dialogs": { "meet_invite": true } },
        tagid4iframe: "container",
        iframewidth: (window.innerWidth-9)+"px",
        iframeheight: window.innerHeight+"px",
        access_token: access_token,
        start_meet: function(event) {
            //alert(event.session_key);
        	//$("#status").html("Key: " + event.session_key);
        	//console.log(event.session_key);

            fb.set({ key: event.session_key });
            //alert("session key: " + event.session_key + " session id: " + event.session_id + " binder id: " + event.binder_id);
        },
        error: function(event) {
            //alert("error code: " + event.error_code + " message: " + event.error_message);
        },
        end_meet: function(event) {
            //alert("Meet end event");
            fb.remove();
        }
    };
    Moxtra.meet(options);
}

function joinmox(sesskey) {
    //$("#container").html('');
    console.log("key ",sesskey);
    var options = {
        session_key: sesskey,
        user_name: "Anonymous",
        tagid4iframe: "container",
        iframewidth: (window.innerWidth-9)+"px",
        iframeheight: window.innerHeight+"px",
        iframe: true,
        extension: { "show_dialogs": { "meet_invite": true } },
        start_meet: function(event) {
            //alert("session key: " + event.session_key + " session id: " + event.session_id);
        },
        error: function(event) {
            //alert("error code: " + event.error_code + " message: " + event.error_message);    
            $("#container").html('');
            getToken();
        },
        end_meet: function(event) {
            //alert("Meet ended by host event");
        },
        exit_meet: function(event) {
            //alert("Meet exit event");
        }
    };
    Moxtra.joinMeet(options);
}