function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}


function check_active(){
  var current = document.getElementsByClassName("active");
  if (current.length == 0) {
    return null;
  }else{
    return current[0];
  }
}


function remove_active(){
  var current = document.getElementsByClassName("active");
  if (current.length != 0) {
    current[0].className = current[0].className.replace(" active", "");
  }
}


function get_edit_url(current){
  return current.getElementsByClassName("bnt_edit_container")[0].getElementsByTagName('a')[0].href;
}

function get_delete_url(current){
  var ediurl = current.getElementsByClassName("bnt_edit_container")[0].getElementsByTagName('a')[0].href;
  return ediurl.replace("edit", "remove")
}

function get_detail_url(current){
  var ediurl = current.getElementsByClassName("bnt_edit_container")[0].getElementsByTagName('a')[0].href;
  return ediurl.replace("/edit", "")
}

function scroll(up=true){
  p_list = document.getElementsByClassName("dairy-p");
  let index = 0
  for (; index < p_list.length; index++) {
    var tmp_classname = p_list[index].className;
    if (/active/.test(tmp_classname)){
      break;
    }
  }
  // up or down
  if (up) {
    to_index = index - 1;
  } else {
    to_index = index + 1;
  }
  // out of index range?
  if (to_index < p_list.length && to_index >= 0){
    remove_active();
    p_list[to_index].className += " active";
    // smoothly scroll with an offset
    const element = p_list[to_index];
    const offset = 300;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}


function listen_dairy_p_click(){
  var p_list = document.getElementsByClassName("dairy-p")
  for (var i = 0; i < p_list.length; i++) {
    p_list[i].addEventListener("click", function() {
      remove_active();
      this.className += " active";
    });
  }
  p_list[0].className += " active";
}


function change_theme(theme){
  // init
  var current_theme = window.localStorage.getItem("theme");
  // update
  document.body.className = theme;
  window.localStorage.setItem("theme", theme);
  console.log(theme);
  document.getElementById('bnt-'+current_theme).style.color = "black";
  document.getElementById('bnt-'+theme).style.color = "#e400ff";
}


function load_theme(){
  var theme = window.localStorage && window.localStorage.getItem("theme");
  if (theme !== null){
    document.body.className = theme;
    document.getElementById('bnt-'+theme).style.color = "#e400ff";
  }else{
    window.localStorage.setItem("theme", "theme-d1");
    document.getElementById('bnt-theme-d1').style.color = "#e400ff";
  }
}


function load_lasttag(){
  var is_create_page = document.querySelector('input[name="tag"]:checked') === null;
  var lasttag = window.localStorage && window.localStorage.getItem("lasttag")  || "others";
  if (is_create_page){
    select_tag(lasttag);
  }
}

function select_tag(tag){
  var tags = document.getElementsByName('tag');
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].value == tag) {
      tags[i].checked = true;
      break;
    }
  }
}

function save_lasttag(){
  var lasttag = document.querySelector('input[name="tag"]:checked')
  if (lasttag) {
    window.localStorage.setItem("lasttag", lasttag.value);
  }
}

function toggle_theme(){
  var theme = window.localStorage && window.localStorage.getItem("theme");
  isdark = /theme-d/.test(theme)

  if (isdark){
    change_theme("theme-l2");
  }else{
    change_theme("theme-d2");
  }
}

function show_dropdown(){
  var dropdown = document.getElementById("dropdown_content");
  dropdown.style.display = "block";
}
function hide_dropdown(){
  var dropdown = document.getElementById("dropdown_content");
  dropdown.style.display = "none";
}

load_theme()

document.onkeyup = function(e) {
  // char key code: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
  var os = getOS()
  console.log("OS:", os);

  // mac shortcut using Ctrl, other operating system using Alt
  if (os == 'Mac'){
    if (e.ctrlKey && e.which == 78) {
        // Ctrl + N
        window.location.href = "/note/create";
      } else if (e.altKey && e.which == 78) {
        // Alt + N
        window.open("/note/create");
      } else if (e.ctrlKey && e.which == 72) {
        // Ctrl + H
        window.location.href = "/notes";
      } else if (e.ctrlKey && e.which == 65) {
        // Ctrl + A
        window.location.href = "/notes/all";
      } else if (e.ctrlKey && e.which == 67) {
        // Ctrl + C
        window.location.href = "/notes/archive";
      }
  }else{
    if (e.altKey && e.which == 78) {
        // Alt + N
        window.location.href = "/note/create";
      } else if (e.altKey && e.which == 72) {
        // Alt + H
        window.location.href = "/notes";
      } else if (e.altKey && e.which == 65) {
        // Alt + A
        window.location.href = "/notes/all";
      } else if (e.altKey && e.which == 67) {
        // Alt + C
        window.location.href = "/notes/archive";
      }
  }
  // active dairy-p
  if (e.which == 27) {
    // ESC
    remove_active();
  } else if (e.which == 38) {
    // Arrow-up
    current = check_active();
    var isNotes = window.location.href.match('notes') || window.location.href.match('(?!.*edit)note\/[^\/]+[^\/]');
    if (current != null && isNotes){
      scroll(up=true);
    }
  } else if (e.which == 40) {
    // Arrow-down
    current = check_active();
    var isNotes = window.location.href.match('notes') || window.location.href.match('(?!.*edit)note\/[^\/]+[^\/]');
    if (current != null && isNotes){
      scroll(up=false);
    }
  } else if (e.which == 69) {
    // E -> Edit
    current = check_active();
    var isNotes = window.location.href.match('notes') || window.location.href.match('(?!.*edit)note\/[^\/]+[^\/]');
    if (current != null && isNotes){
      let url = get_edit_url(current);
      window.location.href = url;
    }
  }
  else if (e.which == 68) {
    // D -> Delete
    current = check_active();
    var isNotes = window.location.href.match('notes') || window.location.href.match('(?!.*edit)note\/[^\/]+[^\/]');
    if (current != null && isNotes){
      var result = confirm("Confirm to delete this?");
      if (result) {
        let url = get_delete_url(current);
        window.location.href = url;
      }
    }
  }
  else if (e.which == 13) {
    // Enter -> Detail
    current = check_active();
    var isNotes = window.location.href.match('notes') || window.location.href.match('(?!.*edit)note\/[^\/]+[^\/]');
    if (current != null && isNotes){
      let url = get_detail_url(current);
      window.location.href = url;
    }
  }

};

window.onload = function(){
  listen_dairy_p_click();
};
