
$(document).ready(function() {
  // const disableLocalStorage = true;
  let users = localStorage.getItem('user-list');

  // if (disableLocalStorage || users === null) {
  if (users === null) {
    fetch('https://www.reqres.in/api/users?page=1')
      .then(function(response) {
          return response.json();
        })
      .then(function(response) {
          users = response.data;
          localStorage.setItem('user-list', JSON.stringify(users));
          fillUsers(users);
        })
      .catch(function(response) {
          $('.content').html('<div class="error">Error fetching data</div>');
          console.log('Error: ' + response.statusText);
        });
  } else {
      fillUsers(JSON.parse(users));
  }
});
// 1. input form
// 2. patch post
// 3. on success(on second ".then"):  update local storage
// 4. call fillUsers and avoid redundancy
/////////////////  end of  $(document).ready()  //////////////////

function fillUsers(users){
  $('#loading').remove();
  for (user of users) {
    // console.log(user.id);
    attachUser(user);
  }
}

function attachUser(user){
  let str = "<tr>";
  str += "<td> <input class='radioButtons' type='radio' name='choose' value='" + user.id + "'></td>";
  str += "<td>" + user.id + "</td>";
  str += "<td>" + user.first_name + " " + user.last_name + "</td>";
  str += "<td> <img src='" + user.avatar + "'/></td>";
  str += "</tr>";
  $("#user-list > tbody:last-child").append(str);
}


// under construction: 
function submitMember(){

  url = 'https://www.reqres.in/api/users';

  const name = $("#add .memberName").val();
  const job = $("#add .memberJob").val();
    console.log(job);
    console.log(name);

  newMember = {
    "name": name,
    "job": job
  }

  options = {
    method: 'POST',  
    headers: {},  
    body: JSON.stringify(newMember)
  }

/*
  fetch(url, options)
  .then(function (data) {  
    console.log('Request success: ', data);
  })
  .then(function (data) {  
    console.log('Great!');
  }) 
  .catch(function (error) {  
    console.log('Request failure: ', error);  
  });
*/

  //on success:
  addNewMember();

  function addNewMember(){
    if (localStorage.membercount) {
      localStorage.membercount = Number(localStorage.membercount)+1;
    } else {
      localStorage.membercount = 100;
    }

    newMember.id = Number(localStorage.membercount);
    newMember.first_name = newMember.name;
    newMember.last_name = "";
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    newMember.avatar = "avatars/" + randomNumber + ".png";

      let oldItems = JSON.parse(localStorage.getItem('user-list')) || [];
      oldItems.push(newMember);

      localStorage.setItem('user-list', JSON.stringify(oldItems));

/*    $("#user-list > tbody").html("");
      fillUsers(oldItems);      */
      attachUser(newMember)
   }
}


function editMember() {

  let oldItems = JSON.parse(localStorage.getItem('user-list')) || [];

  const selectedUser = document.querySelector('input[name="choose"]:checked');
  const selectedId = selectedUser.value;

  //Find index of specific object
  objIndex = oldItems.findIndex((obj => obj.id == selectedId));

  //Log object to Console.
  console.log("Before update: ", oldItems [objIndex]);

  //Update object's name property.
  const name = $("#edit .memberName").val();
  const job = $("#edit .memberJob").val();
  oldItems[objIndex].first_name = name;
  oldItems[objIndex].job = job;
  
  //Log object to console again.
  console.log("After update: ", oldItems[objIndex])
  console.log("old: ", oldItems)

  /////////////////////////////////////
  // edit it for "local Storage"
  localStorage.setItem('user-list', JSON.stringify(oldItems));

  // edit it for "DOM"
  /*
  let xxx = $(selectedUser).parent().parent();
  $(selectedUser).parent().css('visibility','visible');
  // xxx.css('visibility','visible');
  // xxx.css('background-color','red');
  $('xxx td:nth-child(1)').css('background-color','blue');
  $('xxx:even').css('background-color','pink');
  // $(`((document.querySelector('input[name="choose"]:checked')).parent()):nth-child(2)`).css('background-color','red');
  $('table > tbody > tr td:nth-child(2)').children().css("background-color","pink");
  /// let tr = $(selectedUser).parent().parent();
  /// (tr:nth-child(3)).remove();
  // $("#user-list > tbody:last-child").append(str);
  */
  // $('.afterHint').hide();
  // $('#remove .messages').show();
}


function removeMember() {
    
  let oldItems = JSON.parse(localStorage.getItem('user-list')) || [];

  const selectedUser = document.querySelector('input[name="choose"]:checked');
  const selectedId = selectedUser.value;

  const removed = oldItems.find(obj => {
    return obj.id == selectedId
  })

  // dellete it from "local Storage"
  const newItems = $.grep(oldItems, function(e){ 
    return e.id != selectedId; 
  });
  localStorage.setItem('user-list', JSON.stringify(newItems));

  // dellete it from "DOM"
  $(selectedUser).parent().parent().remove();

  $('.afterHint').hide();
  $('#remove .messages').show();
}

function selectBtn(task){
  dealWithRadioButtons(task);
  dealWithHints();
  showTheRightForm(task);

  function dealWithRadioButtons(task){
    //uncheck all:
    $(".radioButtons").prop("checked", false);

    if(task == 'add'){
      hideRadioButton();
    }
    else if(task == 'edit') {
      showRadioButton();
    }
    else if(task == 'remove') {
      showRadioButton();
    }
  }

  function showRadioButton(){
    $('.radioButtons').css('visibility','visible');
  }
    
  function hideRadioButton(){
    $('.radioButtons').css('visibility','hidden');
    // or: $('#user-list tbody tr td:first-child').css('visibility','hidden');
  }

  function dealWithHints(){
    $('.beforeHint').show();
    $('.afterHint').hide();

    $('.radioButtons').click(function() {
      $('.beforeHint').hide();
      const selectedId = document.querySelector('input[name="choose"]:checked').value;  //redundancy
      $('.afterHint span').html(selectedId);
      $('.afterHint').show();
    }); 
  } 

  function showTheRightForm(task){
    $('.hiddenForms').hide();
    $('.messages').hide();
    $('#'+task).show();
  }

}

