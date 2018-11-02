import xhr from 'axios'

export async function getBalance(address){
  let tronWeb = window.tronWeb;
  let {data} = await xhr.post(`${tronWeb.eventServer}/wallet/getaccount`,{
    address : address
  })
  if(Object.keys(data).length==0){
    return 0;
  }
  return data.balance;
}
export async function noDebug(address){
    var threshold=160;
    if(window){
      setInterval(function(){
        if(window.outerWidth-window.innerWidth>threshold || window.outerHeight-window.innerHeight>threshold){
          //throw new Error('error');
        }
      })
    }
}

export async function getWeeklyRank(address,date){
  let {data} = await xhr.get(`http://testwlcyapi.tronscan.org/api/contract/rank/${address}/week/${date}`);
  return data;
}
