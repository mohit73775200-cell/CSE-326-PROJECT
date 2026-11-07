// script.js - Driving Test Slot Management System
// this one file is used by all the pages (register, login, book slot,
// reschedule and cancellation). data is saved in localStorage,
// so it works without any server.

// demo user is added automatically when the page runs first time
// email: demo@gmail.com , password: demo123 , registration id: REG1001

function getUsers() {
    var users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.length == 0) {
        users.push({
            fullname: "Demo User",
            email: "demo@gmail.com",
            mobile: "9999999999",
            dob: "",
            vehicle: "four-wheeler",
            address: "",
            password: "demo123",
            regId: "REG1001"
        });
        localStorage.setItem("users", JSON.stringify(users));
    }
    return users;
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

function saveBookings(bookings) {
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

// small function to get value of any input box
function val(id) {
    return document.getElementById(id).value.trim();
}

// todays date in yyyy-mm-dd format, same format which date input gives
function todayDate() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return d.getFullYear() + "-" + month + "-" + day;
}


// ----------------- register page -----------------

function registerUser(e) {
    e.preventDefault();

    var name = val("fullname");
    var email = val("email").toLowerCase();
    var mobile = val("mobile");
    var dob = val("dob");
    var vehicle = val("vehicle");
    var address = val("address");
    var pass = val("password");
    var confirmPass = val("confirm-password");

    if (pass != confirmPass) {
        alert("Passwords do not match. Please type the same password in both boxes.");
        return;
    }

    var users = getUsers();

    // checking if email is already used
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == email) {
            alert("This email is already registered. Please login.");
            window.location.href = "login.html";
            return;
        }
    }

    // making a registration id for the user, it is needed at the time of booking
    var regId = "REG" + Date.now().toString().slice(-6);

    users.push({
        fullname: name,
        email: email,
        mobile: mobile,
        dob: dob,
        vehicle: vehicle,
        address: address,
        password: pass,
        regId: regId
    });
    saveUsers(users);

    alert("Registration Successful!\nYour Registration ID is: " + regId + "\nNote this ID - you need it on the Book Slot page.");
    window.location.href = "login.html";
}


// ----------------- login page -----------------

function loginUser(e) {
    e.preventDefault();

    var email = val("email").toLowerCase();
    var pass = val("password");

    var users = getUsers();
    var loggedUser = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].email == email && users[i].password == pass) {
            loggedUser = users[i];
            break;
        }
    }

    if (loggedUser == null) {
        alert("Invalid email or password. Please try again.");
        return;
    }

    localStorage.setItem("currentUser", loggedUser.email);

    // remember me checkbox
    if (document.getElementById("remember").checked) {
        localStorage.setItem("savedEmail", loggedUser.email);
    } else {
        localStorage.removeItem("savedEmail");
    }

    alert("Login Successful! Welcome, " + loggedUser.fullname);
    window.location.href = "bookslot.html";
}


// ----------------- book slot page -----------------

function bookSlot(e) {
    e.preventDefault();

    var name = val("fullname");
    var email = val("email").toLowerCase();
    var regId = val("bookingid");   // in bookslot page this box is for registration id
    var vehicle = val("vehicle");
    var date = val("testdate");
    var time = val("timeslot");
    var centre = val("centre");

    if (date < todayDate()) {
        alert("Please select a future date for your test.");
        return;
    }

    // email and registration id should match with a registered user
    var users = getUsers();
    var userFound = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == email && users[i].regId == regId) {
            userFound = true;
            break;
        }
    }
    if (!userFound) {
        alert("Email or Registration ID is wrong. Please register first and use the same Registration ID given at registration.");
        return;
    }

    var bookings = getBookings();

    // one user can have only one booking at a time
    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].bookingid == regId && bookings[i].status == "Confirmed") {
            alert("You already have a booking. Please use the Reschedule or Cancellation page.");
            return;
        }
    }

    // checking if this slot is free or already taken by someone else
    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].status == "Confirmed" && bookings[i].centre == centre &&
            bookings[i].testdate == date && bookings[i].timeslot == time) {
            alert("Sorry, this time slot is already booked at this centre. Please select another time or centre.");
            return;
        }
    }

    bookings.push({
        bookingid: regId,
        fullname: name,
        email: email,
        vehicle: vehicle,
        testdate: date,
        timeslot: time,
        centre: centre,
        status: "Confirmed"
    });
    saveBookings(bookings);

    alert("Slot Booked Successfully!\nRegistration ID: " + regId + "\nDate: " + date + "\nTime: " + time + "\nStatus: Confirmed");
    e.target.reset();
}


