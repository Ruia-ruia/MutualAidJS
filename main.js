/*
CLASSES - Priority Q, Graph, Volunteer store, Recipient Request Store. 
*/

//---------------------------

class QElem {
  constructor(elem, p){
    this.elem = elem;
    this.p = p;
  }
}

class PQueue {
  constructor(){
    this.items = [];
  }

  set(elem, p){
    var qitem = new QElem(elem, p);
    var flag = false;

    for(var i = 0; i < this.items.length; i++){
      if(this.items[i].p > qitem.p){
        this.items.splice(i, 0, qitem);
        flag = true;
        break;
      }
    }

    if(!flag){
      this.items.push(qitem);
    }
  }


  unset(){
     if(this.items.length !== 0){
       return this.items.shift();
     } else console.log("Empty.");
   }

  get(index){
    return this.items[index];
  }

  size(){
   return this.items.length;
  }
}

//---------------------------

class Graph {
   constructor(){
       this.nodes = {}
   }
   
   initNode(node){
       this.nodes[node] = [];
   }

   initEdge(node1, node2, work){
     this.nodes[node1].push({[node2]:work})
     this.nodes[node2].push({[node1]:work})
   }
}

//---------------------------

class Volunteer{
  constructor(name, addr, numStr, email){
    this.name = name;
    this.addr = addr;
    this.numStr = numStr;
    this.email = email;
  }
}

class RecipientRequest{
  constructor(name, addr, numStr, email, item, timestamp){
    this.name = name;
    this.addr = addr;
    this.numStr = numStr;
    this.email = email;
    this.item = item;
    this.timestamp = timestamp;
  }
}

//---------------------------


/*
FUNCTIONS and GLOBALS - initialise objects ready for steps: Time Prioritisation, Shortest Path Verification, Allocation, Final Confirmation. 
*/

const VOLUNTEERS = '1Cgw0MKUHkIBGwi8SUHCtGXhUdezfuNpjd3Ynsto9ggI';
const RESPONSES = '1s8y5I73fNdvkfPz1xqw3qlyV9GuQKmoRjYaZNs7Tf7M';
const REQUESTS = '1FlQzQtN7TZmBeFdORGH3Hy7_rU4EjklxH6UT6KfIQBE';
var pQ = new PQueue();

function getVolunteersByProximity(addr) {
  /*
  This is where we will attempt to interface with Google Maps in 
  order to work out a list of Volunteers within a certain radius. 
  */
  var sheet = SpreadsheetApp.openById(VOLUNTEERS);
  var data = sheet.getDataRange().getValues();
  
  var volList = [];
  var addr = addr.split(', ')[1];
  
  j = data.length;
  for(i = 0; i < j; i++){
    let sp = data[i][1].split(', ')[1];
   
    if(sp.toLowerCase() === addr){
      volList.push(data[i]);
    }   
  }  
  
  return volList;  
}

function storeRecipient(recObject) {
  var completed = false; 
  var sheet = SpreadsheetApp.openById(REQUESTS);
  sheet.appendRow([recObject.timestamp, recObject.name, recObject.addr, recObject.email, recObject.item, completed]);
  
  /*
  This is where we will prepare a list of Volunteers who are close to 
  the recipient in preparation for contact and the Request signal. 
  */
  var volList = getVolunteersByProximity(recObject.addr);
  Logger.log(volList);
}

function storeVolunteer(volObject) {
  var sheet = SpreadsheetApp.openById(VOLUNTEERS);
  sheet.appendRow([volObject.name, volObject.addr, volObject.numStr, volObject.email]);
}

function initObjects() {
  var sheet = SpreadsheetApp.openById(RESPONSES);
  var data = sheet.getDataRange().getValues();
  var i = 1;  //to be used in a loop or an event handler

  if (!data[i]) {
    return 0;
  }
  
  var timestamp = data[i][0];
  var type = data[i][1];
  var name = data[i][2];
  var email = data[i][3];
  var addr = data[i][4];
  var numStr = data[i][5];
  var item = data[i][6];
  
  if(type === 'Recipient') {
    var recObject = new RecipientRequest(name, addr, numStr, email, item, timestamp);
    storeRecipient(recObject);
  
  } else if (type === 'Volunteer') {
    var volObject = new Volunteer(name, addr, numStr, email);
    storeVolunteer(volObject);
    sheet.deleteRow(i+1);  //relative position to be coded 
    
  } else if (type === 'Both') {
    var volObject = new Volunteer(name, addr, numStr, email);
    var recObject = new RecipientRequest(name, addr, numStr, email, item, timestamp);
    storeVolunteer(volObject);
    storeRecipient(recObject);
    
  } else {
    Logger.log('Something went wrong - not Volunteer, nor Recipient.')
  }
  
}


/*
COMPUTATIONS / INVOCATIONS
*/
