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
        str += "<td>" + user.id + "</td>";
        str += "<td>" + user.first_name + "</td>";
        str += "<td>" + user.last_name + "</td>";
        str += "<td> <img src='" + user.avatar + "' height='42' width='42'/></td>";
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
