<script>
import axios from 'axios';
import Popper from "vue3-popper";

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
    components: {
        Popper,
    },
    props: {
        itemsSize: Number
    },
    emits: ["set-item-event", "count-summary", "export-excel", "save-to-cookie", "delete-cookie"],
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
            showSumPopper: false, showExcelExportPopper: false,
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
                    this.querryResult = result.data.length > 0 ? result.data : []
                    if(this.querryResult.length === 0) {
                        button.classList.replace('btn-secondary', 'btn-danger')
                    } else {
                        button.classList.remove('btn-danger')
                        button.classList.remove('btn-secondary')
                        button.classList.add('btn-success')
                    }
                })
                .catch(err => {
                    console.log(err);
                    button.classList.remove('btn-secondary')
                    button.classList.remove('btn-success')
                    button.classList.add('btn-danger')
                    setTimeout(() => button.classList.replace('btn-danger','btn-secondary'), 3000)
                });
            }, 2500)
        },
        excelExport() {
            if(this.itemsSize > 0) {
                this.$emit("export-excel")
            } else {
                this.showExcelExportPopper = true
                setTimeout(()=>this.showExcelExportPopper = false, 2500)
            }
        },
        countSummary() {
            try {
                parseInt(this.cookForDays)
                if(this.cookForDays) {
                    this.$emit('count-summary', this.cookForDays)
                } else {
                    this.showSumPopper = true
                    document.getElementById('numberOfDaysInput').focus()
                    setTimeout(()=>this.showSumPopper = false, 2500)
                }
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
            setTimeout(() => {
                let button = document.getElementById("foundResults");
                button.classList.remove('btn-secondary')
                button.classList.remove('btn-danger')
                button.classList.remove('btn-success')
                button.classList.add('btn-secondary')
            }, 4000)
        },
        saveToCookie() {
            if(this.itemsSize > 0){
                this.$emit('save-to-cookie')
            }
        },
        deleteCookie() {
            this.$emit('delete-cookie')
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
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="foundResults" data-bs-toggle="dropdown" aria-expanded="false" @click="buttonClick" :disabled="querryResult.length === 0">
                        <i class="bi bi-egg-fried"></i> Találatok
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li  v-for="(elem, index) in querryResult.slice(0, 20)" :key="index">
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
                <button type="button" class="btn btn-primary btn-md me-2" @click="$event => addItem($event)">
                    <i class="bi bi-bag-plus-fill"></i> Hozzáadaás</button>
                <button type="button" class="btn btn-primary btn-md me-2" @click="$event => saveToCookie($event)">
                    <i class="bi bi-cloud-download-fill"></i> Mentés cookieba 🍆</button>
                <button type="button" class="btn btn-primary btn-md me-2" @click="$event => deleteCookie($event)">
                    <i class="bi bi-eraser-fill"></i> Cookiek törlése 🧴</button>
            </div>

            <div class="col-3 text-end">
                <Popper content="Nincs mit exportálni 🍿" :show="showExcelExportPopper">
                    <button type="button" class="btn btn-success btn-md" @click="$event => excelExport($event)">
                        <i class="bi bi-file-earmark-spreadsheet"></i> Excel export</button>
                </Popper>
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
                <Popper content="Add meg a napok számát 🗓️" :show="showSumPopper">
                    <button type="button" class="btn btn-secondary btn-md" @click="$event => countSummary($event)">
                        <i class="bi bi-person-lines-fill"></i> Összesítő</button>
                </Popper>
            </div>
        </div>
    </div>
</template>

<style>
:root {
    --popper-theme-background-color: #333333;
    --popper-theme-background-color-hover: #333333;
    --popper-theme-text-color: #ffffff;
    --popper-theme-border-width: 0px;
    --popper-theme-border-style: solid;
    --popper-theme-border-radius: 6px;
    --popper-theme-padding: 32px;
    --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}
</style>