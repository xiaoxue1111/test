import {deepCopy} from "../static/js/Util";
export const state = () => ({
  locales: ['en', 'ch'],
  locale: 'en' ,
  address : {},
  balance:0,
  limit:10000,
  contractAddress:'',
  contractInstance:null,
  dialogLogin:false,
  myBetsLength:0,
  showLoading:true,
  random:0
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },
  SET_ADDRESS(state, address) {
    state.address = address;
  },
  SET_CONTRACT_ADDRESS(state, address) {
        state.contractAddress = address;
  },
  SET_BALANCE(state, balance) {
    state.balance = balance
  },
  SET_CONTRACT_INSTANCE(state, obj) {
    state.contractInstance = {...state.contractInstance,...obj}
  },
  SET_DIALOG_LOGIN(state, dialogLogin) {
    state.dialogLogin = dialogLogin
  },
  SET_MY_BETS_LENGTH(state, myBetsLength) {
    state.myBetsLength = myBetsLength
  },
  SET_RANDOM(state, random) {
    state.random = random
  },
  SET_SHOW_LOADING(state, showLoading) {
    state.showLoading = showLoading
  }
}
