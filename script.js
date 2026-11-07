// ============================================================= // This line starts the heading banner of this file
// script.js - Driving Test Slot Management System               // This line tells the file name and the project name
// ONE JavaScript file for all pages: Register, Login, Book,     // This line explains this single file works for every page
// Reschedule and Cancellation. Data is saved in localStorage    // This line explains data is saved in the browser memory
// (browser memory), so no server/backend is needed for demo.    // This line explains no server is needed for this demo
// ============================================================= // This line ends the heading banner of this file

// ---------------------- HELPER FUNCTIONS ---------------------- // This line starts the small helper functions section

function getUsers() { // This function reads all registered users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || []; // This line gets the saved users, or an empty list if none are saved
    if (users.length === 0) { // This line checks if no user is saved yet (first time use)
        users = [{ fullname: "Demo User", email: "demo@gmail.com", mobile: "9876543210", dob: "", vehicle: "four-wheeler", address: "", password: "demo123", regId: "REG1001" }]; // This line creates one ready demo user so login works without registering (demo@gmail.com / demo123, Registration ID: REG1001)
        localStorage.setItem("users", JSON.stringify(users)); // This line saves the demo user into localStorage
    } // This line ends the if block above
    return users; // This line returns the users list to the code that called this function
} // This line ends the getUsers function

function saveUsers(users) { // This function saves the full users list into localStorage
    localStorage.setItem("users", JSON.stringify(users)); // This line converts the users list to text and saves it
} // This line ends the saveUsers function

function getBookings() { // This function reads all bookings from localStorage
    return JSON.parse(localStorage.getItem("bookings")) || []; // This line returns the saved bookings, or an empty list if none are saved
} // This line ends the getBookings function

function saveBookings(bookings) { // This function saves the full bookings list into localStorage
    localStorage.setItem("bookings", JSON.stringify(bookings)); // This line converts the bookings list to text and saves it
} // This line ends the saveBookings function

function getValue(id) { // This function reads the typed value of one input box by its id
    return document.getElementById(id).value.trim(); // This line returns the box value after removing extra spaces
} // This line ends the getValue function

function getToday() { // This function makes today's date in yyyy-mm-dd format (same format as a date input box)
    let now = new Date(); // This line takes the current date and time from the computer
    let month = String(now.getMonth() + 1).padStart(2, "0"); // This line gets the month number and makes it 2 digits (example: 09)
    let day = String(now.getDate()).padStart(2, "0"); // This line gets the day number and makes it 2 digits (example: 05)
    return now.getFullYear() + "-" + month + "-" + day; // This line joins year, month and day into one date text
} // This line ends the getToday function

// ---------------------- REGISTER PAGE ---------------------- // This line starts the register page section (register.html)

function registerUser(event) { // This function runs when the Register form is submitted
    event.preventDefault(); // This line stops the page from reloading (the form action is "#" in the HTML)
    let fullname = getValue("fullname"); // This line reads the Full Name box (id="fullname" in register.html)
    let email = getValue("email").toLowerCase(); // This line reads the Email box and converts it to small letters so matching never fails on capital letters
    let mobile = getValue("mobile"); // This line reads the Mobile Number box (id="mobile" in register.html)
    let dob = getValue("dob"); // This line reads the Date of Birth box (id="dob" in register.html)
    let vehicle = getValue("vehicle"); // This line reads the Vehicle Category list (id="vehicle" in register.html)
    let address = getValue("address"); // This line reads the Address box (id="address" in register.html)
    let password = getValue("password"); // This line reads the Create Password box (id="password" in register.html)
    let confirmPassword = getValue("confirm-password"); // This line reads the Confirm Password box (id="confirm-password" in register.html)
    if (password !== confirmPassword) { // This line checks if both passwords are different
        alert("Passwords do not match. Please type the same password in both boxes."); // This line shows the password mismatch message
        return; // This line stops the function here so wrong data is not saved
    } // This line ends the password check if block
    let users = getUsers(); // This line loads all saved users to check for a duplicate email
    let already = users.find(function (user) { return user.email === email; }); // This line searches for a user with the same email
    if (already) { // This line checks if the same email is already registered
        alert("This email is already registered. Please login."); // This line shows the duplicate email message
        window.location.href = "login.html"; // This line sends the user to the Login page
        return; // This line stops the function here
    } // This line ends the duplicate email if block
    let regId = "REG" + Date.now().toString().slice(-6); // This line creates a new Registration ID (example: REG483920) for this user
    users.push({ fullname: fullname, email: email, mobile: mobile, dob: dob, vehicle: vehicle, address: address, password: password, regId: regId }); // This line adds the new user with all form details to the users list
    saveUsers(users); // This line saves the updated users list into localStorage
    alert("Registration Successful!\nYour Registration ID is: " + regId + "\nNote this ID - you need it on the Book Slot page."); // This line shows success and the new Registration ID
    window.location.href = "login.html"; // This line sends the user to the Login page after registration
} // This line ends the registerUser function

