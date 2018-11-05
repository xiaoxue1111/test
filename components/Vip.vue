<template>
 <div class="vip-content">
    <img :src="require('../assets/images/vip.png')" style="position:relative;bottom:-0.08rem">
    <div class="vip-progress">
      <p class="center">{{$t('vip.desc')}}</p>
      <el-row class="message">
          <el-col :span="8" >
            {{$t('vip.currentGrade')}}：VIP {{vipInfo.level}}
          </el-col>
          <el-col :span="16" class="textRight">
            {{$t('vip.prize')}}：<span class="amount">{{prize/1000000}}</span>  TRX 
            </el-col>
      </el-row>
      <p style="text-align:right" class="width-draw">
        <el-button type="primary" size="mini" @click="extract" :loading="extractLoading">{{$t('extract')}}</el-button>   
      </p>
      <el-row class="progress">
          <el-tooltip class="item"  :content="emainingText" placement="top" popper-class="vip">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="vipInfo.expBar"></el-progress>
          </el-tooltip>
      </el-row>
    </div>
    <el-row class="table-content">
      <div class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          size="mini"
          v-loading="tableLoading"
          element-loading-background="rgba(7, 8, 78, 0.42)"
        >
          <el-table-column prop="grade" :label="$t('vip.table.level')">
            <template slot-scope="scope">
              <div class="level">
                {{scope.row.level}}
              </div>
            </template>

          </el-table-column>
          <el-table-column prop="allBets" :label="$t('vip.table.amount')">
            <template slot-scope="scope">
               {{scope.row.totalAmount/1000000}} TRX
            </template>
          </el-table-column>
          <el-table-column prop="prize" :label="$t('vip.table.prize')">
            <template slot-scope="scope">
              {{scope.row.returnRatio*0.01}} %
            </template>
          </el-table-column>
        </el-table>
        <p style="text-align:left;font-family:PingFang-SC-Medium;font-size:14px;color:rgba(255,255,255,0.80);">{{$t('vip.copyRight')}}</p>
      </div>
    </el-row>

  </div>
</template>
<script>
import $t from "vue-i18n";
import { getVipList, getVipInfo } from "~/api/vip";

export default {
  data() {
    return {
      tableData: [],
      extractLoading: false,
      activityAddress: "", //合约地址
      contractInstance: {}, //合约对象
      prize: 0,
      userAddress: "",
      vipInfo: {},
      tronWeb: null,
      tableLoading: true
    };
  },
  computed: {
    emainingValue() {
      // let newEmaining = this.tableData[this.vipDialog.data.grade+1].allBets
      // return newEmaining
    },
    emainingText() {
      let text = this.$t("vip.remainingBet", {
        trx: this.vipInfo.gapAmount / 1000000,
        level: this.vipInfo.level + 1
      });
      return text;
    }
  },

  async created() {
    this.getTableData();
    this.userAddress = this.$store.state.address.base58 || "";
    await this.getVipInfo();
  },
  async mounted() {
    this.activityAddress = this.$store.state.activityAddress;

    this.tronWeb = await window.tronWeb;

    this.contractInstance = await tronWeb.contract().at(this.activityAddress);
    // this.contractInstance.setVipBalance('TN7KpFteYkkGUPM4wQ8uKRLCzq2M3ngkmc',200).send()
    await this.getBalance();
  },
  watch: {
    "vipDialog.data": {
      deep: true,
      handler: val => {}
    }
  },
  methods: {
    async getTableData() {
      this.tableData = await getVipList();
      this.tableLoading = false;
    },
    async getVipInfo() {
      let vip = await getVipInfo(this.userAddress);
      this.vipInfo = vip;
    },
    async getBalance() {
      let banlance = await this.contractInstance.getVipBalance().call();

      banlance = parseInt(banlance, 10);
      this.prize = banlance;
    },
    async extract() {
      if (this.prize == 0) {
        return;
      }

      this.extractLoading = true;

      const txId = await this.contractInstance.withDraw(0).send();
      let checkBalance = setInterval(async () => {
        const res = await tronWeb.getEventByTransacionID(txId);
        if (res.length > 0) {
          res.every(v => {
            if (v.name === "VipWithDraw") {
              clearInterval(checkBalance);
              this.extractLoading = false;
              this.prize = 0;
            }
          });
        }
      }, 2000);
    }
  }
};
</script>
<style lang="scss">
.vip-content {
  width: 6.02rem;
  .vip-progress {
    background: url("../assets/images/vipBottom.png") no-repeat;
    background-size: 100% 100%;

    height: 1.72rem;
    padding: 0.2rem 0.26rem;
    box-sizing: border-box;
    .center {
      font-family: PingFang-SC-Medium;
      font-size: 16px;
      color: rgba(80, 45, 1, 0.8);
      letter-spacing: 0.4px;
      text-align: center;
    }
    .message {
      font-size: 0.18rem;
      color: rgba(80, 45, 1, 0.8);
      line-height: 0.3rem;
      .el-col:last-child {
        text-align: right;
        font-size: 0.16rem;
        .amount {
          color: #707af2;
        }
      }
    }

    .width-draw {
      margin-top: 0;
      .el-button--primary {
        background-image: linear-gradient(-180deg, #707af2 0%, #4354c9 100%);
        border-radius: 3px;
        width: 0.7rem;
        height: 0.3rem;
        font-size: 0.14rem;
      }
      .el-button--primary {
        border: none;
      }
      .el-button--primary:hover {
        background-image: linear-gradient(-180deg, #9fa6fc 0%, #6274ef 100%);
      }
    }

    .progress {
      margin-top: 0.1rem;
      .el-progress-bar__outer {
        background: #c39543;
      }
      .el-progress-bar__inner {
        background-image: linear-gradient(-180deg, #707af2 0%, #4354c9 100%);
      }
    }
  }
  .table-content {
    width: 5.59rem;
    background: rgb(245, 211, 138);
    margin: 0 auto;
    padding: 0.1rem;
    border-radius: 5px;
  }

  .table {
    background: #474fab;
    box-shadow: inset 1px 2px 5px 3px #3c409b;
    border-radius: 3px;
    width: 5.39rem;
    // height:3.26rem;
    margin: 0 auto;
    padding: 0.1rem;
    box-sizing: border-box;
    .el-table th {
      background: rgb(71, 81, 165);
      color: rgb(255, 255, 255);
      text-align: center;
      font-size: 0.16rem;
    }
    .el-table tr {
      background: rgb(43, 56, 126);
      color: rgba(255, 255, 255, 0.8);
      border-radius: 5px;
      font-size: 0.14rem;
      margin: 0 0.1rem;
    }
    .el-table tr td {
      text-align: center;
    }

    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgb(43, 56, 126);
    }

    .el-table td,
    .el-table th.is-leaf {
      border-bottom: none;
    }
    .el-table td {
      border-bottom: 1px solid #474fab;
    }

    .level {
      background: url("../assets/images/level.png") no-repeat center -3px;
      color: #ecc472;
    }
  }
}
</style>
