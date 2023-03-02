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
    emits: ["set-item-event", "count-summary"],
    data(){
        return {
            inputName: "", 
            inputProtein: "", 
            inputCarb: "", 
            inputFat: "", 
            inputCalorie: "", 
            inputQuantity: "", 
            cookForDays: undefined,
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
                let button = document.getElementById("foundResults");
                getFoodNames(this.inputName)
                .then(result => {
                    this.querryResult = result;
                    if (button.classList.contains('btn-secondary')) {
                        button.classList.remove('btn-secondary')
                    }
                    button.classList.add('btn-success')
                })
                .catch(err => {
                    console.log(err);
                    if (button.classList.contains('btn-secondary')) {
                        button.classList.remove('btn-secondary')
                    }
                    if(button.classList.contains('btn-success')) {
                        button.classList.remove('btn-success')
                    }
                    button.classList.add('btn-danger')
                    setTimeout(() => {
                        if(button.classList.contains('btn-danger')) {
                            button.classList.remove('btn-danger')
                        }
                        button.classList.add('btn-secondary');
                    }, 3000)
                });
            }, 2500)
        },
        excelExport() {
            console.log("excel export...")
        },
        countSummary() {
            this.cookForDays ? 
                this.$emit('count-summary', this.cookForDays) : document.getElementById('numberOfDaysInput').focus();
        }
    }
}
</script>
<template>
    <p class="h3 p-2">Új étel felvétele</p>
    
    <div class="container">

        <div class="row mt-2">
            <div class="col-10">
                
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Név</span>
                    <input type="text" class="form-control" placeholder="Összetevő" aria-label="Összetevő" aria-describedby="addon-wrapping" v-model="inputName" @keyup="textSearch($event)" >
                </div>
                
            </div>
            <div class="col-2 text-end">
                
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="foundResults" data-bs-toggle="dropdown" aria-expanded="false">
                        Találatok
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li v-for="(elem, index) in querryResult.slice(0, 20)" :key="index">
                            <a class="dropdown-item" href="#">{{ elem.description }}</a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>

        <div class="row mt-2">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Fehérje</span>
                    <input type="text" class="form-control" aria-label="Fehérje" aria-describedby="addon-wrapping" v-model="inputProtein" placeholder="0 gramm" >
                </div>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Szénhidrát</span>
                    <input type="text" class="form-control" aria-label="Szénhidrát" aria-describedby="addon-wrapping" v-model="inputCarb" placeholder="0 gramm" >
                </div>
            </div>
        </div>
        
        <div class="row mt-2">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Zsír</span>
                    <input type="text" class="form-control" aria-label="Zsír" aria-describedby="addon-wrapping" v-model="inputFat" placeholder="0 gramm" >
                </div>
            </div>
        </div>
        
        <div class="row mt-2">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Kalória</span>
                    <input type="text" class="form-control" aria-label="Kalória" aria-describedby="addon-wrapping" v-model="inputCalorie" placeholder="0 Kcal" >
                </div>
            </div>
        </div>
        
        <div class="row mt-2">
            <div class="col">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Mennyiség</span>
                    <input type="text" class="form-control" aria-label="Mennyiség" aria-describedby="addon-wrapping" v-model="inputQuantity" placeholder="100 gramm">
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-9 text-start">
                <button type="button" class="btn btn-primary btn-md" @click="$event => addItem($event)">Hozzáadaás</button>
            </div>
            <div class="col-3 text-end">
                <button type="button" class="btn btn-success btn-md" @click="$event => excelExport($event)">Excel export</button>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-10">
                <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">Hány napra főznél?</span>
                    <input id="numberOfDaysInput" type="text" class="form-control" aria-label="Mennyiség" aria-describedby="addon-wrapping" v-model="cookForDays" placeholder="5 nap">
                </div>
            </div>
            <div class="col-2 text-end">
                <button type="button" class="btn btn-secondary btn-md" @click="$event => countSummary($event)">Összesítő</button>
            </div>
        </div>
    </div>
</template>