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

  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" style="margin-top: 30px">
    <el-form-item label="Title" prop="title" >
      <el-input v-model="ruleForm.title" placeholder="Enter the title of the event"></el-input>
    </el-form-item>
    <el-form-item label="Category" prop="category" >
      <el-checkbox-group v-model="ruleForm.category">
        <el-checkbox v-for="cate in categories" :key="cate.id" :label="cate.id">{{cate.name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Date" required>
      <el-date-picker
          style="float: left"
          v-model="ruleForm.time"
          type="datetime"
          value-format="YYYY-MM-DD hh:mm:ss"
          format="YYYY-MM-DD hh:mm:ss"
          @change="formatTime"
          placeholder="Must be the future date">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="Description" prop="description" >
      <el-input v-model="ruleForm.description" placeholder="Enter the description of the event"></el-input>
    </el-form-item>
    <el-form-item label="Maximum capacity" prop="capacity" >
      <el-input v-model.number="ruleForm.capacity" placeholder="Enter the maximum capacity of the event(number of attendees)"></el-input>
    </el-form-item>
    <el-form-item label="IsOnline" prop="radio">
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
      <el-form-item v-if="ruleForm.radio == false" label="Venue" prop="venue" :required="notOnline" >
        <el-input v-model="ruleForm.venue" placeholder="Enter the Venue of the event (in case of face-to-face events)"></el-input>
      </el-form-item>
    </div>
    <el-form-item label="control attendance status" prop="control" >
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
      <el-input v-model.number="ruleForm.fee" placeholder="Enter the fee of the event (if not enter, the event will be free)"></el-input>
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
      <el-button type="primary" @click="createEvent">Create</el-button>
      <el-button @click="returnPage">Cancel</el-button>
    </el-form-item>

  </el-form>

</template>

<script>
import moment from "moment";
export default {
  name: "CreateEvent",
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
      eventId: '',
      uploadDisabled:false,
      dialogImageUrl: '',
      dialogVisible: false,
      imageUrl: '',
      status: '',
      rules: {
        title: [
          {required: true, message: 'Require Title', trigger: 'blur'},
        ],
        time: [
          {type: 'date', required: true, message: 'Require Date', trigger: 'change'}
        ],
        description: [
          {required: true, message: 'Require Description', trigger: 'blur'}
        ],
        category: [
          {type: 'array', required: true, message: 'Choose at least one category', trigger: 'change'}
        ],
        radio: [
          {
            type: 'boolean',
            required: true,
            message: 'Require event hold method, online or in-person',
            trigger: 'change'
          }
        ],
        capacity: [
          {type: 'number', required: false}
        ],
        control: [
          {
            required: true,
            message: 'Choose whether or not it will be needed to control attendance status',
            trigger: 'blur'
          }
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
    this.status = sessionStorage.getItem('token');
  },
  methods: {
    formatTime(time) {
      this.ruleForm.time = moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    createEvent() {
      this.parameter["title"] = this.ruleForm.title;
      this.parameter["description"] = this.ruleForm.description;
      this.parameter["description"] = this.ruleForm.description;
      this.parameter["requiresAttendanceControl"] = this.ruleForm.control;
      this.parameter["isOnline"] = this.ruleForm.radio;
      if (this.ruleForm.url) {
        this.parameter["url"] = this.ruleForm.url;
      }
      if (this.ruleForm.venue) {
        this.parameter["venue"] = this.ruleForm.venue;
      }
      if (this.ruleForm.capacity) {
        this.parameter["capacity"] = this.ruleForm.capacity;
      }
      if (this.ruleForm.fee) {
        this.parameter["fee"] = this.ruleForm.fee;
      } else {
        this.parameter["fee"] = 0.00;
      }
      if (this.ruleForm.time) {
        this.parameter["date"] = this.ruleForm.time;
      } else {
        this.$message('Must choose the future time for the event', 'ERROR', {
          confirmButtonText: 'OK',
        });
      }
      if (this.ruleForm.category.length != 0) {
        this.parameter["categoryIds"] = this.ruleForm.category;
      }
      if (this.ruleForm.radio === false && !this.ruleForm.venue) {
        this.$alert('Must enter the venue for the in-person event!', 'ERROR', {
          confirmButtonText: 'OK',
        });
        // this.$message({
        //   title: 'ERROR',
        //   message: h('i', {style: 'color: teal'}, 'Must enter the venue for the in-person event!')
        // });
      }
      else if (this.ruleForm.radio === true && this.ruleForm.venue) {
        this.parameter["venue"] = '';
      }
      else if (this.ruleForm.radio === true && !this.ruleForm.url) {
        this.$alert('Must enter the url for the online event!', 'ERROR', {
          confirmButtonText: 'OK',
        });
      }
        this.axios.post('http://localhost:4941/api/v1/events/', this.parameter,
            {headers: {"X-Authorization": sessionStorage.getItem("token")}})
            .then((response) => {
              this.eventId = response.data.eventId;
              this.putImage();
              this.$router.push("/events");
            }, (error) => {
              this.error = error.response.statusText.slice(12);
              this.errorFlag = true;
            });
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
      this.axios.patch("http://localhost:4941/api/v1/events/"+this.eventId+"/image", this.imageUrl,
          { headers: {"X-Authorization": sessionStorage.getItem("token"), "Content-Type": this.imageUrl.type}})
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