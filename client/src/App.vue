<template>
  <div id="app">
    <div class="p-10 flex" v-if="!joined">
      <input
        class="border p-2 w-full outline-none"
        @keyup.enter="joinChat()"
        type="text"
        placeholder="Your name"
        v-model="userName"
      />
      <button class="w-20 bg-orange-400" @click="joinChat()">Join</button>
    </div>
    <div v-else class="h-screen flex flex-col">
      <div
        id="messages-container"
        class="flex-1 p-2 overflow-y-auto"
        ref="messages"
      >
        <div
          class="message py-2 bg-gray-100 px-5 mb-2 shadow rounded-full"
          v-for="(message, index) in messages"
          :key="index"
        >
          <strong
            :class="{ 'text-pink-500': message.user === 'You' }"
            v-if="message.user"
            >{{ message.user }}:</strong
          >
          {{ message.text }}
        </div>
      </div>
      <div id="input-box" class="flex-shrink-0 flex p-2 w-full">
        <input
          v-model="message"
          @keyup.enter="sendMessage()"
          type="text"
          class="rounded-l-md border w-full h-8 outline-none p-2"
        /><button
          class="w-20 bg-orange-400 rounded-r-md"
          @click="sendMessage()"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      messages: [],
      message: "",
      userName: "",
      joined: false
    };
  },
  methods: {
    joinChat() {
      if (!this.userName.length) {
        return;
      }
      this.$socket.emit("new-user", this.userName);
      this.messages.push({
        text: "You joined"
      });
      this.joined = true;
    },
    scollToBottom() {
      this.$nextTick(() => {
        this.$refs.messages.children[
          this.$refs.messages.children.length - 1
        ].scrollIntoView();
      });
    },
    sendMessage() {
      if (!this.message.length) {
        return;
      }
      console.log(this.message);
      this.$socket.emit("send-chat-message", this.message);
      this.messages.push({
        user: "You",
        text: this.message
      });
      this.message = "";
      this.scollToBottom();
    }
  },
  created() {
    let self = this;

    this.sockets.subscribe("chat-message", function(msg) {
      console.log(msg);
      self.messages.push({
        user: msg.name,
        text: msg.message
      });
      this.scollToBottom();
    });

    this.sockets.subscribe("user-connected", function(name) {
      console.log(name);
      self.messages.push({
        text: name + " joined"
      });
      this.scollToBottom();
    });

    this.sockets.subscribe("user-disconnected", function(name) {
      console.log(name);
      self.messages.push({
        text: name + " left"
      });
      this.scollToBottom();
    });
  }
};
</script>

<style lang="scss">
@import "tailwindcss/base";

@import "tailwindcss/components";

@import "tailwindcss/utilities";
</style>
