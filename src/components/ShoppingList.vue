<template>
    <table class="table m-4">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Alapanyag</th>
            <th scope="col">Mennyiség</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in shoppingList" :key="index">
            <th scope="row">{{ index +1 }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }} gramm</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default { 
    props: ['items', 'number_of_days'],
    computed: {
        shoppingList() {
            return this.items.map(item => {
                console.log(item)
                console.log(this.number_of_days)
                return {name: item.name, quantity: item.quantity * this.number_of_days}
            })
        }
    }
}
</script>