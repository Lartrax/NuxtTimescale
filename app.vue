<template>
  <div
    class="w-full h-screen flex justify-center items-center bg-white dark:invert"
  >
    <div class="w-4/5 flex flex-col items-center gap-8">
      <div class="flex flex-col gap-2 w-full sm:flex-row">
        <label>https://go-api-postgres-7xqyrnpuaq-ew.a.run.app/v1/ </label>
        <select
          v-model="selected"
          class="border-black border hover:bg-orange-50"
        >
          <option>get</option>
          <option>add</option>
          <option>join</option>
          <option>update</option>
          <option>delete</option>
        </select>
        <label> /employees/ </label>
        <!--Selection for column-->
        <select
          v-model="command"
          class="border-black border hover:bg-orange-50"
        >
          <option></option>
          <option>first_name</option>
          <option>id</option>
          <option>last_name</option>
          <option>phone</option>
          <option>email</option>
          <option>birthdate</option>
          <option>startdate</option>
          <option>enddate</option>
          <option>salary</option>
          <option>boss_id</option>
          <option>department_id</option>
        </select>
      </div>
      <!--If update is selected, two data inputs will be displayed-->
      <div v-if="selected == 'update'" class="w-full grid grid-cols-2 gap-5">
        <div>
          <label>Employee id </label>
          <input
            v-model="dataToSend"
            v-on:keyup.enter="getData()"
            class="border-black border pl-1 w-full hover:bg-orange-50"
          />
        </div>
        <div>
          <label>Updated value </label>
          <input
            v-model="dataToSend2"
            v-on:keyup.enter="getData()"
            class="border-black border pl-1 w-full hover:bg-orange-50"
          />
        </div>
      </div>
      <!--If add, delete or get is selected only one input is shown-->
      <div
        v-if="selected == 'add' || selected == 'delete' || selected == 'get'"
        class="w-full"
      >
        <label v-if="selected == 'add'" for="input">Employee first_name</label>
        <label v-else for="input">Value</label>
        <input
          id="input"
          v-model="dataToSend"
          v-on:keyup.enter="getData()"
          class="border-black border pl-1 w-full hover:bg-orange-50"
        />
      </div>
      <!--Buttons-->
      <div class="flex flex-row gap-10">
        <!--Button1-->
        <div>
          <button v-if="showEmpty" @click="showEmpty = false">
            Hide empty
          </button>
          <button v-if="!showEmpty" @click="showEmpty = true">
            Show empty
          </button>
        </div>
        <!--Button2-->
        <div>
          <button v-if="showOnlyIdName" @click="showOnlyIdName = false">
            Show only name and id
          </button>
          <button v-if="!showOnlyIdName" @click="showOnlyIdName = true">
            Show everything
          </button>
        </div>
      </div>
      <!--Big table-->
      <div id="table" class="overflow-y-scroll w-full max-h-[50vh]">
        <div class="bg-white p-2 shadow-inner">
          <div
            v-for="(item, id) in responseData"
            :key="id"
            class="p-2 shadow mb-2 odd:bg-orange-100 even:bg-white"
          >
            <p v-if="item.first_name">first_name : {{ item.first_name }}</p>
            <p v-if="item.id">
              id :
              <i
                class="cursor-copy active:text-neutral-400"
                v-on:focus="$event.target.select()"
                @click="copyText(item.id)"
                title="Click to copy"
              >
                {{ item.id }}
              </i>
              <button
                @click="insert(item.id)"
                class="text-xs shadow border border-gray-500 rounded-full ml-2 px-2 py-0.5 active:text-neutral-400 hover:bg-orange-50 hover:border-gray-300"
              >
                insert
              </button>
            </p>
            <div v-if="showOnlyIdName">
              <p v-if="item.last_name.Valid || showEmpty">
                last_name : {{ item.last_name.String }}
              </p>
              <p v-if="item.phone.Valid || showEmpty">
                phone : {{ item.phone.String }}
              </p>
              <p v-if="item.email.Valid || showEmpty">
                email : {{ item.email.String }}
              </p>
              <p v-if="item.birthdate.Valid || showEmpty">
                birthdate : {{ item.birthdate.String }}
              </p>
              <p v-if="item.startdate.Valid || showEmpty">
                startdate : {{ item.startdate.String }}
              </p>
              <p v-if="item.enddate.Valid || showEmpty">
                enddate : {{ item.enddate.String }}
              </p>
              <p v-if="item.salary.Valid || showEmpty">
                salary : {{ item.salary.String }}
              </p>
              <p v-if="item.boss_id.Valid || showEmpty">
                boss_id :
                <i
                  class="cursor-copy active:text-neutral-400"
                  v-on:focus="$event.target.select()"
                  @click="copyText(item.boss_id.String)"
                  title="Click to copy"
                >
                  {{ item.boss_id.String }}
                </i>
              </p>
              <p v-if="item.department_id.Valid || showEmpty">
                department_id : {{ item.department_id.String }}
              </p>
              <p v-if="item.department_name.Valid || showEmpty">
                department_name : {{ item.department_name.String }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p v-if="status == 'Success'" class="text-green-400 dark:invert">
        {{ status }}
      </p>
      <p v-if="status == 'Failed'" class="text-red-400 dark:invert">
        {{ status }}
      </p>
      <button
        @click="buttonGetData()"
        class="border rounded-md p-4 px-12 min-w-min w-2/4 sm:w-1/4 duration-100 ease-in-out"
        :class="buttonStyle"
      >
        {{ buttonTitle }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: "",
      showEmpty: false,
      showOnlyIdName: false,
      responseData: [],
      dataToSend: "",
      dataToSend2: "",
      command: "",
      selected: "get",
      timer: 0,
      buttonTitle: "Query",
      buttonStyle:
        "border-black hover:rounded-xl hover:scale-105 hover:bg-orange-100 active:bg-orange-200",
    };
  },
  computed: {},
  methods: {
    async copyText(mytext) {
      await navigator.clipboard.writeText(mytext);
    },
    insert(mytext) {
      this.dataToSend = mytext;
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async buttonGetData() {
      if (this.timer < Date.now()) {
        this.timer = Date.now() + 1500;
        this.getData();
        this.buttonStyle = "bg-gray-100 border-red-500 cursor-not-allowed";
        for (let i = 0; i < 100; i++) {
          this.buttonTitle = (100 - i) / 100;
          await this.sleep(10);
        }
        this.buttonTitle = "Query";
        this.buttonStyle =
          "border-black hover:rounded-xl hover:scale-105 hover:bg-orange-100 active:bg-orange-200";
      }
    },
    getData() {
      this.showEmpty = false;
      this.showOnlyIdName = false;
      if (this.selected == "add") {
        fetch(
          `https://go-api-postgres-7xqyrnpuaq-ew.a.run.app/v1/add/employees`,
          {
            method: "POST",
            body: `{"first_name": "${this.dataToSend}"}`,
          }
        )
          .then((response) => response.json())
          .then(() => {
            this.status = "Success";
          })
          .catch((error) => {
            console.error("Error:", error);
            this.status = "Failed";
          });
      } else if (this.selected == "update") {
        fetch(
          `https://go-api-postgres-7xqyrnpuaq-ew.a.run.app/v1/update/employees/${this.command}`,
          {
            method: "POST",
            body: `{"id": "${this.dataToSend}", "value": "${this.dataToSend2}"}`,
          }
        )
          .then((response) => response.json())
          .then(() => {
            this.status = "Success";
          })
          .catch((error) => {
            console.error("Error:", error);
            this.status = "Failed";
          });
      } else if (this.selected == "join") {
        fetch(
          `https://go-api-postgres-7xqyrnpuaq-ew.a.run.app/v1/join/employees`
        )
          .then((response) => response.json())
          .then((data) => {
            this.responseData = data;
            this.status = "Success";
          })
          .catch((error) => {
            console.error("Error:", error);
            this.status = "Failed";
          });
      } else if (this.selected == "get") {
        if (this.command) {
          fetch(
            `https://go-api-postgres-7xqyrnpuaq-ew.a.run.app/v1/get/employees/${this.command}`,
            {
              method: "POST",
              body: `{"value": "${this.dataToSend}"}`,
            }
          )
            .then((response) => response.json())
            .then((data) => {
              this.responseData = data;
              this.status = "Success";
            })
            .catch((error) => {
              console.error("Error:", error);
              this.status = "Failed";
            });
        } else {
          fetch(
            `https://go-api-postgres-7xqyrnpuaq-ew.a.run.app/v1/get/employees`
          )
            .then((response) => response.json())
            .then((data) => {
              this.responseData = data;
              this.status = "Success";
            })
            .catch((error) => {
              console.error("Error:", error);
              this.status = "Failed";
            });
        }
      } else if (this.selected == "delete") {
        if (
          confirm(
            `You are about to delete all employees with value ${this.dataToSend} in column ${this.command}.`
          ) == true
        ) {
          fetch(
            `https://go-api-postgres-7xqyrnpuaq-ew.a.run.app//v1/delete/employees/${this.command}`,
            {
              method: "POST",
              body: `{"value": "${this.dataToSend}"}`,
            }
          )
            .then((response) => response.json())
            .then(() => {
              this.status = "Success";
            })
            .catch((error) => {
              console.error("Error:", error);
              this.status = "Failed";
            });
        }
      }
    },
  },
};
</script>

<style scoped>
#table {
  overflow: overlay;
  background-clip: text;
  background-color: #00000000;
  transition: background-color 200ms ease;
}
#table:hover {
  overflow: overlay;
  background-color: #00000011;
}
::-webkit-scrollbar {
  display: block;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: inherit;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #00000022;
}
::-webkit-scrollbar-track-piece:end {
  background: transparent;
  margin-bottom: 10px;
}
::-webkit-scrollbar-track-piece:start {
  background: transparent;
  margin-top: 10px;
}
</style>
