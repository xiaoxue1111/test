<template>

  <div class="invite-content">
    <p class="center">{{$t('invite.desc')}}</p>
    <div class="padding-content">
    <el-row class="message">
      <div class="input-content">{{inviteUrl}}</div>
      <!-- <el-input placeholder="请输入内容" v-model="inviteUrl" ></el-input> -->
      <el-button @click="copy" class="copyContent" :data-clipboard-text="inviteUrl">
            {{$t('invite.copyButton')}}
      </el-button>
    </el-row>
    <el-row>
      <div class="title">{{$t('invite.prize')}}
        <el-tooltip placement="right" effect="dark">
          <div slot="content">
              <p style="font-size: 14px;" v-for="(item,index) in $t('invite.prizeRule')" :key="index">
                {{item}}
              </p>
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <div class="textCenter">
        <div class="amount">{{prize/1000000}} <span class="trx">TRX</span></div>
        <el-button @click="extract" type="primary" :loading="extractLoading">{{$t('extract')}}</el-button>
      </div>

    </el-row>
    <el-row class="table">
      <p class="title">{{$t('invite.record')}}</p>
      <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      height="150"
      v-loading="tableLoading"
          element-loading-background="rgba(7, 8, 78, 0.42)"
      >
        <el-table-column prop="statisticTime" :label="$t('invite.table.time')">
          <template slot-scope="scope">
            {{moment(scope.row.statisticTime).format('YYYY-MM-DD')}}  
          </template>
        </el-table-column>
        <el-table-column prop="inviteeAddress" :label="$t('invite.table.address')" width="150px">
          <template slot-scope="scope">
            {{scope.row.address | hiddenAddress}}
            <el-button type="success" :data-clipboard-text="scope.row.address" size="mini" style="float: right" class="copyContent" @click="copy">
              {{$t('invite.copyButton')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="returnAmount" :label="$t('invite.table.bet')">
          <template slot-scope="scope">
            {{scope.row.bet | fromSun}} TRX
          </template>
        </el-table-column>
        <el-table-column prop="returnAmount" :label="$t('invite.table.prize')">
          <template slot-scope="scope">
            {{scope.row.prize | fromSun}} TRX
          </template>
        </el-table-column>
      </el-table>
      
    </el-row>
    <el-row style="text-align:center;" small>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="page.size"
      :page-size="page.limit"
      layout="sizes, prev, pager, next"
      :total="page.total">
    </el-pagination>
    </el-row>
    <el-row>
      {{$t('vip.copyRight')}}
    </el-row>
    </div>
    
  </div>
</template>
<script>
import Clipboard from "clipboard";
import { getInviteList } from "~/api/vip";
import moment from "moment";

export default {
  data() {
    return {
      currentGrade: 1,
      emaining: 15000,
      url: null,
      tableData: [],
      extractLoading: false,
      activityAddress: "", //合约地址
      contractInstance: {}, //合约对象
      page: {
        start: 0,
        limit: 10,
        size: [10, 50, 100],
        total: 100,
        current: 1
      },
      prize: 0,
      tableLoading: true
    };
  },

  async mounted() {
    this.activityAddress = this.$store.state.activityAddress;
    let tronWeb = window.tronWeb;
    this.contractInstance = await tronWeb.contract().at(this.activityAddress);
    await this.getBalance();
    this.getTableData();

    this.url = window.location.origin;

    // this.contractInstance.setInvitationBalance('TN7KpFteYkkGUPM4wQ8uKRLCzq2M3ngkmc',200).send();
  },
  computed: {
    inviteUrl() {
      let address = this.$store.state.address || {};
      let finalUrl = `${this.url}?from=${address.base58}`;
      return finalUrl;
    },
    postData() {
      this.page.start = (this.page.current - 1) * this.page.limit;
      let data = {
        contractAddress: this.activityAddress,
        inviterAddress: this.$store.state.address.base58 || "",
        dappid: 1,
        start: this.page.start,
        limit: this.page.limit
      };

      return data;
    }
  },
  methods: {
    async getBalance() {
      let banlance = await this.contractInstance.getInvitationBalance().call();
      banlance = banlance.toString();
      this.prize = banlance;
    },
    copy() {
      let clipboard = new Clipboard(".copyContent");
      clipboard.on("success", e => {
        this.$message({
          showClose: true,
          message: "Copy success",
          type: "success"
        });

        clipboard.destroy();
      });

      clipboard.on("error", e => {
        this.$message.success("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    async extract() {
      if (this.prize == 0) {
        return;
      }

      this.extractLoading = true;

      const txId = await this.contractInstance.withDraw(1).send();
      let checkBalance = setInterval(async () => {
        const res = await tronWeb.getEventByTransacionID(txId);
        if (res.length > 0) {
          res.every(v => {
            if (v.name === "InvitationWithDraw") {
              clearInterval(checkBalance);

              this.extractLoading = false;
              this.prize = 0;
              this.tableData = [];
            }
          });
        }
      }, 2000);
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    async getTableData() {
      let data = this.postData;
      let response = await getInviteList(data);

      this.tableData = response.data;
      // this.page.total = response.total;

      this.tableLoading = false;
    }
  }
};
</script>
<style lang="scss">
.invite-content {
  .padding-content {
    padding-right: 0.3rem;
  }

  .center {
    text-align: center;
    font-size: 0.16rem;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 0.4px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  .message {
    height: 0.56rem;
    line-height: 0.56rem;
    display: flex;
    .input-content {
      // width: 4.12rem;
      height: 0.56rem;
      // .el-input__inner {
      width: 100%;
      height: 100%;
      background: rgba(7, 8, 78, 0.42);
      border-radius: 3px;
      color: #fff;
      font-size: 0.2rem;
      border: none;
      padding: 0 0.1rem;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      // }
    }
    .el-button {
      background-image: linear-gradient(-180deg, #ffefb6 0%, #fbce60 100%);
      box-shadow: 2px 2px 5px 3px rgba(58, 66, 156, 0.5);
      border-radius: 3px;
      width: 1rem;
      height: 0.56rem;
      font-family: PingFang-SC-Bold;
      font-size: 0.2rem;
      color: #474fab;
      margin-left: 0.05rem;
      padding: 0;
    }
  }

  .textRight {
    text-align: right;
  }
  .vipProgress {
    margin-top: 20px;
  }
  .table {
    .el-table th {
      background: rgb(42, 51, 126);

      font-size: 0.16rem;
    }
    .el-table tr {
      background: rgb(42, 51, 126);
      border-radius: 3px;
      font-size: 0.14rem;
      color: rgba(255, 255, 255, 0.8);
    }
    .el-table tr td {
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      background: rgb(42, 51, 126);
    }

    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgb(43, 56, 126);
    }
    .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper
      .el-table--border.is-scrolling-left
      ~ .el-table__fixed {
      border-right: none;
    }
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: none;
    }
    .el-table td {
      border-bottom: 1px solid #474fab;
    }
    .el-table--border,
    .el-table--group {
      border: none;
    }

    .el-table__empty-block {
      background-color: rgb(42, 51, 126);
    }

    .level {
      background: url("../assets/images/level.png") no-repeat center 0;
      color: #ecc472;
    }
  }

  .el-input-group__append {
    background-color: #409eff;
    color: #fff;
  }

  .title {
    font-family: PingFang-SC-Medium;
    font-size: 20px;
    color: #ffffff;
    letter-spacing: 0.5px;
    i {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .textCenter {
    display: flex;
    .amount {
      // width: 4.12rem;
      width: 100%;
      height: 0.56rem;
      border-radius: 3px;
      color: #fff;
      font-size: 0.2rem;
      border: none;
      line-height: 0.56rem;
      text-indent: 0.54rem;
      display: inline-block;
      background: url("../assets/images/logo-sm.png") no-repeat 0.16rem center;
      background-color: rgba(7, 8, 78, 0.42);
      .trx {
        float: right;
        margin-right: 0.1rem;
      }
    }

    .el-button {
      background-image: linear-gradient(-180deg, #fad961 0%, #f7b81c 100%);
      box-shadow: 2px 2px 5px 3px rgba(58, 66, 156, 0.5);
      border-radius: 3px;
      width: 1rem;
      height: 0.56rem;
      font-family: PingFang-SC-Bold;
      font-size: 0.2rem;
      color: #474fab;
      border: none;
      margin-left: 0.05rem;
      padding: 0;
    }
  }

  .el-row {
    margin-top: 20px;
  }

  .el-table__empty-block {
    background-color: #000;
  }
  .el-table__empty-text {
    color: #fff;
  }

  .el-pagination__total,
  .el-pagination__jump {
    color: #fff;
  }

  .el-pager li {
    border-radius: 1px;
    width: 0.3rem;
    height: 0.3rem;
    margin-right: 0.02rem;
    color: #fff;
    background: #2b3683;
    border-radius: 1px;
    box-sizing: border-box;
    min-width: none;
  }

  .el-pager li.active {
    background: #e7b01a;
  }
  .el-pagination .btn-next,
  .el-pagination .btn-prev {
    width: 0.3rem;
    height: 0.3rem;
    margin-right: 0.02rem;
    background: #2b3683;
    i {
      color: #fff;
    }
  }

  .el-pagination__sizes {
    .el-input__inner {
      background: #2b3683;
      color: #fff;
      border: none;
    }
  }

  .el-scrollbar__view.el-select-dropdown__list {
    background: #2b3683;
    color: #fff;
  }
}
</style>
