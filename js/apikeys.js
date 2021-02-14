

// File Configures the API information

export function configureKey(){
    let file = "../../../test.env"
    let data = fetch (file).then(x => x.text()).then(function(data){
          let data_cleaned = data.split("=")[1]
          return data_cleaned
     })
    return data
}