// 1. input form
// 2. patch post
// 3. on seccess(2nd .then):  update local storage
// 4. call fillUsers and avoid redundancy

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

    function fillUsers(users){
      $('#loading').remove();
      for (user of users) {
        console.log(user.id);
        let str = "<tr>";

        str += "<td>" + "<input class='radioButtons' type='radio' name='choose' value='" + user.id + "'>" + "</td>";


        str += "<td>" + user.id + "</td>";
        str += "<td>" + user.first_name + " " + user.last_name + "</td>";
        str += "<td> <img src='" + user.avatar + "'/></td>";
/*
        //not sure if it's right(good) to do this! for sepration of concearns
        str += "<p>"ok
        str += "<input type='radio' name='choose'>";
        str += "</p>"
*/
        // str += "<td>" + "mark " + user.last_name + "?" + "<input type='radio' name='choose'>" + "</td>";


        str += "</tr>";
        $("#user-list > tbody:last-child").append(str);
      }
    }





    function submit(){

      fetch('https://www.reqres.in/api/users')
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
    }
});



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
      // $('#user-list tbody tr td:first-child').css('visibility','hidden');
      $('.radioButtons').css('visibility','hidden');
    }

    function dealWithHints(){
      $('.beforeHint').show();
      $('.afterHint').hide();

      // const radioButton = $('#user-list tbody tr td:first-child');
      $('.radioButtons').click(function() {
        $('.beforeHint').hide();
        $('.afterHint').show();
      }); 
    } 

    function showTheRightForm(task){
      $('.hiddenForms').hide();
      $('#'+task).show();
    }

  }


/*  function edit(task){
    showRadioButton();
  }

  function remove(task){
    showRadioButton();
  }

  function suckIt() {
    console.log('Error: ' + response.statusText);

    var children = tableFields.children;
    for (var i = 0; i < children.length; i++) {
      var tableChild = children[i];
      // Do stuff
    }
  }
*/