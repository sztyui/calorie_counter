<script>
import axios from 'axios';

async function getFoodData(searchTerm) {
    var data = JSON.stringify({
      "query": searchTerm
    });

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.nal.usda.gov/fdc/v1/foods/list?api_key=A6DieygpirYbBBDSIWNufVhvBkn0fzC1aQyT3JoT' ,
      headers: { 
        'Content-Type': 'application/json', 
      },
      data : data
    };
    
    return axios(config);
}

function handleResult(data) {
    function getNutrient(list, nutrient) {
        return list.filter( elem => elem.name.toLowerCase().includes(nutrient.toLowerCase()))
    }

    return {
        name: data.description,
        calorie: getNutrient(data.foodNutrients, 'energy'),
        fat: getNutrient(data.foodNutrients, 'total lipid (fat)'),
        protein: getNutrient(data.foodNutrients, 'protein'),
        carb: getNutrient(data.foodNutrients, 'carbohydrate'),
    }
}

export default {
    emits: ["set-item-event", "count-summary", "export-excel"],
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
            querryResult: [],
            summaryTimer: undefined,
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
            if ( this.inputName && this.inputCalorie ){
                this.$emit('set-item-event', newLine)
            } else {
                document.getElementById('inputNameText').focus()
            }
            this.inputName = null
            this.inputProtein = null
            this.inputCarb = null
            this.inputFat = null
            this.inputCalorie = null
            this.inputQuantity = null
        },
        textSearch() {
            let button = document.getElementById("foundResults");
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                getFoodData(this.inputName)
                .then(result => {
                    this.querryResult = result.data;
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
            this.$emit("export-excel")
        },
        countSummary() {
            try {
                parseInt(this.cookForDays)
                clearTimeout(this.summaryTimer)
                this.summaryTimer = setTimeout(() => {
                    this.cookForDays ? 
                        this.$emit('count-summary', this.cookForDays) : document.getElementById('numberOfDaysInput').focus();    
                }, 1000);   
            } catch(err) {
                console.log(err)
                document.getElementById('numberOfDaysInput').focus();
            }
        },
        chooseFood(index) {
           let details = handleResult(this.querryResult[index])
           this.inputName = details.name
           this.inputCalorie = details.calorie[0].amount
           this.inputProtein = details.protein[0].amount
           this.inputCarb = details.carb[0].amount
           this.inputFat = details.fat[0].amount
        },
        buttonClick() {
            let button = document.getElementById("foundResults");
            if (button.classList.contains('btn-success')) {
                button.classList.remove('btn-success')
            }
            button.classList.remove('btn-secondary') 
            button.classList.add('btn-secondary')
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
                    <input type="text" id="inputNameText" class="form-control" placeholder="Összetevő" aria-label="Összetevő" aria-describedby="addon-wrapping" v-model="inputName" @keyup="textSearch($event)" >
                </div>
                
            </div>
            <div class="col-2 text-end">
                
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="foundResults" data-bs-toggle="dropdown" aria-expanded="false" @click="buttonClick">
                        Találatok
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li v-for="(elem, index) in querryResult.slice(0, 20)" :key="index">
                            <a class="dropdown-item" href="#" @click="chooseFood(index)">{{ elem.description }}</a>
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
                    <input id="numberOfDaysInput" type="text" class="form-control" aria-label="Mennyiség" aria-describedby="addon-wrapping" v-model="cookForDays" placeholder="5 nap" @keyup="$event => countSummary($event)">
                </div>
            </div>
            <div class="col-2 text-end">
                <button type="button" class="btn btn-secondary btn-md" @click="$event => countSummary($event)">Összesítő</button>
            </div>
        </div>
    </div>
</template>