// ----------------- reschedule page -----------------

function rescheduleSlot(e) {
    e.preventDefault();

    var email = val("email").toLowerCase();
    var regId = val("bookingid");
    var curDate = val("currentdate");
    var curTime = val("currenttime");
    var newDate = val("newdate");
    var newTime = val("newtime");
    var reason = val("reason");

    var bookings = getBookings();
    var myBooking = null;

    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].bookingid == regId && bookings[i].email == email && bookings[i].status == "Confirmed") {
            myBooking = bookings[i];
            break;
        }
    }

    if (myBooking == null) {
        alert("Booking not found. Please check your Booking ID and email.");
        return;
    }

    // the current date and time typed by user must match his booking
    if (myBooking.testdate != curDate || myBooking.timeslot != curTime) {
        alert("Current date or time does not match your booking. Please enter the booked date and time.");
        return;
    }

    if (newDate < todayDate()) {
        alert("Please select a future date for the new slot.");
        return;
    }

    if (newDate == curDate && newTime == curTime) {
        alert("New date and time are the same as your current booking. Please select a different slot.");
        return;
    }

    // new slot should not be taken by any other booking
    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i] != myBooking && bookings[i].status == "Confirmed" &&
            bookings[i].centre == myBooking.centre &&
            bookings[i].testdate == newDate && bookings[i].timeslot == newTime) {
            alert("Sorry, the new time slot is already booked. Please select another time.");
            return;
        }
    }

    myBooking.testdate = newDate;
    myBooking.timeslot = newTime;
    myBooking.reason = reason;
    saveBookings(bookings);

    alert("Slot Rescheduled Successfully!\nNew Date: " + newDate + "\nNew Time: " + newTime);
    e.target.reset();
}


// ----------------- cancellation page -----------------

function cancelSlot(e) {
    e.preventDefault();

    var email = val("email").toLowerCase();
    var regId = val("bookingid");
    var date = val("testdate");
    var reason = val("reason");
    var msg = val("message");

    var bookings = getBookings();
    var myBooking = null;

    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].bookingid == regId && bookings[i].email == email) {
            myBooking = bookings[i];
            break;
        }
    }

    if (myBooking == null) {
        alert("Booking not found. Please check your Booking ID and email.");
        return;
    }

    if (myBooking.status == "Cancelled") {
        alert("This booking is already cancelled.");
        return;
    }

    if (myBooking.testdate != date) {
        alert("Test date does not match your booking. Please enter the booked date.");
        return;
    }

    myBooking.status = "Cancelled";
    myBooking.cancelReason = reason;
    myBooking.cancelMessage = msg;
    saveBookings(bookings);

    alert("Slot Cancelled Successfully! Your booked slot is now free.");
    e.target.reset();
}


// ----------------- connecting the form -----------------
// every page has only 1 form and every page has one id which
// is not present in other pages, so by checking that id we can
// know which page is open right now.

var form = document.querySelector("form");

if (form != null && document.getElementById("confirm-password")) {
    form.addEventListener("submit", registerUser);       // register page
} else if (form != null && document.getElementById("newdate")) {
    form.addEventListener("submit", rescheduleSlot);     // reschedule page
} else if (form != null && document.getElementById("centre")) {
    form.addEventListener("submit", bookSlot);           // book slot page
} else if (form != null && document.getElementById("message")) {
    form.addEventListener("submit", cancelSlot);         // cancellation page
} else if (form != null && document.getElementById("remember")) {
    form.addEventListener("submit", loginUser);          // login page
}

// not allowing old dates in the date picker
if (document.getElementById("centre")) {
    document.getElementById("testdate").min = todayDate();
}
if (document.getElementById("newdate")) {
    document.getElementById("newdate").min = todayDate();
}

// if remember me was selected last time, fill the email automatically
var savedEmail = localStorage.getItem("savedEmail");
if (savedEmail && document.getElementById("remember")) {
    document.getElementById("email").value = savedEmail;
    document.getElementById("remember").checked = true;
}
