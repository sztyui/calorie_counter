<script setup>
import AddFoodVue from './components/AddFood.vue'
import LeftTable from './components/LeftTable.vue'
import MainTable from './components/MainTable.vue'
import ProteinGif from './components/ProteinGif.vue';
import ShoppingList from './components/ShoppingList.vue';

import * as XLSX from 'xlsx/xlsx.mjs'
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
        <LeftTable 
          :key="renderLeftTableKey"
          :items=items 
          v-model:bodyweight="bodyWeight"
          v-model:dailykcal="dailyKcal"
          @update-body-data="genderUpdate"
          />
      </div>
      <div class="col-lg-5">
        <div class="row">
          <AddFoodVue 
            @set-item-event="setItem" 
            @count-summary="countSummary" 
            @export-excel="toExcel"
            @save-to-cookie="saveToCookie"
            @delete-cookie="deleteCookie"
            v-model:itemsSize="items.length"/>
        </div>
        <div class="row">
          <ProteinGif />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <MainTable 
        @delete-item="deleteItem"
        @change-quantity="changeQuantity"
        :items=items 
        :columns=columns />
      </div>
    </div>
    <div class="row mt-2">
      <ShoppingList 
        v-if="number_of_days > 0"
        :key="number_of_days"
        :items="items"
        :number_of_days="number_of_days"
        @hide-myself="hideShoppingList"
      />
    </div>
  </div>
</template>

<script>
import { VueCookieNext } from 'https://unpkg.com/vue-cookie-next@1.0.0/dist/vue-cookie-next.esm-bundler.js'

export default {
  data(){
    return {
      renderLeftTableKey: 0,
      columns: ["Név", "Fehérje", "Szénhidrát", "Zsír", "Kalória", "Mennyiség", "Össz fehérje", "Össz szénhidrát", "Össz zsír", "Össz kalória"],
      items: [],
      bodyWeight: 67,
      dailyKcal: 2000,
      inputName: "", inputProtein: "", inputCarb: "", inputFat: "", inputCalorie: "",
      number_of_days: 0,
    }
  },
  mounted() {
    this.$cookie = VueCookieNext;
    if(VueCookieNext.IsCookieAvailable('items')) {
      try {
        console.log('cookie loaded in')
        this.items = JSON.parse(this.$cookie.getCookie('items'))
      } catch(err) {
        console.log(err)
        this.$cookie.removeCookie('items')
      }
    }
  },
  methods: {
    setItem(item) {
      this.items.push(item)
    },
    deleteItem(index) {
      console.log(index)
      if(index >= 0 && index <= this.items.length) {
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
      let d = new Date().toLocaleDateString('hu')
      let data = this.items.map(elem => {
        return [
          elem.name,
          elem.protein,
          elem.carb,
          elem.fat,
          elem.calorie,
          elem.quantity,
          ((elem.protein / 100) * elem.quantity).toFixed(2),
          ((elem.carb / 100) * elem.quantity).toFixed(2),
          ((elem.fat / 100) * elem.quantity).toFixed(2),
          ((elem.calorie / 100) * elem.quantity).toFixed(2),
        ]
      })
      const workbook = XLSX.utils.book_new()

      const ws = XLSX.utils.aoa_to_sheet(data, {origin: 'A2'})
      XLSX.utils.sheet_add_aoa(ws, [this.columns], {origin: 'A1'})
      XLSX.utils.book_append_sheet(workbook, ws, 'Hozzávalók')

      console.log(this.number_of_days)
      if(this.number_of_days > 0) {
        let summary = this.items.map(item => {
                  return [item.name, item.quantity * this.number_of_days]
              })
        const ws2 = XLSX.utils.aoa_to_sheet(summary, {origin: 'A2'})
        XLSX.utils.sheet_add_aoa(ws2, [['Alapanyag', 'Mennyiség']], {origin: 'A1'})
        XLSX.utils.book_append_sheet(workbook, ws2, 'Bevásárlólista')
      }


      XLSX.writeFile(workbook, `${d}_etrend.xlsx`)
    },
    genderUpdate(gender) {
      switch (gender) {
        case 0:
          this.bodyWeight = 67
          this.dailyKcal = 2000
          break;
        case 1:
          this.bodyWeight = 80
          this.dailyKcal = 2500
          break;
        case 2:
          this.bodyWeight = 75
          this.dailyKcal = 2250
          break;
        default:
          break;
      }
    },
    saveToCookie() {
      this.deleteCookie()
      this.$cookie.setCookie('items', JSON.stringify(this.items))
      console.log('saved into cookie')
    },
    deleteCookie() {
      if(this.$cookie.IsCookieAvailable('items')){
        this.$cookie.removeCookie('items', JSON.stringify(this.items))
      } 
    }
  },
}
</script>