// ---------------------- LOGIN PAGE ---------------------- // This line starts the login page section (login.html)

function loginUser(event) { // This function runs when the Login form is submitted
    event.preventDefault(); // This line stops the page from reloading (the form action is "#" in the HTML)
    let email = getValue("email").toLowerCase(); // This line reads the Email box and converts it to small letters for correct matching
    let password = getValue("password"); // This line reads the Password box (id="password" in login.html)
    let user = getUsers().find(function (u) { return u.email === email && u.password === password; }); // This line searches for a user whose email AND password both match
    if (!user) { // This line checks if no matching user was found
        alert("Invalid email or password. Please try again."); // This line shows the wrong login message
        return; // This line stops the function here
    } // This line ends the wrong login if block
    localStorage.setItem("currentUser", user.email); // This line remembers who is logged in now
    if (document.getElementById("remember").checked) { // This line checks if the Remember Me tick box (id="remember" in login.html) is ticked
        localStorage.setItem("savedEmail", user.email); // This line saves the email so it is filled automatically next time
    } else { // This line runs if Remember Me is not ticked
        localStorage.removeItem("savedEmail"); // This line removes any previously saved email
    } // This line ends the Remember Me if-else block
    alert("Login Successful! Welcome, " + user.fullname); // This line shows the login success message with the user's name
    window.location.href = "bookslot.html"; // This line sends the user to the Book Slot page after login
} // This line ends the loginUser function

// ---------------------- BOOK SLOT PAGE ---------------------- // This line starts the book slot page section (bookslot.html)

function bookSlot(event) { // This function runs when the Book Slot form is submitted
    event.preventDefault(); // This line stops the page from reloading (the form action is "#" in the HTML)
    let fullname = getValue("fullname"); // This line reads the Applicant Full Name box (id="fullname" in bookslot.html)
    let email = getValue("email").toLowerCase(); // This line reads the Registered Email box and converts it to small letters
    let bookingid = getValue("bookingid"); // This line reads the Registration ID box (id="bookingid" in bookslot.html - its label is "Registration ID")
    let vehicle = getValue("vehicle"); // This line reads the Vehicle Category list (id="vehicle" in bookslot.html)
    let testdate = getValue("testdate"); // This line reads the Test Date box (id="testdate" in bookslot.html)
    let timeslot = getValue("timeslot"); // This line reads the Time Slot list (id="timeslot" in bookslot.html)
    let centre = getValue("centre"); // This line reads the Test Centre list (id="centre" in bookslot.html)
    if (testdate < getToday()) { // This line checks if the selected test date is in the past
        alert("Please select a future date for your test."); // This line shows the past date message
        return; // This line stops the function here
    } // This line ends the past date if block
    let user = getUsers().find(function (u) { return u.email === email && u.regId === bookingid; }); // This line checks the email and Registration ID match one registered user
    if (!user) { // This line checks if no registered user matched
        alert("Email or Registration ID is wrong. Please register first and use the same Registration ID given at registration."); // This line shows the wrong Registration ID message
        return; // This line stops the function here
    } // This line ends the user check if block
    let bookings = getBookings(); // This line loads all saved bookings
    let myBooking = bookings.find(function (b) { return b.bookingid === bookingid && b.status === "Confirmed"; }); // This line checks if this Registration ID already has one active booking
    if (myBooking) { // This line checks if an active booking already exists for this user
        alert("You already have a booking. Please use the Reschedule or Cancellation page."); // This line shows the already booked message
        return; // This line stops the function here
    } // This line ends the already booked if block
    let slotTaken = bookings.find(function (b) { return b.status === "Confirmed" && b.centre === centre && b.testdate === testdate && b.timeslot === timeslot; }); // This line checks if the same centre + date + time is already booked by someone
    if (slotTaken) { // This line checks if the slot is already taken
        alert("Sorry, this time slot is already booked at this centre. Please select another time or centre."); // This line shows the slot not available message
        return; // This line stops the function here
    } // This line ends the slot taken if block
    bookings.push({ bookingid: bookingid, fullname: fullname, email: email, vehicle: vehicle, testdate: testdate, timeslot: timeslot, centre: centre, status: "Confirmed" }); // This line adds the new booking with status Confirmed to the bookings list
    saveBookings(bookings); // This line saves the updated bookings list into localStorage
    alert("Slot Booked Successfully!\nRegistration ID: " + bookingid + "\nDate: " + testdate + "\nTime: " + timeslot + "\nStatus: Confirmed"); // This line shows the booking success message with full details
    event.target.reset(); // This line clears the form so it is ready for a fresh entry
} // This line ends the bookSlot function

