const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

var emailVal = 'chippyfriedrice' + '.' + (Math.floor((Math.random() * 9000) + 1000)).toString() + '@gmail.com';
var smsEmail = 'chippyfriedrice@gmail.com';
var token = 'f0f65d3739c9f6e5fcf698e7f85e5c02';
var passwordVal = 'Msn12345';
var fNameVal = 'Andrew';
var sNameVal = 'Georgiou';
var info;
var themessage;
var phoneNum;
var userpass;


//GET DOM TRAVERSAL VALUES
//const AcceptCookies = '#cookie-settings-layout > div > div > div > div.ncss-row.mt5-sm.mb7-sm > div:nth-child(2) > button';
const loginBtn = 'li.member-nav-item.d-sm-ib.va-sm-m > button';
const registerBtn = '#nike-unite-mobileLoginForm > div.nike-unite-component.action-link.mobileLoginJoinLink.current-member-signin > a';

const phone = '#nike-unite-mobileJoinForm > div.nike-unite-component.nike-unite-verifyMobileNumber > div.sendCode > div.mobileNumber-div > input';
const sendNum = '#nike-unite-mobileJoinForm > div.nike-unite-component.nike-unite-verifyMobileNumber > div.sendCode > input';
const enterValue = '#nike-unite-mobileJoinForm > div.nike-unite-component.nike-unite-verifyMobileNumber > div.verifyCode > input'
const enterTheValue = 'input[type="number"]';
const storedSubmit = '#nike-unite-mobileJoinForm > div.nike-unite-submit-button.mobileJoinContinue.nike-unite-component > input[type="button"]';

const password = 'input[type="password"]';
const fName = '#nike-unite-mobileJoinForm > div.nike-unite-text-input.firstName.nike-unite-component.empty > input[type="text"]';
const sName = '#nike-unite-mobileJoinForm > div.nike-unite-text-input.lastName.nike-unite-component.empty > input[type="text"]';
const gender = '#nike-unite-mobileJoinForm > div.nike-unite-gender-buttons.shoppingGender.nike-unite-component > ul > li:nth-child(1) > input[type="button"]';
const submit = '#nike-unite-mobileJoinForm > div.nike-unite-submit-button.mobileJoinSubmit.nike-unite-component > input[type="button"]';

const jumpOver = '#nike-unite-mobileJoinDobEmailForm > div.nike-unite-action-button.mobileJoinDobEmailSkipButton.nike-unite-component > font > font > input[type="button"]';
const email = 'input[type="email"]';
const submitEmail = 'input[type="button"]';






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
	url: 'http://www.getsmscode.com/do.php?action=getmobile&username='+smsEmail+'&token='+token+'&pid=628',
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
  
    const browser = await puppeteer.launch({headless: false, slowMo: 150});
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 800 })
    await page.goto('https://www.nike.com/cn/launch/');

    //await page.click(AcceptCookies);
    //console.log("Accepted Cookies...");

    await page.waitFor(1000);

    await page.click(loginBtn);
    console.log("Login Button Clicked...")

    await page.click(registerBtn);
    console.log("Register Button Clicked");

    await page.waitFor(2000);
	
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

		  console.log("Phone Number: 86" + phoneNum);

	  const values = {
	  		 url: 'http://www.getsmscode.com/do.php?action=getsms&username='+smsEmail+'&token='+token+'&pid=628&mobile=86'+phoneNum,
		     headers: {'User-Agent': 'request'}
      };

	  await request(values, callbacktwo);

	  await sleep(1500);

	  if (themessage.includes("NIKE")){

		  console.log("request complete");
		  var theMessaging = themessage.slice(themessage.length-6);
		  console.log("Message: " + theMessaging.toString());
	   
	  await page.click(enterTheValue);
	  await page.type(enterTheValue, theMessaging);
	  console.log("entered phone message");

	  await sleep(500);

	  await page.click(storedSubmit);
	  console.log("submitted");
	

      }else{
      	console.log("failed to get sms from getsmscode.com");
      	browser.close();
      	process.exit();
  	  }

      await sleep(1000);

  }catch(error){
	  console.error(error);
	  browser.close();
	  process.exit();
  } 
  await sleep(2000);
	await page.type(sName, sNameVal);
	await page.type(fName, fNameVal);
	await page.type(password, passwordVal);
	await page.click(gender);

	await page.click(submit);
    console.log("submitted");

	console.log("waiting 5s");
    await page.waitFor(5000);
    console.log("waiting done");

	console.log("email: " + emailVal);
    await page.type(email, emailVal);
    console.log("entered email");

    const submitEmail = 'input[type="button"]';

    userpass = (emailVal + ":" + passwordVal);
	console.log(userpass);

	fs.appendFile('Accounts.txt', '\n'+userpass, (err) => {  
	    if (err) throw err;
	    console.log('Added User/Pass To Accounts.txt!');
	});
  
  	await sleep(5000);

  browser.close();
  process.exit();

})();