<script>
export default {
    props: ['items', 'columns'],
    emits: ['delete-item', 'change-quantity'],
    methods: {
        deleteItem(index) {
            this.$emit('delete-item', index)
        },
        changeQuantity(index, event) {
            console.log(index, parseInt(event.target.value))
            this.$emit('change-quantity', index, event.target.value)
        }
    },
}
</script>

<template>
    <table class="table .table-dark">
            <thead>
                <tr>
                    <td class="header" v-for="(column, index) in columns" :key="index">{{column}}</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <td>{{item['name']}}</td>
                    <td>{{item['protein']}}</td>
                    <td>{{item['carb']}}</td>
                    <td>{{item['fat']}}</td>
                    <td>{{item['calorie']}}</td>
                    <td><input type="number" :value="item['quantity']" @change="$event => changeQuantity(index, $event)"></td>
                    <td>{{ ((item['protein'] / 100) * item['quantity']).toFixed(2) }}</td>
                    <td>{{ ((item['carb'] / 100) * item['quantity']).toFixed(2) }}</td>
                    <td>{{ ((item['fat'] / 100) * item['quantity']).toFixed(2) }}</td>
                    <td>{{ ((item['calorie'] / 100) * item['quantity']).toFixed(2) }}</td>
                    <td>
                        <a @click="deleteItem(index)" class="btn btn-info btn-sg">
                            <span class="glyphicon glyphicon-trash"></span> Törlés
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
</template>

<style scoped>
table {
    border-collapse: separate;
    border-spacing: 2px;
}
</style>