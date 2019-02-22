const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

var emailVal = 'ENTER EMAIL NAME e.g MyEmail98' + '.' + (Math.floor((Math.random() * 9000) + 1000)).toString() + 'ENTER EMAIL SERVICE e.g @gmail.com';
var smsEmail = 'ENTER GETSMSCODE.COM EMAIL ADDRESS';
var token = 'ENTER GETSMSCODE API TOKEN';
var passwordVal = 'ENTER PASSWORD FOR NIKE ACCOUNTS';
var fNameVal = 'ENTER FIRST NAME';
var sNameVal = 'ENTER SURNAME';
var proxyUrl = ''; //if proxy exists enter it in format IP:PORT, if not leave blank
var proxyUser = ''; //If proxy username/pass exists insert it here if not leave both variables blank
var proxyPass = '';
var info;
var themessage;
var phoneNum;
var userpass;


//GET DOM TRAVERSAL VALUES
const AcceptCookies = '#cookie-settings-layout > div > div > div > div.ncss-row.mt5-sm.mb7-sm > div:nth-child(2) > button';
const loginBtn = 'li.member-nav-item.d-sm-ib.va-sm-m > button';
const registerBtn = '.loginJoinLink.current-member-signin > a';
const email = 'input[type="email"]';
const password = 'input[type="password"]';
const fName = '.firstName.nike-unite-component.empty > input[type="text"]';
const sName = '.lastName.nike-unite-component.empty > input[type="text"]';
const dob = 'input[type="date"]';
const gender = 'li:nth-child(1) > input[type="button"]';
const submit = '.joinSubmit.nike-unite-component > input[type="button"]';
const phone = 'div.sendCode > div.mobileNumber-div > input';
const sendNum = '#nike-unite-progressiveForm > div > div > input[type="button"]';
const enterTheValue = 'input[type="number"]';
const storedSubmit = '#nike-unite-progressiveForm > div > input[type="button"]';


//Create Sleep function to use in Async/Await function
function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}


//callback for phone number request
function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        info = body;
        console.log("Phone Number: " + info);
    }
}

//values for phone number request
const options = {
    url: 'http://www.getsmscode.com/vndo.php?action=getmobile&username='+smsEmail+'&token='+token+'&cocode=uk&pid=462',
    headers: {'User-Agent': 'request'}
};

//callback for text message response
function callbacktwo(error, response, body) {
    if (!error && response.statusCode == 200) {
        themessage = body;
        console.log("Message: " + themessage);
    }
}

console.log("The Bot is starting...");

(async () => {

	var page;
    var browser;

	if(proxyUrl != ''){
		browser = await puppeteer.launch({
        args: ['--proxy-server='+ proxyUrl], headless: false, slowMo: 150,
    });
    page = await browser.newPage();

    if(proxyUser != '' &&proxyPass != ''){
    	console.log("authenticating proxy user/pass");
	    await page.authenticate({ 
	      username: proxyUser, 
	      password: proxyPass 
	  	});
	}
	}else{
		browser = await puppeteer.launch({headless: false, slowMo: 150});
		page = await browser.newPage();
	}



    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('https://www.nike.com/gb/launch/');

    //await page.click(AcceptCookies);
    //console.log("Accepted Cookies...");

    await page.waitFor(1000);

    await page.click(loginBtn);
    console.log("Login Button Clicked...")

    await page.click(registerBtn);
    console.log("Register Button Clicked");

    await page.waitFor(2000);
 
    console.log("email: " + emailVal);
    await page.type(email, emailVal);
    console.log("entered email");

    await page.type(password, passwordVal);

    await page.type(fName, fNameVal);

    await page.type(sName, sNameVal);

    await page.type(dob, '01/05/19'+(Math.floor((Math.random() * (99-55)) + 55)).toString());

    await page.click(gender);

    console.log("waiting 0.5s");
    await page.waitFor(500);
    console.log("waiting done");

    await page.click(submit);
    console.log("submitted");
  
  try{
      request(options, callback);
      await sleep(10000);

      if(info.includes("balance")){
        console.log("LOW BALANCE: Add money to your getsmscode account. ");
        browser.close();
        process.exit();
      }

          phoneNum = info.toString().slice(2);

          console.log("Phone number: " + phoneNum);

          console.log("waiting 5s");
          await page.waitFor(5000); 
          console.log("waiting done");
          await page.screenshot({path: 'screenshot.png'});
          await page.click(phone);
          await page.type(phone, phoneNum);
          console.log("entered phone number");

          console.log("waiting 2s");
          await page.waitFor(2000);
          console.log("waiting done");

          await page.click(sendNum);
          console.log("pressed send number button");

          console.log("Getting Text Message: 15s wait");
          await sleep(15000);

          console.log("Phone Number: " + phoneNum);

      const values = {
             url: 'http://www.getsmscode.com/vndo.php?action=getsms&username='+smsEmail+'&token='+token+'&pid=462&cocode=uk&mobile=44'+phoneNum,
             headers: {'User-Agent': 'request'}
      };

      await request(values, callbacktwo);

      await sleep(1500);

      if (themessage.includes("Nike")){

      console.log("request complete");
      var theMessaging = themessage.slice(themessage.length-6);
      console.log("Message: " + theMessaging.toString());
       
      await page.click(enterTheValue);
      await page.type(enterTheValue, theMessaging);
      console.log("entered phone message");

      await sleep(500);

    await page.click(storedSubmit);
    console.log("submitted");
    userpass = (emailVal + ":" + passwordVal);
    console.log(userpass);

    fs.appendFile('Accounts.txt', '\n'+userpass, (err) => {  
        if (err) throw err;
        console.log('Added User/Pass To Accounts.txt!');
    });

      }else{
        console.log("failed to get sms from getsmscode.com");
      }

      await sleep(1000);

  }catch(error){
      console.error(error);
      browser.close();
      process.exit();
  } 

  browser.close();
  process.exit();

})();
