<template>
  <div class="my-nav">
    <div class="inner">
      <a  class="logo" href="javascript:window.location.reload();">
        <img :src="require('../assets/images/logo.png')">
      </a>
      <div class="nav"> 
        <el-button class="luckyDraw">
          {{$t('LuckyDraw.btn')}}
        </el-button>
        <el-button type="text" class="activityButton" @click="inviteVisible = true">
          {{$t('invite.button')}}
        </el-button>    
        <el-button type="text" class="activityButton" @click="vipVisible = true">
          {{$t('vip.button')}}
        </el-button>     
        <div class="login" v-if="address && address.base58"  style="margin-left:.3rem" >
          <span>{{address.base58 | hiddenAddress}}</span>
        </div>
        <div class="login" v-else @click="$store.commit('SET_DIALOG_LOGIN',true)" style="margin-left:.3rem" >
          <span>{{$t('Login')}}</span>
        </div>
        
        <div class="language" @click="selectLanguage">
        <img :src="require('../assets/images/'+languageGroup[locale].icon)" alt=""><span>{{$t(languageGroup[locale].txt)}}</span>
        <div class="group" v-if="show">
          <div v-for="(item,index) of languageGroup" class="item" @click="location(item.lng)" :key="index">
            <img :src="require('../assets/images/'+item.icon)">
            <span>{{item.txt}}</span>
          </div>
        </div>
      </div>
      
      </div>

      <!-- 登录 -->
       <el-dialog
                :title="$t('LoginTipTitle')"
                :visible.sync="dialogLogin"
                width="3.8rem"
                custom-class="how-dialog">
          <p v-html="$t('LoginTipContent')"></p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="$store.commit('SET_DIALOG_LOGIN',false)">{{$t('Confirm')}}</el-button>
          </span>
        </el-dialog>
      <!-- 幸运抽奖 -->
        <el-dialog
                :title="$t('LoginTipTitle')"
                :visible.sync="dialogLogin"
                width="3.8rem"
                custom-class="how-dialog">

                </el-dialog>

      <!-- 邀请 -->
      <el-dialog
        :title="$t('invite.title')"
        :visible.sync="inviteVisible"
        width="5.88rem"
        custom-class="how-dialog invite-dialog" v-if="inviteVisible" >
          <invite></invite>
        </el-dialog>

      <!-- vip -->
      <el-dialog
        :visible.sync="vipVisible"
        custom-class="how-dialog vip-dialog" v-if="vipVisible" top="0">
          <vip></vip>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import vip from "~/components/Vip";
import invite from "~/components/Invite";
export default {
  name: "MyNav",
  components: {
    vip,
    invite
  },
  data() {
    return {
      icon: "",
      show: false,
      dialogHow: false,
      luckyList: [
        { area: "0-100", prize: 0.2 },
        { area: "101-999", prize: 2 },
        { area: "1000-4999", prize: 20 },
        { area: "5000-9999", prize: 200 },
        { area: "10000", prize: 1000 }
      ],
      languageGroup: {
        en: { lng: "en", txt: "English", icon: "en.png" },
        ch: { lng: "ch", txt: "Chinese", icon: "ch.png" }
      },
      vipVisible: false,
      inviteVisible: false,
      luckyDrawVisible: false
    };
  },
  created() {},
  watch: {
    address: {
      handler(n, o) {
        //window.location.reload()
      },
      deep: true
    }
  },
  mounted() {},
  computed: {
    ...mapState(["address", "locale", "dialogLogin"])
  },
  methods: {
    selectLanguage() {
      this.show = !this.show;
    },
    location(lng) {
      window.location = "/" + lng;
    }
  }
};
</script>

<style lang="scss">
.my-nav {
  .login {
    height: 0.26rem;
    border: 1px solid #e7b01a;
    border-radius: 3px;
    text-align: center;
    line-height: 0.22rem;
    font-size: 16px;
    color: #e7b01a;
    padding: 0 0.15rem 0 0.25rem;
    text-indent: 0.1rem;
    background: url("../assets/images/user.png") no-repeat;
    background-position: 0.13rem 0.03rem;
    &:hover {
      border: 1px solid #f4c956;
      background: url("../assets/images/user1.png") no-repeat;
      background-position: 0.13rem 0.03rem;
      color: #f4c956;
    }
  }
  .lng {
    width: 0.23rem;
    height: 0.16rem;
    vertical-align: baseline;
  }
  .showLngBox {
    display: inline-block;
    vertical-align: middle;
  }
  .showLng {
    height: 0.22rem;
    line-height: 0.22rem;
    color: #fff;
    display: inline-block;
  }
  .activityButton {
    color: #fff;
    font-size: 0.16rem;
    font-weight: normal;
    padding-left: 0;
    padding: 0 0.15rem;
    &:hover {
      color: #e7b01a;
    }
  }
  .luckyDraw {
    width: 0.87rem;
    height: 0.26rem;
    text-align: center;
    line-height: 0.26rem;
    padding: 0;
    background: #e7b01a;
    border-radius: 3px;
    color: #fff;
    font-size: 0.14rem;
    border: none;
    &:hover {
      background: #f4c956;
    }
  }
  height: 0.7rem;
  .inner {
    width: 90%;
    max-width: 12rem;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .logo {
      display: flex;
      justify-content: flex-start;
      img {
        width: 1.76rem;
        height: 0.39rem;
      }
    }
    .nav {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      .account {
        margin-left: 0.3rem;
        letter-spacing: 0.01rem;
        font-size: 0.16rem;
        display: flex;
        align-items: center;
        color: #fff;
      }
      .language {
        padding-right: 20px;
        position: relative;
        margin-left: 30px;
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
          margin-left: 10px;
        }
        &:after {
          content: "";
          position: absolute;
          top: 8px;
          right: 5px;
          width: 0;
          height: 0;
          border-top: 4px solid #fff;
          border-bottom: 4px solid transparent;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }
        .group {
          position: absolute;
          right: 0;
          top: 150%;
          width: 160px;
          z-index: 20;
          background: #3b4188;
          .item {
            height: 40px;
            border-top: 1px solid #4e4e4e;
            padding: 0 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            &:first-child {
              border: none;
            }
            &:hover {
              background-color: #696fb6;
            }
          }
        }
      }
    }
  }

  .vip-dialog.how-dialog {
    background: none;
    box-shadow: none;
    width: 6.02rem;
    text-align: center;
  }

  .invite-dialog {
    .el-dialog__title {
      font-size: 0.3rem;
      color: #ffffff;
      letter-spacing: 0.75px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .el-dialog__body {
      padding: 0.1rem 0.3rem;
      padding-right: 0;
    }
  }
}
</style>
