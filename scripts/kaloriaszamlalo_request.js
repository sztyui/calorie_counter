import axios from 'axios'
import https from 'https'

async function getFoodData(searchterm) {
  var data = '';
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  var config = {
    httpsAgent: httpsAgent,
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://kaloriabazis.hu/getfood.php?q=${encodeURIComponent(searchterm)}&p=1&s=8&expropsearch_id=0&expropsearch_inc=0&all_public_food=0`,
    headers: { 
      'Cookie': 'PHPSESSID=ealgon810elri5gqb7c4cc3h64; CLANGCODE=HU; LANGID=1; UNITLANGID=1; BWEIGHT_UNIT=1; BHEIGHT_UNIT=1; mob_for_a=0; kab_kalRefresh=20121114; _ga=GA1.2.1517488711.1678004214; _gid=GA1.2.1008436929.1678004214; _gat_gtag_UA_32451787_1=1; PHPSESSID=l9q3q445q2094ng25ulesgtf7f', 
      'Referer': 'https://kaloriabazis.hu/', 
      'Referer-Policy': 'strict-origin-when-cross-origin'
    },
    data : data
  };

  return axios(config)
}

function handleResult(data) {
  return {
    name: data.name,
    calorie: data.cal.replace(' kcal', ''),
    fat: data.fat,
    protein: data.protein,
    carb: data.carbo,
  }  
}

getFoodData('amix whey')
  .then(res => {
    let list = res.data['results2']

    console.log(list)

    console.log(handleResult(list[0]))
  })
  .catch(err => {
    console.log(err)
  })