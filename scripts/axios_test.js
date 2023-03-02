
import axios from 'axios';

async function getFoodData() {
    var data = JSON.stringify({
      "query": "chicken leg"
    });
    
    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.nal.usda.gov/fdc/v1/foods/list?api_key=DEMO_KEY',
      headers: { 
        'Content-Type': 'application/json', 
        'Cookie': 'ApplicationGatewayAffinity=11bff643906f5fe808001cdadd2da71b; ApplicationGatewayAffinityCORS=11bff643906f5fe808001cdadd2da71b'
      },
      data : data
    };
    
    return axios(config);
}

function handleResult(data) {
    let results = {
        name: data.description,
        calorie: 0,
        fat: 0,
        protein: 0,
        carb: 0,
    }

    data.foodNutrients.forEach( elem => {
        if(elem.name.toLowerCase().includes('protein')) {
            results.protein = elem.amount;
        }
        if(elem.name.toLowerCase().includes('carbohydrate')) {
            results.carb = elem.amount;
        }
        if(elem.name.toLowerCase().includes('energy')) {
            results.carb = elem.amount;
        }
        if(elem.name.toLowerCase().includes('total lipid (fat)')) {
            results.fat = elem.amount;
        }
    })

    return results;
}

await getFoodData()
    .then(res => console.log(handleResult(res.data[0])))
    .catch(err => console.log(err))
