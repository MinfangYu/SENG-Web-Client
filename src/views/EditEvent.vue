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
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" style="margin-top: 10px">
    <el-form-item label="Title">
      <el-input v-model="ruleForm.title" :placeholder="eventInfo.title"></el-input>
    </el-form-item>
    <el-form-item label="Category" prop="category" >
      <el-checkbox-group v-model="ruleForm.category">
        <el-checkbox v-for="cate in categories" :key="cate.id" :label="cate.id">{{cate.name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Date" >
      <el-date-picker
          style="float: left"
          v-model="ruleForm.time"
          type="datetime"
          value-format="YYYY-MM-DD hh:mm:ss"
          format="YYYY-MM-DD hh:mm:ss"
          @change="formatTime"
          :placeholder="time">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="Description">
      <el-input v-model="ruleForm.description" :placeholder="eventInfo.description"></el-input>
    </el-form-item>
    <el-form-item label="Maximum capacity">
      <el-input v-model.number="ruleForm.capacity" :placeholder="eventInfo.capacity"></el-input>
    </el-form-item>
    <el-form-item label="Hold method" prop="radio">
      <el-select v-model="ruleForm.radio" placeholder="online or in-person" style="float: left">
        <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.name"
            :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <div v-if="ruleForm.radio === true">
    <el-form-item  label="URL" prop="url" :required="isOnline">
      <el-input v-model="ruleForm.url" placeholder="Enter the URL of the event (in case of online events)"></el-input>
    </el-form-item>
    </div>
    <div v-if="ruleForm.radio === false">
      <el-form-item  label="URL" prop="url" >
        <el-input v-model="ruleForm.url" placeholder="Enter the URL of the event (in case of online events)"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.radio == false" label="Venue" prop="venue" :required="notOnline">
        <el-input v-model="ruleForm.venue" placeholder="Enter the Venue of the event (in case of face-to-face events)"></el-input>
      </el-form-item>
    </div>
    <el-form-item label="control attendance status">
      <el-select v-model="ruleForm.control" placeholder="Need control attendance status or not" style="float: left">
        <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.name"
            :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Fee" prop="fee">
      <el-input v-model.number="ruleForm.fee" :placeholder="eventInfo.fee"></el-input>
    </el-form-item>
    <el-form-item label="Event Picture">
      <el-upload
          :class="{hide: uploadDisabled}"
          action="https://jsonplaceholder.typicode.com/posts/"
          accept=".jpeg,.png,.gif"
          list-type="picture-card"
          :limit="1"
          :auto-upload="false"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :on-change="handleChange"
          :on-preview="handlePictureCardPreview"
      >
        <i class="el-icon-plus"></i>
        <template #tip>
          <div class="el-upload__tip">
            Can only upload JPEG, PNG, or GIF picture
          </div>
        </template>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="\">
      </el-dialog>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="EditEvent">Create</el-button>
      <el-button @click="returnPage">Cancel</el-button>
    </el-form-item>

  </el-form>

</template>

<script>
import moment from "moment";
export default {
  name: "EditEvent",
  data() {
    let validateOnline = (rule, value, callback) => {
      if (this.ruleForm.radio === true && value == '') {
        callback(new Error('Must enter the event URL'));
      } else {
        callback();
      }
    };
    let validateInperson = (rule, value, callback) => {
      if (this.ruleForm.radio === false && value == '') {
        callback(new Error('Must enter the event Venue'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        time: '',
        title: '',
        capacity: '',
        description: '',
        eventId: '',
        radio: '',
        url: '',
        venue: '',
        control: '',
        fee: '',
        category: [],
      },
      option: [{
        value: true,
        name: "online"
      }, {
        value: false,
        name: "in-person"
      }],
      option2: [{
        value: true,
        name: "Need control attendance status"
      }, {
        value: false,
        name: "Not need control attendance status"
      }],
      size: '',
      categoryInfo: {},
      categories: '',
      error: "",
      errorFlag: false,
      parameter: {},
      eventId: this.$route.query.eventId,
      uploadDisabled:false,
      dialogImageUrl: '',
      dialogVisible: false,
      imageUrl: '',
      eventInfo: [],
      time:'',
      load: false,
      status:'',
      rules: {
        category: [
          {type: 'array', message: 'Choose at least one category', trigger: 'change'}
        ],

        url: [
          {validator: validateOnline, trigger: 'blur'}
        ],
        venue: [
          {validator: validateInperson, trigger: 'blur'}
        ],
      },
    }
  },
  computed: {
    isOnline: function () {
      return this.ruleForm.radio === true
    },
    notOnline: function () {
      return this.ruleForm.radio === false
    }
  },
  mounted() {
    this.getCategories();
    this.getOneEvent();
    this.status = sessionStorage.getItem('token');
  },
  methods: {
    formatTime(time) {
      this.ruleForm.time = moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    getOneEvent() {
      this.axios.get('http://localhost:4941/api/v1/events/'+this.eventId, {params: {"id": this.eventId}})
          .then((response) => {
            this.eventInfo = response.data;
            this.title = response.data.title;
            this.time = moment(this.eventInfo.date).format("YYYY-MM-DD HH:mm:ss"),
            this.eventInfo["type"] = [];
            this.eventInfo["img"] =  'http://localhost:4941/api/v1/events/'+this.eventId+'/image';
            this.eventInfo["organizerImg"] = 'http://localhost:4941/api/v1/users/'+this.eventInfo.organizerId+'/image';
            this.eventInfo.categories.forEach((id)=>{
              this.eventInfo.type.push(this.categoryInfo[id]);
            })
            if (this.eventInfo.fee==0.00) {
              this.eventInfo.fee = "free";
            }
            if (this.eventInfo.organizerId == sessionStorage.getItem("userId")) {
              this.isOrganizer = true;
            }
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    EditEvent() {
      if (!this.ruleForm.title) {
        this.parameter["title"] = this.eventInfo.title;
      }
      if (!this.ruleForm.description) {
        this.parameter["description"] = this.eventInfo.description;
      }
      if (!this.ruleForm.categoryIds) {
        this.parameter["categoryIds"] = this.eventInfo.categoryIds;
      }
      if (!this.ruleForm.date) {
        this.parameter["date"] = this.time;
      }
      if (!this.ruleForm.capacity && this.eventInfo.capacity) {
        this.parameter["capacity"] = this.eventInfo.capacity;
      }
      if (!this.ruleForm.requiresAttendanceControl) {
        this.parameter["requiresAttendanceControl"] = Boolean(this.eventInfo.requiresAttendanceControl);
      }
      if (!this.ruleForm.fee && this.eventInfo.fee != "free") {
        this.parameter["fee"] = parseInt(this.eventInfo.fee);
      }
      if (this.ruleForm.url) {
        this.parameter["url"] = this.ruleForm.url;
      }
      if (this.ruleForm.venue) {
        this.parameter["venue"] = this.ruleForm.venue;
      }if (this.ruleForm.radio === false && !this.ruleForm.venue) {
        this.$alert('Must enter the venue for the in-person event', 'ERROR', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'error',
              message: `action: ${ action }`
            });
          }
        });
      } else if (this.ruleForm.radio === true && !this.ruleForm.url) {
        this.parameter["venue"] = 'null';
        this.$alert('Must enter the url for the online event', 'ERROR', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'error',
              message: `action: ${ action }`
            });
          }
        });

      } else {
        this.axios.patch('http://localhost:4941/api/v1/events/'+this.eventId, this.parameter,
            {params: {id: this.eventId},
              headers: {"X-Authorization": sessionStorage.getItem("token")}})
            .then(() => {
              this.putImage();
              this.$router.push("/events");
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
            response.data.forEach((cate) => {
              this.categoryInfo[cate.id] = cate.name;
            });
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    putImage() {
      this.axios.put("http://localhost:4941/api/v1/events/"+this.eventId+"/image", this.imageUrl,
          { params: {id: this.eventId},
            headers: {"X-Authorization": sessionStorage.getItem("token"), "Content-Type": this.imageUrl.type}})
          .then(() => {
            // this.$router.push("/users/my");
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    returnPage() {
      this.$router.push("/events");
    },
    handleChange(file,fileList){
      this.imageUrl = file.raw;
      if(fileList.length >= 1){
        this.uploadDisabled = true;
      }
    },
    handleRemove() {
      this.uploadDisabled = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif';
      if (!isJPG) {
        this.$message.error("Can only upload JPEG, PNG, or GIF picture!");
      }
      return isJPG;
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
.demo-ruleForm{
  margin: auto;
  width: 1000px;
}
.hide /deep/ .el-upload--picture-card {
  display: none;
}
.el-menu-demo {
  margin-top: -60px;
}
</style>