<template>

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
      <div v-if="userstatus === null">
        <el-menu-item index="2-1" >Register</el-menu-item>
        <el-menu-item index="2-2" >Login</el-menu-item>
        <el-menu-item index="2-3" disabled>Profile</el-menu-item>
        <el-menu-item index="2-4" disabled>Logout</el-menu-item>
      </div>
      <div v-if="userstatus != null">
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

  <el-descriptions class="margin-top" :title="title" :column="1" :size="size" border >
    <template #extra>
      <el-button v-if="isOrganizer == true && future == true" type="primary" @click="dialogVisible = true" style="margin-right: 20px">Delete</el-button>
      <el-dialog
          title="Attention"
          v-model="dialogVisible"
          width="30%">
        <span>Confirm to delete</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" size="large" @click="deleteEvent">Confirm</el-button>
          </span>
        </template>
      </el-dialog>
      <el-button v-if="isOrganizer == true && future === false" type="primary" size="large" @click="deleteEvent" style="margin-right: 10px">Delete</el-button>
      <el-button v-if="isOrganizer == true" type="primary" size="large" @click="editEvent($route.query.eventId)" style="margin-right: 10px">Edit</el-button>
      <el-button v-if="future === true && joined === false" type="primary" size="large" @click="attendEvent">Interest</el-button>
      <el-button v-if="future === true && joined === true" type="primary" size="large" disabled>Interest</el-button>
      <el-button v-if="future === true && joined === false" type="primary" size="large" disabled>Cancel Interest</el-button>
      <el-button v-if="future === true && joined === true" type="primary" size="large" @click="removeEvent">Cancel Interest</el-button>
      <el-button type="primary" @click="returnPage" style="margin-left: 50px">Return</el-button>
    </template>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-picture-outline-round"></i>
        Event Image
      </template>
      <img :src="eventImg" class="image">
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-user"></i>
        Organizer
      </template>
      <img :src="eventInfo.organizerImg" class="userImg">
      {{eventInfo.organizerFirstName}} {{eventInfo.organizerLastName}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-date"></i>
        Date and time
      </template>
      {{eventInfo.date}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-paperclip"></i>
        Categories
      </template>
      {{eventInfo.type}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-edit-outline"></i>
        Description
      </template>
      {{eventInfo.description}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-office-building"></i>
        Capacity
      </template>
      {{eventInfo.capacity}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-check"></i>
        Number of attendees
      </template>
      {{eventInfo.attendeeCount}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-link"></i>
        Event URL
      </template>
      {{eventInfo.url}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-place"></i>
        Venue
      </template>
      {{eventInfo.venue}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-money"></i>
        Fee
      </template>
      {{eventInfo.fee}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-s-custom"></i>
        List of attendees
      </template>
      <el-switch v-model="value" active-text="Hide attendees" inactive-text="Show attendees" active-color="#ff4949" inactive-color="#13ce66">
      </el-switch>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-money"></i>
        Similar events
      </template>
      <div v-for="i in result" v-bind:key="i.eventId">
        <router-link :to="{name: 'EventDetails', query: {eventId: i.eventId}}" > {{i.title}}</router-link>
      </div>
    </el-descriptions-item>
  </el-descriptions>
  <div v-if="value===false">
    <label class="text" style="margin-top: 15px;color: #2c3e50; font-weight: bold"> List of attendees</label>
  <el-descriptions  class="users" v-for="attendee in attendees" :key="attendee.attendeeId" direction="vertical" :column="3" :size="size" border>
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-user"></i>
          <label class="text" style="width: 100px">Name</label>
        </template>
        {{attendee.firstName}} {{attendee.lastName}}
      </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-picture-outline-round"></i>
        <label class="text" style="width: 100px">Profile Image</label>
      </template>
      <img :src="attendee.img" class="userImg">
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-paperclip"></i>
        <label class="text" style="width: 100px">Role</label>
      </template>
      <label v-if="attendee.attendeeId == eventInfo.organizerId"
          class="text" style="margin-top: 15px;color: #2c3e50; font-weight: bold; width: 100px"> Organizer </label>
      <label v-if="attendee.attendeeId != eventInfo.organizerId"
             class="text" style="margin-top: 15px;color: #2c3e50; font-weight: bold; width: 100px "> Attendee </label>
      <el-select v-model="statusChoose" placeholder="Accept or not">
        <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="controlAttendance" style="margin-left: 20px">Confirm</el-button>
    </el-descriptions-item>
  </el-descriptions>
  </div>
</template>

<script>
import moment from "moment";
import {h} from "vue";

export default {
  name: "EventDetails",
  data () {
    return {
      value: true,
      size: '',
      eventId: this.$route.query.eventId,
      eventInfo: '',
      title: '',
      categories:'',
      categoryInfo: {},
      attendees:[],
      events:[],
      similar:[],
      isOrganizer: false,
      now: new Date(),
      dialogVisible: false,
      eventImg:'',
      joined:false,
      future:false,
      status: [{
        value: '1',
        label: 'accepted'
      }, {
        value: '2',
        label: 'pending'
      }, {
        value: '3',
        label: 'rejected'
      }],
      statusChoose:'',
      userstatus: '',
      activeIndex: '1',
      result:[],
    }
  },
  mounted() {
    this.getCategories();
    this.getOneEvent();
    this.getAttendees();
    this.userstatus = sessionStorage.getItem('token');
  },
  // created() {
  //   this.getCategories();
  //   this.getOneEvent();
  //   this.getAttendees();
  // },
  // updated() {
  //   this.getCategories();
  //   this.getOneEvent();
  //   this.getAttendees();
  // },
  methods: {
    returnPage() {
      this.$router.push("/events");
    },
    checkTime() {
      this.eventInfo.date = moment(this.eventInfo.date).format("YYYY-MM-DD HH:mm:ss");
      this.now = moment(this.now).format("YYYY-MM-DD HH:mm:ss");
      if (this.eventInfo.date > this.now) {
        this.future = true;
      }
    },
    getOneEvent() {
      this.axios.get('http://localhost:4941/api/v1/events/'+this.eventId, {params: {"id": this.eventId}})
          .then((response) => {
            this.eventInfo = response.data;
            this.checkTime();
            this.title = response.data.title;
            this.eventInfo["type"] = [];
            this.eventInfo["img"] =  'http://localhost:4941/api/v1/events/'+this.eventId+'/image';
            this.eventImg = 'http://localhost:4941/api/v1/events/'+this.eventId+'/image';
            this.eventInfo["organizerImg"] = 'http://localhost:4941/api/v1/users/'+this.eventInfo.organizerId+'/image';
            this.eventInfo.categories.forEach((id)=>{
              this.eventInfo.type.push(this.categoryInfo[id]);
            })
            if (this.eventInfo.fee==0.00) {
              this.eventInfo.fee = "free";
            }
            if (!this.eventInfo.url) {
              this.eventInfo.url = "null";
            }
            if (!this.eventInfo.date) {
              this.eventInfo.date = "null";
            }
            if (!this.eventInfo.title) {
              this.title = "null";
            }
            if (!this.eventInfo.organizerFirstName && !this.eventInfo.organizerLastName) {
              this.eventInfo.organizerFirstName = "null";
              this.eventInfo.organizerLastName = "null";
            }
            if (!this.eventInfo.type) {
              this.eventInfo.type = "null";
            }
            if (!this.eventInfo.capacity) {
              this.eventInfo.capacity = "null";
            }
            if (!this.eventInfo.attendeeCount) {
              this.eventInfo.attendeeCount = 0;
            }
            if (!this.eventInfo.venue) {
              this.eventInfo.venue = "null";
            }
            if (!this.eventInfo.img) {
              this.eventInfo.img = "null";
            }
            this.getSimilarEvents();
            if (this.eventInfo.organizerId == sessionStorage.getItem("userId")) {
              this.isOrganizer = true;
            }
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
            response.data.forEach((cate)=>{
              this.categoryInfo[cate.id] = cate.name;
            });
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    getAttendees() {
      this.axios.get('http://localhost:4941/api/v1/events/'+this.eventId+'/attendees', {params: {"id": this.eventId},
        headers: {"X-Authorization": sessionStorage.getItem("token")}})
          .then((response) => {
            this.attendees = response.data;
            for (const user of this.attendees) {
              user["img"] = 'http://localhost:4941/api/v1/users/'+user.attendeeId+'/image';
            }
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    getSimilarEvents() {
      this.axios.get('http://localhost:4941/api/v1/events/')
          .then((response) => {
            this.events = response.data;
            for (const i of this.events) {
              i.categories.forEach((id) => {
                this.eventInfo.categories.forEach((cate) => {
                  if(id == cate) {
                    if (!this.similar.includes(i.title)){
                      this.similar.push(i);
                    }
                  }
                })
              })
            }
            if (this.similar == []) {
              this.similar = "No similar events"
            }
            for (let i=0; i<this.similar.length; i++) {
              for (let j=i+1; j<this.similar.length; j++) {
                  if (this.similar[i]==this.similar[j]) {
                    this.similar.splice(j,1);
                    j--;
                }
              }
            }
            for (const i of this.similar) {
              if(i.eventId != this.eventId) {
                this.result.push(i);
              }
            }
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    deleteEvent() {
      this.dialogVisible = false;
      this.eventInfo.date = moment(this.eventInfo.date).format("YYYY-MM-DD HH:mm:ss");
      this.now = moment(this.now).format("YYYY-MM-DD HH:mm:ss");
      if (this.isOrganizer === true && this.eventInfo.date > this.now) {
        this.axios.delete('http://localhost:4941/api/v1/events/'+this.eventId, {headers: {"X-Authorization": sessionStorage.getItem("token")}})
            .then(() => {
              this.$router.push("/events");
            }, (error) => {
              this.error = error.response.statusText;
              this.errorFlag = true;
            });
      } else {
        this.$message({
          type: 'error',
          message: h('i', {style: 'color: teal'}, 'Cannot delete past event!')
        });
      }
    },
    editEvent(eventId) {
      this.eventInfo.date = moment(this.eventInfo.date).format("YYYY-MM-DD HH:mm:ss");
      this.now = moment(this.now).format("YYYY-MM-DD HH:mm:ss");
      if (this.isOrganizer === true && this.eventInfo.date > this.now) {
        this.$router.push({name: "EditEvent", query: {eventId: eventId}});
      } else {
        this.$message({
          type: 'error',
          message: h('i', {style: 'color: teal'}, 'Cannot edit past event!')
        });
      }
    },
    attendEvent() {
      this.eventInfo.date = moment(this.eventInfo.date).format("YYYY-MM-DD HH:mm:ss");
      this.now = moment(this.now).format("YYYY-MM-DD HH:mm:ss");
      if (!sessionStorage.getItem("token")) {
        this.$alert('Please register or login first', 'Notice', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      } else {
        if (this.eventInfo.date > this.now) {
          if(this.eventInfo.capacity == 'null') {
            this.axios.post('http://localhost:4941/api/v1/events/' + this.eventId+'/attendees', this.eventId, {params: {"id": this.eventId},
              headers: {"X-Authorization": sessionStorage.getItem("token")}})
                .then(() => {
                  this.joined = true;
                  this.$message({
                    type: 'success',
                    message: h('i', {style: 'color: teal'}, 'You interest this event successfully !')
                  });
                  this.eventInfo.attendeeCount += 1;
                }, (error) => {
                  this.error = error.response.statusText;
                  this.errorFlag = true;
                  if(error.response.status == 403) {
                    this.joined = true;
                    this.$message({
                      type: 'error',
                      message: h('i', {style: 'color: teal'}, 'You have already interested this event before !')
                    });
                  }
                  console.log(this.joined)
                });
          } else if(this.eventInfo.capacity != 'null') {
            if (this.eventInfo.attendeeCount >= this.eventInfo.capacity) {
              this.joined = true;
              this.$alert('Sorry, the event already in its full capacity, you cannot join it.', 'Notice', {
                confirmButtonText: 'OK',
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: `action: ${ action }`
                  });
                }
              });
            } else {
              this.axios.post('http://localhost:4941/api/v1/events/' + this.eventId+'/attendees', this.eventId, {params: {"id": this.eventId},
                headers: {"X-Authorization": sessionStorage.getItem("token")}})
                  .then(() => {
                    this.joined = true;
                    this.$message({
                      type: 'Success',
                      message: h('i', {style: 'color: teal'}, 'You interest this event successfully !')
                    });
                    this.eventInfo.attendeeCount += 1;
                  }, (error) => {
                    this.error = error.response.statusText;
                    this.errorFlag = true;
                    if(error.status == 403) {
                      this.joined = true;
                      this.$message({
                        type: 'error',
                        message: h('i', {style: 'color: teal'}, 'You have already interested this event before !')
                      });
                    }
                  });
            }
          }
        } else {
          this.$message({
            type: 'error',
            message: h('i', {style: 'color: teal'}, 'Cannot attend past event!')
          });
        }
      }
    },
    removeEvent() {
      this.eventInfo.date = moment(this.eventInfo.date).format("YYYY-MM-DD HH:mm:ss");
      this.now = moment(this.now).format("YYYY-MM-DD HH:mm:ss");
      if (!sessionStorage.getItem("token")) {
        this.$alert('Please register or login first', 'Notice', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      } else {
        if (this.eventInfo.date > this.now) {
          this.axios.delete('http://localhost:4941/api/v1/events/' + this.eventId+'/attendees', {params: {"id": this.eventId},
            headers: {"X-Authorization": sessionStorage.getItem("token")}})
              .then(() => {
                this.joined = false;
                this.$message({
                  type: 'success',
                  message: h('i', {style: 'color: teal'}, 'You have cancel your attendance!')
                });
                this.eventInfo.attendeeCount -= 1;
              }, (error) => {
                this.error = error.response.statusText;
                this.errorFlag = true;
                if(error.status == 403) {
                  this.joined = false;
                  this.$message({
                    type: 'error',
                    message: h('i', {style: 'color: teal'}, 'You have already cancelled your attendance before!')
                  });
                }
              });
        } else {
          this.$message({
            type: 'error',
            message: h('i', {style: 'color: teal'}, 'Cannot attend past event!')
          });
        }
      }
    },
    controlAttendance() {
      for (const user of this.attendees) {
        let para = {};
        if(this.statusChoose === '1') {
          para = {"status": "accepted"}
        } else if (this.statusChoose === '2') {
          para = {"status": "pending"}
        } else if (this.statusChoose === '3') {
          para = {"status": "rejected"}
        }
        this.axios.patch('http://localhost:4941/api/v1/events/' + this.eventId+'/attendees/'+ user.attendeeId, para,
            {params: {"event_id": this.eventId, "user_id": user.attendeeId},
          headers: {"X-Authorization": sessionStorage.getItem("token")}})
            .then(() => {
              this.$message({
                type: 'success',
                message: h('i', {style: 'color: teal'}, 'You have  change the status successfully!')
              });
              this.eventInfo.attendeeCount -= 1;
            }, (error) => {
              this.error = error.response.statusText;
              this.errorFlag = true;
            });
      }

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
  },
  watch: {
    $route() {
      this.$router.go(0);
    }
  },
}
</script>

<style scoped>
.margin-top{
  margin: auto;
  width: 1200px;
  font-size: 15px;
  margin-top: 20px;
}
.users{
  margin:auto;
  width: 1200px;
  font-size: 15px;
}
.image {
  width: 290px;
  height: 250px;
}
.userImg {
  width: 175px;
  height: 150px;
}
.el-menu-demo {
  margin-top: -60px;
}
</style>