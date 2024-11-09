<script setup>
import AddFoodVue from './components/AddFood.vue'
import LeftTable from './components/LeftTable.vue'
import MainTable from './components/MainTable.vue'
import ProteinGif from './components/ProteinGif.vue';
import ShoppingList from './components/ShoppingList.vue';
</script>

<template>
  <div class="m-4">
    <div class="row">
      <div class="col-lg-12">
        <h1 class="m-4 text-center">Szuper kalória kalkulátor cukinak 💝</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-7">
        <LeftTable :key="renderLeftTableKey" :items=items v-model:bodyweight="bodyWeight" v-model:dailykcal="dailyKcal" v-model:height="height" v-model:age="age"
          @update-body-data="genderUpdate" />
      </div>
      <div class="col-lg-5">
        <div class="row">
          <AddFoodVue @set-item-event="setItem" @count-summary="countSummary" @export-excel="toExcel"
            @save-to-cookie="saveToCookie" @delete-cookie="deleteCookie" v-model:itemsSize="items.length" />
        </div>
        <div class="row">
          <ProteinGif />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <MainTable @delete-item="deleteItem" @change-quantity="changeQuantity" :items=items :columns=columns />
      </div>
    </div>
    <div class="row mt-2">
      <ShoppingList v-if="number_of_days > 0" :key="number_of_days" :items="items" :number_of_days="number_of_days"
        @hide-myself="hideShoppingList" />
    </div>
  </div>
</template>

<script>
import { VueCookieNext } from 'https://unpkg.com/vue-cookie-next@1.0.0/dist/vue-cookie-next.esm-bundler.js'
import axios from 'axios';
import FileDownload from 'js-file-download';

const COOKIEITEMNAME = 'supercaloriewebappitems'

export default {
  data() {
    return {
      renderLeftTableKey: 0,
      columns: ["Név", "Fehérje", "Szénhidrát", "Zsír", "Kalória", "Mennyiség", "Össz fehérje", "Össz szénhidrát", "Össz zsír", "Össz kalória"],
      items: [],
      bodyWeight: 70,
      dailyKcal: 2000,
      height: 162,
      age: 32,
      inputName: "", inputProtein: "", inputCarb: "", inputFat: "", inputCalorie: "",
      number_of_days: 0,
    }
  },
  mounted() {
    this.$cookie = VueCookieNext;
    if (VueCookieNext.IsCookieAvailable(COOKIEITEMNAME)) {
      try {
        this.items = JSON.parse(this.$cookie.getCookie(COOKIEITEMNAME))
      } catch (err) {
        console.log(err)
        this.$cookie.removeCookie(COOKIEITEMNAME)
      }
    }
  },
  methods: {
    setItem(item) {
      this.items.push(item)
    },
    deleteItem(index) {
      console.log(index)
      if (index >= 0 && index <= this.items.length) {
        this.items.splice(index, 1);
      }
      this.forceRenderLeftTable();
    },
    changeQuantity(index, value) {
      let tmpItems = this.items;
      tmpItems[index]['quantity'] = parseInt(value);
      this.items = tmpItems;
      console.log(this.items)
      this.forceRenderLeftTable();
    },
    forceRenderLeftTable() {
      console.log("rerendering page");
      this.renderLeftTableKey += 1;
    },
    countSummary(days) {
      this.number_of_days = 0
      this.number_of_days = days
    },
    hideShoppingList() {
      this.number_of_days = 0;
    },
    toExcel() {
      let requestBody = {
        gender: this.gender,
        weight: parseFloat(this.bodyWeight),
        dailyKcal: parseInt(this.dailyKcal),
        foods: this.items.map(elem => {
          return {
            name: elem.name,
            protein: parseFloat(elem.protein),
            carb: parseFloat(elem.carb),
            fat: parseFloat(elem.fat),
            calorie: parseFloat(elem.calorie),
            quantity: parseFloat(elem.quantity)
          }
        })
      }
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_BACKEND}/excel`,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/octet-stream"
        },
        responseType: 'arraybuffer',
        data: requestBody
      }

      axios(config)
        .then((response) => {
          let headerLine = response.headers['content-disposition']
          let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          let matches = filenameRegex.exec(headerLine)
          let filename = "etrend.xlsx"
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '')
          }
          FileDownload(new Blob([response.data]), filename)
        })
        .catch(err => {
          console.log(err)
        })
    },
    genderUpdate(gender) {
      switch (gender) {
        case 0:
          this.bodyWeight = 70
          this.dailyKcal = 2000
          this.height = 162
          this.age = 32
          break;
        case 1:
          this.bodyWeight = 80
          this.dailyKcal = 2500
          this.height = 162
          this.age = 32
          break;
        case 2:
          this.bodyWeight = 75
          this.dailyKcal = 2250
          this.height = 162
          this.age = 32
          break;
        default:
          break;
      }
    },
    saveToCookie() {
      this.deleteCookie()
      this.$cookie.setCookie(COOKIEITEMNAME, JSON.stringify(this.items))
    },
    deleteCookie() {
      if (this.$cookie.IsCookieAvailable(COOKIEITEMNAME)) {
        this.$cookie.removeCookie(COOKIEITEMNAME, JSON.stringify(this.items))
      }
    }
  },
}
</script>