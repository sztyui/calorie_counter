<script setup>
import AddFoodVue from './components/AddFood.vue'
import LeftTable from './components/LeftTable.vue'
import MainTable from './components/MainTable.vue'
import ProteinGif from './components/ProteinGif.vue';
</script>

<template>
  <div class="m-4">
    <div class="row">
      <div class="col-lg-12">
        <h1 class="m-4 text-center">{{message}}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-7">
        <LeftTable 
          :key="renderLeftTableKey"  
          :items=items />
      </div>
      <div class="col-lg-5">
        <div class="row">
          <AddFoodVue @set-item-event="setItem" @count-summary="countSUmmary"/>
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
  </div>
</template>

<script>
export default {
  data(){
    return {
      renderLeftTableKey: 0,
      message: "Szuper kalória kalkulátor cukinak 💝",
      bodyWeight: 67,
      dailyKcal: 2000,
      columns: ["Név", "Fehérje", "Szénhidrát", "Zsír", "Kalória", "Mennyiség", "Össz fehérje", "Össz szénhidrát", "Össz zsír", "Össz kalória"],
      items: [{
        "name": "Csirkemell",
        "protein": 22.5,
        "carb": 0.1,
        "fat": 1.0,
        "calorie": 143,
        "quantity": 100,
      }],
      inputName: "", inputProtein: "", inputCarb: "", inputFat: "", inputCalorie: ""
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
    countSUmmary(days) {
      console.log(`TODO: count summary ${days} for days`)
    }
  },
}
</script>
