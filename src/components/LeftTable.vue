
<script>
export default {
    props: ['items'],
    data(){
        return {
            bodyWeight: 67,
            dailyKcal: 2000,
            inputName: "", inputProtein: "", inputCarb: "", inputFat: "", inputCalorie: ""
        }
    },
    computed: {
        weightLossKcal() {
            return this.dailyKcal * 0.8
        },
        sum_calorie() {
            if(this.items.length == 0) {
                return 0
            }
            return this.items.reduce((a, b) => a + (parseFloat(b.calorie / 100) * b.quantity), 0);
        },
        calRemaining() {
            return this.dailyKcal * 0.8 - this.sum_calorie;
        },
    },
    methods: {
        sumByProp(prop) {
            if(this.items.length == 0) return;
            return this.items.reduce((a, b) => a + (parseFloat(b[prop])/100 * b['quantity']), 0);
        },
        propByBodyWeight(prop) {
            return (this.sumByProp(prop) / this.bodyWeight).toFixed(2);
        },
    }
}
</script>

<template>
    <p class="h3 p-2">Alapadatok</p>
    
    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Testsúly: </span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" v-model="bodyWeight">
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Napi ajánlott kalória bevitel: </span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" v-model="dailyKcal" placeholder="{{dailyKcal}}">
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Fogyáshoz szükséges kalória bevitel: </span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="weightLossKcal" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Ajánlott fehérje testsúly-kilónként:</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value="1.5">
    </div>

    <div class="input-group input-group-sm mb-3">
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
            <span class="input-group-text" id="inputGroup-sizing-default">Összes fehérje (edzés előtt❗)</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="sumByProp('protein')" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Összes protein (edzés után❗)</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="sumByProp('protein')" readonly>
    </div>
    
    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Fehérje /tskg</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="propByBodyWeight('protein')" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Összes szénhidrát</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="sumByProp('carb')" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Szénhidrát /tskg</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="propByBodyWeight('carb')" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Összes zsír</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="sumByProp('fat')" readonly>
    </div>

    <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Zsír /tskg</span>
        </div>
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :value="propByBodyWeight('fat')" readonly>
    </div>
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