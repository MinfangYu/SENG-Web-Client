<template>
  <div class="EventBox">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <el-menu-item index="1">Home</el-menu-item>
      <el-submenu index="2">
        <template #title>User</template>
        <div v-if="status === null">
          <el-menu-item index="2-1" >Register</el-menu-item>
          <el-menu-item index="2-2" >Login</el-menu-item>
          <el-menu-item index="2-3" disabled>Profile</el-menu-item>
          <el-menu-item index="2-4" disabled>Logout</el-menu-item>
        </div>
        <div v-if="status != null">
          <el-menu-item index="2-1" disabled>Register</el-menu-item>
          <el-menu-item index="2-2" disabled>Login</el-menu-item>
          <el-menu-item index="2-3" >Profile</el-menu-item>
          <el-menu-item index="2-4" >Logout</el-menu-item>
        </div>
      </el-submenu>
      <el-submenu index="3">
        <template #title>Event</template>
        <el-menu-item index="3-1">View Events</el-menu-item>
        <div v-if="status != null">
          <el-menu-item index="3-2">Create Event</el-menu-item>
        </div>
        <div v-if="status == null">
          <el-menu-item index="3-2" disabled>Create Event</el-menu-item>
        </div>
      </el-submenu>
      <el-menu-item index="4">Mypage</el-menu-item>
    </el-menu>

    <div v-if="errorFlag" class= error style="color: #ff0000;">
      <el-alert class="el-alert" title="error alert" type="error" show-icon center :closable="false">{{ error }}</el-alert>
    </div>

    <el-form ref="form" class="search" :model="form" label-width="130px" style=" font-size:larger; padding-top: 30px">
      <el-row style="display: inline-block">
        <el-form-item label="Search Events" class="label">
          <el-input v-model="q" placeholder="Search the title"></el-input>
        </el-form-item>
      </el-row>
      <br>
      <el-row style="display: inline-block">
        <el-form-item label="Sort Events" >
          <el-select v-model="sortQ" placeholder="Choose sort ways" style="width: 250px">
            <el-option label="DATE_ASC" value="DATE_ASC"></el-option>
            <el-option label="DATE_DESC" value="DATE_DESC"></el-option>
            <el-option label="ATTENDEES_ASC" value="ATTENDEES_ASC"></el-option>
            <el-option label="ATTENDEES_DESC" value="ATTENDEES_DESC"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-form-item label="Category" label-width="95px">
        <el-checkbox-group v-model="filterQ">
          <el-checkbox v-for="cate in categories" :key="cate.id" :label="cate.id">{{cate.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getEvents">All Events</el-button>
        <el-button type="primary" @click="searchEvents">Search</el-button>
        <el-button @click="returnPage">Cancel</el-button>
      </el-form-item>
    </el-form>

    <el-card v-for="event in showEvent" :key="event.eventId" class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{event.title}}</span>
        </div>
      </template>
      <div  class="item">
        <img :src="event.img" class="image">
        <div  class="info">
          <label class="text" style="margin-right: 10px;color: fuchsia">Date and time:</label>{{event.date}}<br>
          <label class="text" style="margin-right: 10px;color: fuchsia">Categories:</label>{{event.type}}<br>
          <label class="text" style="margin-right: 10px;color: fuchsia">Organizer Name:</label>{{event.organizerFirstName}} {{event.organizerLastName}}<br>
          <label class="text" style="margin-right: 10px;color: fuchsia">Number of attendees:</label>{{event.numAcceptedAttendees}}<br><br>
          <el-button icon="el-icon-search" style="font-size: 18px" @click="goDetails(event.eventId)">View Details</el-button>
        </div>
      </div>
    </el-card>
    <div class="pager" style=" padding: 50px">
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :currentPage="currentPage1"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="futureEvent.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { h } from 'vue';
import moment from "moment";
export default {
  name: "Event.vue",
  data() {
    return {
      form: {
        sort: '',
        type: [],
      },
      imgUrl: "",
      pageSize: 10,
      currentPage1: 1,
      showEvent: [],
      uploadUrl: "http://localhost:4941/api/v1/users/" + this.userId + "/image",
      activeIndex: '1',
      startIndex: 0,
      q:"",
      categoryIds:"",
      error: "",
      errorFlag: false,
      icon1: 'el-icon-view',
      icon2: 'el-icon-minus',
      eventInfo: [],
      categoryInfo:{},
      categories: [],
      sortQ: "",
      filterQ: [],
      paraQ: {},
      start:0,
      time:'',
      now:new Date(),
      futureEvent: [],
      status:''
    }
  },
  created() {
    this.getCategories();
    this.getEvents();
    this.getTable();
  },
  mounted() {
    this.getCategories();
    this.getEvents();
    this.getTable();
    this.status = sessionStorage.getItem('token');
  },
  updated() {
    this.getCategories();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage1 = val;
      this.getTable();
      if (this.start + 10 >= this.futureEvent.length) {
        this.$message({
          title: 'Notice',
          message: h('i', {style: 'color: teal'}, 'This is the Last page!')
        });
      }
    },
    getTable() {
      this.start = (this.currentPage1 - 1) * this.pageSize;
      this.showEvent = this.futureEvent.slice(this.start, this.start + 10);
    },
    getEvents() {
      this.axios.get('http://localhost:4941/api/v1/events/', {params: {"sortBy": "DATE_ASC"}})
          .then((response) => {
            this.futureEvent = [];
            this.eventInfo = response.data;
            for (const i of this.eventInfo) {
              i.date = moment(i.date).format("YYYY-MM-DD HH:mm:ss");
              this.now = moment(this.now).format("YYYY-MM-DD HH:mm:ss");
              i["img"] = 'http://localhost:4941/api/v1/events/' + i.eventId + '/image';
              i.type = [];
              i.categories.forEach((id) => {
                // console.log(this.categoryInfo[id]);
                i.type.push(this.categoryInfo[id]);
              })
              if(i.date > this.now) {
                this.futureEvent.push(i)
              }
            }
            console.log(this.futureEvent)
            this.showEvent = this.futureEvent.slice(0, 10);
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    searchEvents() {
      if (this.q) {
        this.paraQ["q"] = this.q;
      }
      if (this.sortQ) {
        this.paraQ["sortBy"] = this.sortQ;
      } else {
        this.paraQ["sortBy"] = "DATE_ASC";
      }
      if (this.filterQ) {
        this.paraQ["categoryIds"] = this.filterQ;
      }
      this.axios.get('http://localhost:4941/api/v1/events/', {params: this.paraQ})
          .then((response) => {
            this.eventInfo = response.data;
            this.futureEvent = [];
            for (const i of this.eventInfo) {
              i.date = moment(i.date).format("YYYY-MM-DD HH:mm:ss");
              this.now = moment(this.now).format("YYYY-MM-DD HH:mm:ss");
              i["img"] = 'http://localhost:4941/api/v1/events/' + i.eventId + '/image';
              i.type = [];
              i.categories.forEach((id) => {
                i.type.push(this.categoryInfo[id]);
              })
              if(i.date > this.now) {
                this.futureEvent.push(i)
              }
            }
            this.showEvent = this.futureEvent.slice(0, 10);
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    getCategories() {
      // {params:{"q": this.q}}
      this.axios.get('http://localhost:4941/api/v1/events/categories')
          .then((response) => {
            this.categories = response.data;
            this.categoryInfo = {};
            response.data.forEach((cate) => {
              this.categoryInfo[cate.id] = cate.name;
            });
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    returnPage() {
      this.$router.push("/");
    },
    open() {
      this.$alert(this.error, 'Register Fail', {
        confirmButtonText: 'OK',
      });
    },
    goDetails(eventId) {
      this.$router.push({name: "EventDetails", query: {eventId: eventId}});
    },
    handleSelect(key) {
      if (key === "1") {
        this.activeIndex = "1";
        this.$router.push({path:"/"});
      }else if(key === "2-1") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/register"});
      } else if(key === "2-2") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/login"});
      } else if(key === "2-3") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/my"});
      } else if(key === "2-4") {
        sessionStorage.clear();
        this.activeIndex = "1";
        this.$router.push({path:"/"});
      } else if(key === "3-1") {
        this.activeIndex = "1";
        this.$router.push({path:"/events"});
      } else if(key === "3-2") {
        this.activeIndex = "1";
        this.$router.push({path:"/events/create"});
      } else if(key === "4") {
        this.activeIndex = "1";
        this.$router.push({path:"/events/my"});
      }
    },
  }
}
</script>

<style scoped>
.el-menu-demo {
  margin-top: -60px;
}
.search {
  display: inline-block;
}
.card-header {
  font-size: 20px;
  font-weight: bold;
}
.text {
  font-size: 20px;
  align-content: center;
  align-items: center;
  padding-top: 20px;
  line-height: 25px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 1300px;
  margin: auto;
  font-size: larger;
}
.label {
  font-size: x-large;
}
.image {
  width: 400px;
  height: 320px;
  float: left;
  padding-bottom: 20px;
}

</style>