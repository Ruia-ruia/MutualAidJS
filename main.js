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
  }
}

//---------------------------


/*
FUNCTIONS - initialise objects ready for steps: Time Prioritisation, Shortest Path Verification, Allocation, Final Confirmation. 
*/

function initObjects() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var i = 1;  //to be used in a loop or an event handler
  
  var timestamp = data[i][0];
  var type = data[i][1];
  var name = data[i][2];
  var email = data[i][3];
  var addr = data[i][4];
  var numStr = data[i][5];
  
  if(type === 'Recipient'){
    var item = data[i][6];
    var newReq = new RecipientRequest(name, addr, numStr, email, item, timestamp);
  
  } else if (type === 'Volunteer') {
    var newVol = new Volunteer(name, addr, numStr, email);
    
  } else if (type === 'Both') {
    var item = data[i][6];
    var newVol = new Volunteer(name, addr, numStr, email);
    var newReq = new RecipientRequest(name, addr, numStr, email, item, timestamp);
    
  } else {
    Logger.log('Something went wrong - not Volunteer, nor Recipient.')
  }
}


/*
COMPUTATIONS / INVOCATIONS
*/
