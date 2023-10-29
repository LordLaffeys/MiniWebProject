// initial global variable
var loginStatus = sessionStorage.getItem("status");
var currUser = sessionStorage.getItem("userId");
var currName = sessionStorage.getItem("userName");


// register
$("#register-form button").click(function (e) { 
    e.preventDefault();
    var name = document.querySelector('#rname').value;
    var email = document.querySelector('#remail').value;
    var password = document.querySelector('#rpsw').value;
    var repeatPassword = document.querySelector('#repeatpsw').value;

    var repeatPswInput = document.querySelector('#repeatpsw');
    var pswInput = document.querySelector('#rpsw')
    var emailInput = document.querySelector('#remail');
    var checkboxInput = document.querySelector('input[name="terms"]');

    emailInput.setCustomValidity("");
    pswInput.setCustomValidity("");
    repeatPswInput.setCustomValidity("");
    checkboxInput.setCustomValidity("");

    if (!emailInput.checkValidity()) {
        emailInput.setCustomValidity("Use valid email format!");
        emailInput.reportValidity();
    } else if (!pswInput.checkValidity()) {
        pswInput.setCustomValidity("Password atleast 8 characters contains one Uppercase, number, and symbol!");
        pswInput.reportValidity();
    } else if (password !== repeatPassword) {  
        repeatPswInput.setCustomValidity("Passwords do not match. Please ensure that the passwords match.!");
        repeatPswInput.reportValidity();
    } else if (!checkboxInput.checkValidity()) {
        checkboxInput.setCustomValidity("You must agree to the terms and conditions!");
        checkboxInput.reportValidity();
    }
    else {
        console.log("LOGIN");
    } 

    if (repeatPswInput.checkValidity() && emailInput.checkValidity() && checkboxInput.checkValidity()) {
        // The form is valid; you can proceed with the submission
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://localhost:7224/api/User/register", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    alert("You are registered!");
                    window.location.href = "login.html";
                } else {
                    // Handle registration failure here
                    alert("Registration failed. Please try again.");
                }
            }
        };

        var data = JSON.stringify({
            name: name,
            email: email,
            password: password
        });

        xhr.send(data);
    }
});

// login 
$("#login-form").submit(function (e) { 

    e.preventDefault();

    var email = document.getElementById('lemail').value;
    var password  = document.getElementById('lpsw').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://localhost:7224/api/User/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.response !== null) {
            console.log(xhr.responseText);
            var UserInfo = JSON.parse(xhr.response);
            sessionStorage.setItem("userId", UserInfo.userId);
            sessionStorage.setItem("userName", UserInfo.name);
            sessionStorage.setItem("status", true);

            window.location.href = "dashboard.html";
        } else {
            alert("login failed check your email or password!");
        }
    };

    var data = JSON.stringify({
        email: email,
        password: password
    });

    xhr.send(data);
});

// add category

$("#add-category-form").submit(function (e) { 

    e.preventDefault();

    var user_id = currUser;
    var categoryName = document.getElementById('category').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://localhost:7224/api/User/add_category', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                alert("category added");
                window.location.reload();
            }
            else {
                alert("Adding Failed, Category may already Exist!");
            }
            
        }
    };

    var data = JSON.stringify({
        userId: user_id,
        categoryName: categoryName
    });

    xhr.send(data);
});

// get data categories

var currCategory; // global for edit & delete

if (loginStatus === "true") {
    // Replace 'your-guid-here' with the actual GUID for the current user
    // Replace with the actual GUID

    fetch(`https://localhost:7224/api/User/get_categories?userId=${currUser}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(data => {
        const table = document.querySelector(".category-table table");
        const tbody = table.querySelector("tbody") || document.createElement("tbody");

        tbody.innerHTML = '';

        data.forEach((category, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${index + 1}</td>
            <td class="old-category">${category.categoryName}</td>
            <td>
                <button class="edit-button">Edit</button> <button class="delete-button">Delete</button>
            </td>
            `;

            tbody.appendChild(row);
        });

        if (!table.querySelector('tbody')) {
            table.appendChild(tbody);
        }

        // Add event listeners for the "Edit" and "Delete" buttons
        tbody.querySelectorAll('.edit-button').forEach((editButton, index) => {
            editButton.addEventListener('click', () => {
                currCategory = data[index].categoryName;
                $("#id4").css("display", "block");
                console.log(currCategory);
            });
        });

        tbody.querySelectorAll('.delete-button').forEach((deleteButton, index) => {
            deleteButton.addEventListener('click', () => {
                currCategory = data[index].categoryName;
                $("#id5").css("display", "block");
                console.log(currCategory);
            });
        });
    })
    .catch(error => console.log('Error:', error));
}


// edit data categories
$("#edit-category-form").submit(function (e) { 

    e.preventDefault();

    var new_category = document.getElementById('category2').value;

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://localhost:7224/api/User/edit_category", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                alert("Edit success!");
                window.location.reload();
            }
            else {
                alert("Edit failed!");
            }
            
        }
    };  
    
    var data = JSON.stringify({
        userId: currUser,
        oldCategory: currCategory,
        newCategory: new_category
    })

    xhr.send(data);
    
});


// delete data categories

$("#delete-category-form").submit(function (e) { 

    e.preventDefault();

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "https://localhost:7224/api/User/delete_category", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                alert("Delete success!");
                window.location.reload();
            }
            else {
                alert("Delete failed");
            }
        }
    };
    
    var data = JSON.stringify({
        userId: currUser,
        categoryName: currCategory
    })

    xhr.send(data);
    
});

// css logic

if(loginStatus === "true") {
    $("#nav-logreg").hide();
    $(".navbar-phone .logreg-phone").hide();
    $(".dropdown").show();
    
    $("#dashboard").removeClass("modal");
    $(".dropbtn").html(currName + " " + '<span>&#x25BC;</span>');
}
else{
    $("#phone-logout").hide();
    $('.nav-item1 a.item[href="category.html"]').attr('href', 'login.html');
    $('.navbar-phone a[href="category.html"]').attr('href', 'login.html');
}

$(".hamburger-menu").click(function (e) {
    console.log(e.target);
    $(".navbar-phone").slideToggle();
    
});

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

$(window).resize(function() {
if ($(window).width() > 600) {
    // If window width is less than 600px, slide up
    $('.navbar-phone').slideUp();
} 
});

$(".add-button").click(function (e) { 
    console.log("test");
    $("#id3").css("display", "block");
});

$("#myDropdown, #phone-logout").click(function (e) { 
    e.preventDefault();

    sessionStorage.setItem("userId", "");
    sessionStorage.setItem("status", false);
    window.location.href = "login.html";
});

window.onclick = function(e) {
    console.log(e.target.id);

    if(e.target.classList.contains("modal")) {
        e.target.style = "none";
    }
}




