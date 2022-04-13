const fs = require('fs')

const getJson = (path) => JSON.parse(fs.readFileSync(path))

const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), function (err) {
        if (err) throw err;
        console.log('Written to', path);
    }
    );
}

const byCountyCases = getJson('mt-county-case-snapshot.json')

if (byCountyCases.features && byCountyCases.features.length === 56) {
    const data = byCountyCases.features.map(d => d.attributes)

    const totalDeaths = data.reduce((acc, obj) => obj.TotalDeaths + acc, 0)
    const cumulativeCases = data.reduce((acc, obj) => obj.Total + acc, 0)
    const totalActiveCases = data.reduce((acc, obj) => obj.TotalActive + acc, 0)
    const totalNewCases = data.reduce((acc, obj) => obj.NewCases + acc, 0)

    const summary = {
        'CountiesInData': byCountyCases.features.length,
        totalDeaths,
        cumulativeCases,
        totalActiveCases,
        totalNewCases,
    }
    writeJson('./dashboard-total-summary.json', summary)

} else {
    throw 'Not 56 counties in data'
}



// Old, unimplemented processing script
// const full = getJson('full.json')

// const data = full.integrated_county_latest_external_data

// if (data.length > 0) {
//     // conditional here keeps existing data for null data result
//     const mtData = data.filter(d => d['State_name'] === 'Montana')

//     const keepKeys = [
//         'County',
//         'fips_code',
//         'community_transmission_level'
//     ]

//     const mtDataCleaned = mtData.map(d => {
//         const output = {}
//         keepKeys.forEach(key => {
//             output[key] = d[key]
//         })
//         return output
//     })

//     writeJson('./montana-full.json', mtData)
//     writeJson('./montana-cleaned.json', mtDataCleaned)

// }