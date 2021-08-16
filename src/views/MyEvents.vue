<template>
  <div class="MyEventBox">
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
    <label class="text" style="margin-right: 20px;color: dimgray; font-size: 18px">Select your events:</label>
    <el-select v-model="value">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary"  @click="returnPage" style="margin-left: 400px">Return</el-button>
    <div v-if="value === ''">
    <el-card v-for="event in allEvent" :key="event.eventId" class="box-card">
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
    </div>
    <div v-if="value === '2'">
    <el-card v-for="event in orEvent" :key="event.eventId" class="box-card">
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
    </div>
    <div v-if="value === '3'">
    <el-card v-for="event in atEvent" :key="event.eventId" class="box-card">
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
    </div>
    <div v-if="value === '1'">
    <el-card v-for="event in allEvent" :key="event.eventId" class="box-card">
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
    </div>

  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "MyEvents.vue",
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
      activeIndex: '1',
      startIndex: 0,
      q:"",
      categoryIds:"",
      error: "",
      errorFlag: false,
      eventInfo: [],
      eventId: [],
      oneEvent:'',
      categoryInfo:{},
      categories: [],
      sortQ: "",
      filterQ: [],
      paraQ: {},
      start:0,
      time:'',
      now:new Date(),
      orEvent: [],
      atEvent: [],
      allEvent: [],
      every: [],
      options: [{
        value: "1",
        label: 'All Events'
      }, {
        value: "2",
        label: 'As Organizer'
      }, {
        value: "3",
        label: 'As Attendee'
      }],
      value: '',
      status:'',
    }
  },
  mounted() {
    this.getCategories();
    this.getEvents();
    this.status = sessionStorage.getItem('token');
  },
  created() {
    this.getCategories();
  },
  methods: {
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
    getEvents() {
      this.axios.get('http://localhost:4941/api/v1/events/', {params: {"sortBy": "DATE_ASC"}})
          .then((response) => {
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
            }
            this.getAttendees();
            this.getOneEvent();
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    getAttendees(){
      for (const i of this.eventInfo) {
        this.axios.get('http://localhost:4941/api/v1/events/'+i.eventId+'/attendees', {
          headers: {"X-Authorization": sessionStorage.getItem("token")}})
            .then((response) => {
              this.oneEvent = response.data;
              for (const result of this.oneEvent) {
                if (result.attendeeId == sessionStorage.getItem("userId")) {
                  this.atEvent.push(i);
                  this.allEvent.push(i);
                }
              }
            }, (error) => {
              this.error = error.response.statusText;
              this.errorFlag = true;
            });
      }
    },
    getOneEvent() {
      for (const i of this.eventInfo) {
        this.axios.get('http://localhost:4941/api/v1/events/' + i.eventId)
            .then((response) => {
              this.every = response.data;
              if (this.every.organizerId == sessionStorage.getItem("userId")) {
                  this.orEvent.push(i);
                  this.allEvent.push(i);
              }
            }, (error) => {
              this.error = error.response.statusText;
              this.errorFlag = true;
            });
      }
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
      this.$router.push("/events");
    },
    open() {
      this.$alert(this.error, 'Register Fail', {
        confirmButtonText: 'OK',
      });
    },
    goDetails(eventId) {
      this.$router.push({name: "EventDetails", query: {eventId: eventId}});
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
  width: 1100px;
  margin: auto;
  font-size: larger;
  margin-top: 10px;
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