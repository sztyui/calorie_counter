
<script>
export default {
    props: {
        items: Array,
        bodyweight: String(),
        height: String(),
        age: String(),
        //dailykcal: String(),
    },
    emits: ['update-body-data'],
    data(){
        return {
            inputName: "", inputProtein: "", inputCarb: "", inputFat: "", inputCalorie: "",
            goal: {
                activityModifier: 1.15,
                calorieModifier: 0.75,
                protein: {ratio: 0.4, value: 4},
                carbs: {ratio: 0.4, value: 4},
                fat: {ratio: 0.2, value: 9},
            },
        }
    },
    computed: {
        dailykcal() {
            return ((this.bodyweight * 10 + this.height * 6.25) - 5 * this.age - 161 ) * this.goal.activityModifier
        },
        weightLossKcal() {
            return this.dailykcal *this.goal.calorieModifier
        },
        sum_calorie() {
            if(this.items.length == 0) {
                return 0
            }
            return this.items.reduce((a, b) => a + (parseFloat(b.calorie / 100) * b.quantity), 0);
        },
        calRemaining() {
            return (this.dailykcal * 0.8 - this.sum_calorie).toFixed(2);
        },
        sumProtein() {
            return ( this.weightLossKcal * this.goal.protein.ratio ) / this.goal.protein.value
        },
        sumCarbs() {
            return ( this.weightLossKcal * this.goal.carbs.ratio ) / this.goal.carbs.value
        },
        sumFat() {
            return ( this.weightLossKcal * this.goal.fat.ratio ) / this.goal.fat.value
        }

    },
    methods: {
        sumByProp(prop) {
            if(this.items.length === 0) return 0;
            return this.items.reduce((a, b) => a + (parseFloat(b[prop])/100 * b['quantity']), 0).toFixed(2);
        },
        propByBodyWeight(prop) {
            if(this.items.length === 0) {
                return 0
            }
            return (this.sumByProp(prop) / this.bodyweight).toFixed(2);
        },
        updateBodyWeight(event) {
            this.$emit('update:bodyweight', event.target.value);
        },
        updateCalorie(event){
            this.$emit('update:dailykcal', event.target.value);
        },
        updateBodyData(event){
            this.$emit('update-body-data', parseInt(event.target.value))
            document.getElementById('bodyWeightInput').focus()
        },
        updateHeight(event) {
            this.$emit('update:height', parseInt(event.target.value))
            document.getElementById('heightInput').focus()
        },
        updateAge(event) {
            this.$emit('update:age', parseInt(event.target.value))
            document.getElementById('ageInput').focus()
        },
        updateActivityValues(event) {
            switch (event.target.value) {
                case "0":
                    this.goal.activityModifier = 1.15
                    break;
                case "1":
                    this.goal.activityModifier = 1.2
                    break;
                case "2":
                    this.goal.activityModifier = 1.4
                    break;
                case "3":
                    this.goal.activityModifier = 1.6
                    break;
                case "4":
                    this.goal.activityModifier = 1.8
                    break;
            
                default:
                    break;
            }
        },
        updateGoalValues(event) {
            switch (event.target.value) {
                case "0":
                    this.goal = {
                        activityModifier: this.goal.activityModifier,
                        calorieModifier: 0.75,
                        protein: {ratio: 0.4, value: 4},
                        carbs: {ratio: 0.4, value: 4},
                        fat: {ratio: 0.2, value: 9},
                    }
                    break;
                case "1":
                    this.goal = {
                        activityModifier: this.goal.activityModifier,
                        calorieModifier: 1.0,
                        protein: {ratio: 0.3, value: 4},
                        carbs: {ratio: 0.45, value: 4},
                        fat: {ratio: 0.25, value: 9},
                    }
                    break;
                case "2":
                    this.goal = {
                        activityModifier: this.goal.activityModifier,
                        calorieModifier: 1.1,
                        protein: {ratio: 0.25, value: 4},
                        carbs: {ratio: 0.55, value: 4},
                        fat: {ratio: 0.2, value: 9},
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
</script>

<template>
    <div class="row">
        <div class="col-4"><p class="h3 p-2">Alapadatok</p></div>
        <div class="col-8 mt-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="genderRadioButton" id="inlineRadio1" value="0" checked v-on:change="updateBodyData">
                <label class="form-check-label" for="inlineRadio1">Nő 🙋‍♀️</label>
                </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="genderRadioButton" id="inlineRadio2" value="1" v-on:change="updateBodyData">
                <label class="form-check-label" for="inlineRadio2">Férfi 💁‍♂️</label>
                </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="genderRadioButton" id="inlineRadio3" value="2" v-on:change="updateBodyData">
                <label class="form-check-label" for="inlineRadio3">LMBTQ+ 🌈</label>
            </div>
        </div>
    </div>
    
    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Testsúly: </span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="bodyWeightInput" :value="bodyweight" @input="updateBodyWeight">
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Magasság: </span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="heightInput" :value="height" @input="updateHeight">
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Kor: </span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="ageInput" :value="age" @input="updateAge">
    </div>

    <div class="row">
        <div class="col-4"><p class="h5 p-2">Mi a célod?</p></div>
        <div class="col-8 mt-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="goalRadioButton" id="goalRadio1" value="0" checked v-on:change="updateGoalValues">
                <label class="form-check-label" for="goalRadio1">Fogyás 🤸‍♂️</label>
                </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="goalRadioButton" id="goalRadio2" value="1" v-on:change="updateGoalValues">
                <label class="form-check-label" for="goalRadio2">Szintentartás</label>
                </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="goalRadioButton" id="goalRadio3" value="2" v-on:change="updateGoalValues">
                <label class="form-check-label" for="goalRadio3">Tömegnövelés 🍜</label>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-4"><p class="h5 p-2">Mennyit mozogsz egy nap?</p></div>
        <div class="col-8 mt-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="activityButton" id="activityRadio1" value="0" checked v-on:change="updateActivityValues">
                <label class="form-check-label" for="activityRadio1">Semmit (minimális vagy nulla edzés)</label>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-4"></div>
        <div class="col-8 mt-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="activityButton" id="activityRadio2" value="1" v-on:change="updateActivityValues">
                <label class="form-check-label" for="activityRadio2">Keveset (heti 1-3 óra edzés)</label>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-4"></div>
            <div class="col-8 mt-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="activityButton" id="activityRadio3" value="2" v-on:change="updateActivityValues">
                <label class="form-check-label" for="activityRadio3">Átlagos (heti 4-6 óra edzés)</label>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-4"></div>
        <div class="col-8 mt-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="activityButton" id="activityRadio4" value="3" v-on:change="updateActivityValues">
                <label class="form-check-label" for="activityRadio4">Több, mint átlagos (heti 7-9 óra edzés)</label>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-4"></div>
        <div class="col-8 mt-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="activityButton" id="activityRadio4" value="3" v-on:change="updateActivityValues">
                <label class="form-check-label" for="activityRadio4">Több, mint átlagos (heti 7-9 óra edzés)</label>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-4"></div>
        <div class="col-8 mt-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="activityButton" id="activityRadio5" value="4" v-on:change="updateActivityValues">
                <label class="form-check-label" for="activityRadio5">Sokat 💪 (heti 10 óránál több edzés)</label>
            </div>
        </div>
    </div>


    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Napi alap kalória bevitel: </span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="dailykcal.toFixed(2)" placeholder="2000 Kcal" @input="updateCalorie" id="dailyKcalInput">
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Fogyáshoz szükséges kalória bevitel: </span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="weightLossKcal.toFixed(2)" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Összes fehérje</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="sumProtein.toFixed(2)" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Összes szénhidrát</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="sumCarbs.toFixed(2)" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Összes zsír</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="sumFat.toFixed(2)" readonly>
    </div>


    <!-- div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Fehérje testsúly-kilónként:</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value="1.5">
    </div>

    <  div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Ajánlott szénhidrát kilónként:</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value="2">
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Összes kalória</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="sum_calorie.toFixed(2)" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Fennmaradó kalória</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="calRemaining" readonly>
    </div>

    
    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Fehérje /tskg</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="propByBodyWeight('protein')" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Szénhidrát /tskg</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="propByBodyWeight('carb')" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Zsír /tskg</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="propByBodyWeight('fat')" readonly>
    </-->
</template>

<style scoped>
#foods {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

#foods td, #foods th {
    border: 1px solid #ddd;
    padding: 8px;
}

#foods tr:nth-child(even){background-color: #f2f2f2;}

#foods tr:hover {background-color: #ddd;}

#foods th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
}

table {
    border-collapse: collapse;
    width: 90%;
}

th, td {
    text-align: left;
    padding: 8px;
}

td:nth-child(2) {
    text-align: right;
    padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2}

th {
    background-color: #04AA6D;
    color: white;
}

* {
    box-sizing: border-box;
}

.row {
    margin-left:-5px;
    margin-right:-5px;
}

.column {
    float: left;
    width: 50%;
    padding: 5px;
}
body {
    border: 30px solid white;
}
.header {
    font-weight: bold;
}
</style>