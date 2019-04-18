// 1. input form
// 2. patch post
// 3. on success(on second ".then"):  update local storage
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

});

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

      const name = $("#memberName").val();
      const job = $("#memberJob").val();
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

    /*
          $("#user-list > tbody").html("");
          fillUsers(oldItems);
    */





          attachUser(newMember)
       }


    }
// End of under construction section.






  function editMember() {
    aaaa
  }


  function removeMember() {
    
    let oldItems = JSON.parse(localStorage.getItem('user-list')) || [];

    const selectedUser = document.querySelector('input[name="choose"]:checked');
    const selectedId = selectedUser.value;

    const removed = oldItems.find(obj => {
      return obj.id == selectedId
    })

    // actually dellete it! from "DOM"
///    $('#some_element').remove();
    $(selectedUser).parent().parent().remove();

    console.log(removed.id);
    console.log(removed);

    // actually dellete it! from "local Storage"
    // $('#some_element').remove();


    $('.afterHint').hide();
    $('#remove .messages').show();




   // localStorage.setItem('user-list', JSON.stringify(oldItems));

    /*
          $("#user-list > tbody").html("");
          fillUsers(oldItems);
    */

     // attachUser(newMember)
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