// ---------------------- RESCHEDULE PAGE ---------------------- // This line starts the reschedule page section (reschedule.html)

function rescheduleSlot(event) { // This function runs when the Reschedule form is submitted
    event.preventDefault(); // This line stops the page from reloading (the form action is "#" in the HTML)
    let email = getValue("email").toLowerCase(); // This line reads the Registered Email box and converts it to small letters
    let bookingid = getValue("bookingid"); // This line reads the Existing Booking ID box (id="bookingid" in reschedule.html - here it means the Registration ID used at booking)
    let currentdate = getValue("currentdate"); // This line reads the Currently Booked Test Date box (id="currentdate" in reschedule.html)
    let currenttime = getValue("currenttime"); // This line reads the Currently Booked Time list (id="currenttime" in reschedule.html)
    let newdate = getValue("newdate"); // This line reads the New Test Date box (id="newdate" in reschedule.html)
    let newtime = getValue("newtime"); // This line reads the New Time Slot list (id="newtime" in reschedule.html)
    let reason = getValue("reason"); // This line reads the Reason for Rescheduling list (id="reason" in reschedule.html)
    let bookings = getBookings(); // This line loads all saved bookings
    let booking = bookings.find(function (b) { return b.bookingid === bookingid && b.email === email && b.status === "Confirmed"; }); // This line finds the active booking using Booking ID + email
    if (!booking) { // This line checks if no active booking was found
        alert("Booking not found. Please check your Booking ID and email."); // This line shows the booking not found message
        return; // This line stops the function here
    } // This line ends the booking not found if block
    if (booking.testdate !== currentdate || booking.timeslot !== currenttime) { // This line checks the typed current date/time against the saved booking
        alert("Current date or time does not match your booking. Please enter the booked date and time."); // This line shows the current slot mismatch message
        return; // This line stops the function here
    } // This line ends the current slot mismatch if block
    if (newdate < getToday()) { // This line checks if the new date is in the past
        alert("Please select a future date for the new slot."); // This line shows the past date message
        return; // This line stops the function here
    } // This line ends the past date if block
    if (newdate === currentdate && newtime === currenttime) { // This line checks if the new slot is the same as the current slot
        alert("New date and time are the same as your current booking. Please select a different slot."); // This line shows the same slot message
        return; // This line stops the function here
    } // This line ends the same slot if block
    let slotTaken = bookings.find(function (b) { return b !== booking && b.status === "Confirmed" && b.centre === booking.centre && b.testdate === newdate && b.timeslot === newtime; }); // This line checks if another booking already took the new centre + date + time
    if (slotTaken) { // This line checks if the new slot is already taken
        alert("Sorry, the new time slot is already booked. Please select another time."); // This line shows the slot not available message
        return; // This line stops the function here
    } // This line ends the slot taken if block
    booking.testdate = newdate; // This line updates the booking date to the new date
    booking.timeslot = newtime; // This line updates the booking time to the new time
    booking.reason = reason; // This line saves the reschedule reason inside the booking
    saveBookings(bookings); // This line saves the updated bookings list into localStorage
    alert("Slot Rescheduled Successfully!\nNew Date: " + newdate + "\nNew Time: " + newtime); // This line shows the reschedule success message
    event.target.reset(); // This line clears the form so it is ready for a fresh entry
} // This line ends the rescheduleSlot function

// ---------------------- CANCELLATION PAGE ---------------------- // This line starts the cancellation page section (cancellation.html)

