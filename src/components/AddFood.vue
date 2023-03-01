<script>

import axios from 'axios';
const URL = 'https://api.nal.usda.gov/fdc/v1/foods/list'

const getFoodNames = async (searchstring) => {
    var result = [];
    const options = {
        method: 'GET',
        url: URL,
        params: { 'api_key': 'DEMO_KEY'},
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            query: searchstring
        },
    }
    console.log(options)
    await axios.request(options)
    .then(res=>console.log(result = res.data))
    .catch(err=>console.log(err))
    return result
}

export default {
    emits: ["set-item-event"],
    data(){
        return {
            inputName: "", inputProtein: "", inputCarb: "", inputFat: "", inputCalorie: "", inputQuantity: "",
            timer: undefined,
            querryResult: []
        }
    },
    methods: {
        addItem() {
            let newLine = {
                "name": this.inputName,
                "protein":this.inputProtein,
                "carb": this.inputCarb,
                "fat": this.inputFat,
                "calorie": this.inputCalorie,
                "quantity":  this.inputQuantity !== 0 ? this.inputQuantity : 100,
            };
            console.log(`adding: ${JSON.stringify(newLine)}`)
            this.$emit('set-item-event', newLine)
            this.inputName = null
            this.inputProtein = null
            this.inputCarb = null
            this.inputFat = null
            this.inputCalorie = null
        },
        textSearch() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                console.log('searching...', this.inputName);
                getFoodNames(this.inputName)
                .then(result => {
                    this.querryResult = result;
                    // this.inputName = result[0].description;
                    console.log(this.querryResult)
                })
                .catch(err => console.log(err));
            }, 2500)
        },
        excelExport() {
            console.log("excel export...")
        }
    }
}
</script>
<template>
    <p class="h3 p-2">Új étel felvétele</p>
    
    <div class="container">
        
        <div class="row">
            <div class="col-9">
                
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Név</span>
                    <input type="text" class="form-control" placeholder="Összetevő" aria-label="Összetevő" aria-describedby="addon-wrapping" v-model="inputName" @keyup="textSearch($event)" >
                </div>
                
            </div>
            <div class="col-3">
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Találatok webről
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
  </ul>
</div>

            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Fehérje</span>
                    <input type="text" class="form-control" aria-label="Fehérje" aria-describedby="addon-wrapping" v-model="inputProtein" placeholder="0 gramm" >
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Szénhidrát</span>
                    <input type="text" class="form-control" aria-label="Szénhidrát" aria-describedby="addon-wrapping" v-model="inputCarb" placeholder="0 gramm" >
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Zsír</span>
                    <input type="text" class="form-control" aria-label="Zsír" aria-describedby="addon-wrapping" v-model="inputFat" placeholder="0 gramm" >
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Kalória</span>
                    <input type="text" class="form-control" aria-label="Kalória" aria-describedby="addon-wrapping" v-model="inputCalorie" placeholder="0 Kcal" >
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Mennyiség</span>
                    <input type="text" class="form-control" aria-label="Mennyiség" aria-describedby="addon-wrapping" v-model="inputQuantity" placeholder="100 gramm">
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-9 float-left">
                <button type="button" class="btn btn-primary btn-lg" @click="$event => addItem($event)">Hozzáadaás a listához</button>
            </div>
            <div class="col-3 float-right">
                <button type="button" class="btn btn-success btn-lg" @click="$event => excelExport($event)">Excel export</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.row {
    margin-top: 5px;
}
</style>