function cancelSlot(event) { // This function runs when the Cancellation form is submitted
    event.preventDefault(); // This line stops the page from reloading (the form action is "#" in the HTML)
    let email = getValue("email").toLowerCase(); // This line reads the Registered Email box and converts it to small letters
    let bookingid = getValue("bookingid"); // This line reads the Booking ID box (id="bookingid" in cancellation.html - here it means the Registration ID used at booking)
    let testdate = getValue("testdate"); // This line reads the Booked Test Date box (id="testdate" in cancellation.html)
    let reason = getValue("reason"); // This line reads the Reason for Cancellation list (id="reason" in cancellation.html)
    let message = getValue("message"); // This line reads the optional Additional Details box (id="message" in cancellation.html)
    let bookings = getBookings(); // This line loads all saved bookings
    let booking = bookings.find(function (b) { return b.bookingid === bookingid && b.email === email; }); // This line finds the booking using Booking ID + email
    if (!booking) { // This line checks if no booking was found
        alert("Booking not found. Please check your Booking ID and email."); // This line shows the booking not found message
        return; // This line stops the function here
    } // This line ends the booking not found if block
    if (booking.status === "Cancelled") { // This line checks if this booking is already cancelled
        alert("This booking is already cancelled."); // This line shows the already cancelled message
        return; // This line stops the function here
    } // This line ends the already cancelled if block
    if (booking.testdate !== testdate) { // This line checks the typed date against the saved booking date
        alert("Test date does not match your booking. Please enter the booked date."); // This line shows the date mismatch message
        return; // This line stops the function here
    } // This line ends the date mismatch if block
    booking.status = "Cancelled"; // This line changes the booking status to Cancelled (the slot becomes free for others)
    booking.cancelReason = reason; // This line saves the cancellation reason inside the booking
    booking.cancelMessage = message; // This line saves the additional details inside the booking
    saveBookings(bookings); // This line saves the updated bookings list into localStorage
    alert("Slot Cancelled Successfully! Your booked slot is now free."); // This line shows the cancellation success message
    event.target.reset(); // This line clears the form so it is ready for a fresh entry
} // This line ends the cancelSlot function

// ---------------------- START: CONNECT THE FORM ---------------------- // This line starts the section that connects this file to the current page
// How this works: every page in this project has exactly ONE form (checked in all files), // This line explains each page has only one form, so one submit connection is enough
// and each page has ONE special id that no other page has. This code checks that special id // This line explains the page is identified by its one unique id
// and connects the correct function above. So this same script.js works on all pages. // This line explains why one file works everywhere

let form = document.querySelector("form"); // This line finds the one form on the current page (index.html has no form, so it stays empty there)

if (form && document.getElementById("confirm-password")) { // This line checks the Register page (only register.html has id="confirm-password")
    form.addEventListener("submit", registerUser); // This line connects the Register form submit to the registerUser function
} else if (form && document.getElementById("newdate")) { // This line checks the Reschedule page (only reschedule.html has id="newdate")
    form.addEventListener("submit", rescheduleSlot); // This line connects the Reschedule form submit to the rescheduleSlot function
} else if (form && document.getElementById("centre")) { // This line checks the Book Slot page (only bookslot.html has id="centre")
    form.addEventListener("submit", bookSlot); // This line connects the Book Slot form submit to the bookSlot function
} else if (form && document.getElementById("message")) { // This line checks the Cancellation page (only cancellation.html has id="message")
    form.addEventListener("submit", cancelSlot); // This line connects the Cancellation form submit to the cancelSlot function
} else if (form && document.getElementById("remember")) { // This line checks the Login page (only login.html has id="remember")
    form.addEventListener("submit", loginUser); // This line connects the Login form submit to the loginUser function
} // This line ends the page-check if-else chain

if (document.getElementById("centre")) { // This line checks the Book Slot page again (only bookslot.html has id="centre")
    document.getElementById("testdate").min = getToday(); // This line blocks past dates in the Book Slot date calendar itself
} // This line ends the book page date block

if (document.getElementById("newdate")) { // This line checks the Reschedule page (only reschedule.html has id="newdate")
    document.getElementById("newdate").min = getToday(); // This line blocks past dates in the New Test Date calendar itself
} // This line ends the reschedule page date block

let savedEmail = localStorage.getItem("savedEmail"); // This line reads the Remember Me saved email, if any

if (savedEmail && document.getElementById("remember")) { // This line checks: a saved email exists AND this is the Login page
    document.getElementById("email").value = savedEmail; // This line fills the saved email into the Login email box automatically
    document.getElementById("remember").checked = true; // This line keeps the Remember Me tick box ticked
} // This line ends the Remember Me fill block
